// Convert blocks to Markdown
export function blocksToMarkdown(blocks) {
  return blocks.map(block => {
    switch (block.type) {
      case 'heading1':
        return `# ${block.content}\n`;

      case 'heading2':
        return `## ${block.content}\n`;

      case 'heading3':
        return `### ${block.content}\n`;

      case 'heading4':
        return `#### ${block.content}\n`;
      
      case 'paragraph':
        return `${block.content}\n`
      
      case 'list':
        return block.content.split('\n')
          .map(item => item.trim())
          .filter(item => item)
          .map(item => `- ${item.replace(/^[-*•]\s*/, "")}`)
          .join('\n') + '\n'
      
      case 'quote':
        return `> ${block.content}\n`
      
      case 'code':
        return `\`\`\`\n${block.content}\n\`\`\`\n`
      
      case 'image':
        return `![](${block.content})\n`

      case "video":
        return `<video controls src="${block.content}"></video>\n`;
      
      case "text-image": {
        const text = (block.content.text || "").replace(/\n/g, "<br>");
        const image = block.content.image || "";

        return `
| ${text} | ![](${image}) |
|---|---|
`
      }

      case "image-text": {
        const text = (block.content.text || "").replace(/\n/g, "<br>");
        const image = block.content.image || "";

        return `
| ![](${image}) | ${text} |
|---|---|
`;
      }
      
      
      default:
        return `${block.content}\n`
    }
  }).join('\n')
}

export function markdownToBlocks(markdown) {
  if (!markdown) return [];

  const blocks = [];
  const lines = markdown.split("\n");
  let currentList = null;
  let inCode = false;
  let codeBuffer = [];
  let i = 0;

  const newId = () => Date.now() + Math.floor(Math.random() * 99999);

  const extractImage = (str) => {
    const match = str.match(/!\[\]\((.*?)\)/);
    return match ? match[1] : null;
  };

  const extractText = (str) => {
    return str.replace(/!\[\]\((.*?)\)/g, "").replace(/<br>/g, "\n").trim();
  };

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();

    // -----------------------------
    // CODE BLOCKS
    // -----------------------------
    if (line.startsWith("```")) {
      if (inCode) {
        blocks.push({
          id: newId(),
          type: "code",
          content: codeBuffer.join("\n"),
        });
        codeBuffer = [];
        inCode = false;
      } else {
        inCode = true;
      }
      i++;
      continue;
    }

    if (inCode) {
      codeBuffer.push(raw);
      i++;
      continue;
    }

    // -----------------------------
    // TEXT-IMAGE / IMAGE-TEXT ROW
    // format: | left | right |
    // -----------------------------
    if (/^\|(.+)\|(.+)\|$/.test(raw)) {
      const cols = raw.split("|").filter((x) => x.trim() !== "");

      if (cols.length === 2) {
        const left = cols[0].trim();
        const right = cols[1].trim();

        const leftImg = extractImage(left);
        const rightImg = extractImage(right);

        // IMAGE | TEXT
        if (leftImg && !rightImg) {
          blocks.push({
            id: newId(),
            type: "image-text",
            content: {
              image: leftImg,
              text: extractText(right),
            },
          });
          // Skip the separator line if it exists
          if (i + 1 < lines.length && /^\|\s*-+\s*\|\s*-+\s*\|$/.test(lines[i + 1])) {
            i += 2;
          } else {
            i++;
          }
          continue;
        }

        // TEXT | IMAGE
        if (!leftImg && rightImg) {
          blocks.push({
            id: newId(),
            type: "text-image",
            content: {
              text: extractText(left),
              image: rightImg,
            },
          });
          // Skip the separator line if it exists
          if (i + 1 < lines.length && /^\|\s*-+\s*\|\s*-+\s*\|$/.test(lines[i + 1])) {
            i += 2;
          } else {
            i++;
          }
          continue;
        }
      }
    }

    // Skip table separator lines
    if (/^\|\s*-+\s*\|\s*-+\s*\|$/.test(raw)) {
      i++;
      continue;
    }

    // -----------------------------
    // VIDEO (<video src="..." />)
    // -----------------------------
    if (line.startsWith("<video") && line.includes("src=")) {
      const match = line.match(/src="([^"]+)"/);
      const src = match ? match[1] : "";

      blocks.push({
        id: newId(),
        type: "video",
        content: src,
      });
      i++;
      continue;
    }

    // -----------------------------
    // IMAGE ![](url)
    // remote OR base64
    // -----------------------------
    if (line.startsWith("![](") && line.endsWith(")")) {
      const url = line.slice(4, -1); // inside ()
      blocks.push({
        id: newId(),
        type: "image",
        content: url,
      });
      i++;
      continue;
    }

    // -----------------------------
    // HEADINGS (check longest first)
    // -----------------------------
    if (line.startsWith("#### ")) {
      blocks.push({ id: newId(), type: "heading4", content: line.slice(5) });
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push({ id: newId(), type: "heading3", content: line.slice(4) });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ id: newId(), type: "heading2", content: line.slice(3) });
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push({ id: newId(), type: "heading1", content: line.slice(2) });
      i++;
      continue;
    }

    // -----------------------------
    // QUOTES
    // -----------------------------
    if (line.startsWith("> ")) {
      blocks.push({
        id: newId(),
        type: "quote",
        content: line.substring(2),
      });
      i++;
      continue;
    }

    // -----------------------------
    // LISTS
    // -----------------------------
    if (line.match(/^[-*•]\s+/)) {
      if (!currentList) {
        currentList = {
          id: newId(),
          type: "list",
          content: line,
        };
      } else {
        currentList.content += "\n" + line;
      }
      i++;
      continue;
    } else if (currentList) {
      blocks.push(currentList);
      currentList = null;
      // Don't increment i here, process the current line as a different block type
      continue;
    }

    // -----------------------------
    // PARAGRAPH (including empty lines)
    // -----------------------------
    if (line.length > 0) {
      blocks.push({
        id: newId(),
        type: "paragraph",
        content: line,
      });
    }
    
    i++;
  }

  // Don't forget to push the last list if it exists
  if (currentList) blocks.push(currentList);

  return blocks;
}

// // Convert Markdown to blocks
// export function markdownToBlocks(markdown) {
//   if (!markdown) return [];

//   const blocks = [];
//   const lines = markdown.split("\n");
//   let currentList = null;
//   let inCode = false;
//   let codeBuffer = [];

//   const newId = () => Date.now() + Math.floor(Math.random() * 99999);

//   const extractImage = (str) => {
//     const match = str.match(/!\[\]\((.*?)\)/);
//     return match ? match[1] : null;
//   };

//   const extractText = (str) => {
//     return str.replace(/!\[\]\((.*?)\)/g, "").trim();
//   };

//   for (let i = 0; i < lines.length; i++) {
//     const raw = lines[i];
//     const line = raw.trim();

//     // -----------------------------
//     // CODE BLOCKS
//     // -----------------------------
//     if (line.startsWith("```")) {
//       if (inCode) {
//         blocks.push({
//           id: newId(),
//           type: "code",
//           content: codeBuffer.join("\n"),
//         });
//         codeBuffer = [];
//         inCode = false;
//       } else {
//         inCode = true;
//       }
//       continue;
//     }

//     if (inCode) {
//       codeBuffer.push(raw);
//       continue;
//     }

//     // -----------------------------
//     // TEXT-IMAGE / IMAGE-TEXT ROW
//     // format: | left | right |
//     // -----------------------------
//     if (/^\|(.+)\|(.+)\|$/.test(raw)) {
//       const cols = raw.split("|").filter((x) => x.trim() !== "");

//       if (cols.length === 2) {
//         const left = cols[0].trim();
//         const right = cols[1].trim();

//         const leftImg = extractImage(left);
//         const rightImg = extractImage(right);

//         // IMAGE | TEXT
//         if (leftImg && !rightImg) {
//           blocks.push({
//             id: newId(),
//             type: "image-text",
//             content: {
//               image: leftImg,
//               text: extractText(right),
//             },
//           });
//           continue;
//         }

//         // TEXT | IMAGE
//         if (!leftImg && rightImg) {
//           blocks.push({
//             id: newId(),
//             type: "text-image",
//             content: {
//               text: extractText(left),
//               image: rightImg,
//             },
//           });
//           continue;
//         }
//       }
//     }

//     // -----------------------------
//     // VIDEO (<video src="..." />)
//     // -----------------------------
//     if (line.startsWith("<video") && line.includes("src=")) {
//       const match = line.match(/src="([^"]+)"/);
//       const src = match ? match[1] : "";

//       blocks.push({
//         id: newId(),
//         type: "video",
//         content: src,
//       });
//       continue;
//     }

//     // -----------------------------
//     // IMAGE ![](url)
//     // remote OR base64
//     // -----------------------------
//     if (line.startsWith("![](") && line.endsWith(")")) {
//       const url = line.slice(4, -1); // inside ()
//       blocks.push({
//         id: newId(),
//         type: "image",
//         content: url,
//       });
//       continue;
//     }

//     // -----------------------------
//     // HEADINGS
//     // -----------------------------
//     if (line.startsWith("#### ")) {
//       blocks.push({ id: newId(), type: "heading4", content: line.slice(5) });
//       continue;
//     }
//     if (line.startsWith("### ")) {
//       blocks.push({ id: newId(), type: "heading3", content: line.slice(4) });
//       continue;
//     }
//     if (line.startsWith("## ")) {
//       blocks.push({ id: newId(), type: "heading2", content: line.slice(3) });
//       continue;
//     }
//     if (line.startsWith("# ")) {
//       blocks.push({ id: newId(), type: "heading1", content: line.slice(2) });
//       continue;
//     }

//     // -----------------------------
//     // QUOTES
//     // -----------------------------
//     if (line.startsWith("> ")) {
//       blocks.push({
//         id: newId(),
//         type: "quote",
//         content: line.substring(2),
//       });
//       continue;
//     }

//     // -----------------------------
//     // LISTS
//     // -----------------------------
//     if (line.match(/^[-*•] /)) {
//       if (!currentList) {
//         currentList = {
//           id: newId(),
//           type: "list",
//           content: line,
//         };
//       } else {
//         currentList.content += "\n" + line;
//       }
//       continue;
//     } else if (currentList) {
//       blocks.push(currentList);
//       currentList = null;
//     }

//     if (/^\|\s*-+\s*\|\s*-+\s*\|$/.test(raw)) {
//       continue; // skip the row and do NOT add paragraph
//     }

//     // -----------------------------
//     // PARAGRAPH
//     // -----------------------------
//     if (line.length > 0) {
//       blocks.push({
//         id: newId(),
//         type: "paragraph",
//         content: line,
//       });
//     }
//   }

//   if (currentList) blocks.push(currentList);

//   return blocks;
// }