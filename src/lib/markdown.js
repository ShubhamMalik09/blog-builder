// Convert blocks to Markdown
export function blocksToMarkdown(blocks) {
  return blocks.map(block => {
    console.log("BLOCK →", block.type, block.content);
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
          .map(item => item.startsWith('•') ? item : `• ${item}`)
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
|  |  |
|---|---|
| ${text} | ![](${image}) |`;
      }

      case "image-text": {
        const text = (block.content.text || "").replace(/\n/g, "<br>");
        const image = block.content.image || "";

        return `
|  |  |
|---|---|
| ![](${image}) | ${text} |
`;
      }
      
      
      default:
        return `${block.content}\n`
    }
  }).join('\n')
}

// Convert Markdown to blocks
export function markdownToBlocks(markdown) {
  if (!markdown) return []
  
  const blocks = []
  const lines = markdown.split('\n')
  let currentBlock = null
  let inCodeBlock = false
  let codeContent = []
  
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = lines[i].trim();
    
    // Handle code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        blocks.push({
          id: Date.now() + i,
          type: 'code',
          content: codeContent.join('\n')
        })
        codeContent = []
        inCodeBlock = false
      } else {
        inCodeBlock = true
      }
      continue
    }
    
    if (inCodeBlock) {
      codeContent.push(rawLine)
      continue
    }

    if (line.startsWith("|") && line.endsWith("|")) {
      const cells = line.split("|").filter((c) => c.trim() !== "");

      if (cells.length === 2) {
        const left = cells[0].trim();
        const right = cells[1].trim();

        const extractImage = (str) => {
          const match = str.match(/\!\[\]\((.*?)\)/);
          return match ? match[1] : null;
        };

        const extractText = (str) => {
          return str.replace(/\!\[\]\((.*?)\)/g, "").trim();
        };

        const leftIsImage = extractImage(left);
        const rightIsImage = extractImage(right);

        if (leftIsImage && !rightIsImage) {
          blocks.push({
            id: Date.now() + i,
            type: "image-text",
            content: {
              image: leftIsImage,
              text: extractText(right),
            },
          });
          continue;
        }

        if (!leftIsImage && rightIsImage) {
          blocks.push({
            id: Date.now() + i,
            type: "text-image",
            content: {
              text: extractText(left),
              image: rightIsImage,
            },
          });
          continue;
        }
      }
    }

    if (line.startsWith("<video") && line.includes("src=")) {
      const match = line.match(/src="([^"]+)"/);
      const src = match ? match[1] : "";

      if (src && src.startsWith("data:video")) {
        blocks.push({
          id: Date.now() + i,
          type: "video",
          content: src,
        });
        continue;
      }
    }

    if (line.startsWith("![](") && line.endsWith(")")) {
      const src = line.substring(4, line.length - 1);

      if (src && src.startsWith("data:image")) {
        blocks.push({
          id: Date.now() + i,
          type: "image",
          content: src,
        });
        continue;
      }
    }

    if (line.startsWith("#### ")) {
      blocks.push({
        id: Date.now() + i,
        type: "heading4",
        content: line.substring(5),
      });
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push({
        id: Date.now() + i,
        type: "heading3",
        content: line.substring(4),
      });
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push({
        id: Date.now() + i,
        type: "heading2",
        content: line.substring(3),
      });
      continue;
    }
    
    // Handle headings
    if (line.startsWith('# ')) {
      blocks.push({
        id: Date.now() + i,
        type: 'heading',
        content: line.substring(2)
      })
      continue
    }
    
    // Handle quotes
    if (line.startsWith('> ')) {
      blocks.push({
        id: Date.now() + i,
        type: 'quote',
        content: line.substring(2)
      })
      continue
    }
    
    // Handle list items
    if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
      if (currentBlock && currentBlock.type === 'list') {
        currentBlock.content += '\n' + line
      } else {
        if (currentBlock) blocks.push(currentBlock)
        currentBlock = {
          id: Date.now() + i,
          type: 'list',
          content: line
        }
      }
      continue
    }
    
    // Handle paragraphs
    if (line) {
      if (currentBlock && currentBlock.type === 'list') {
        blocks.push(currentBlock)
        currentBlock = null
      }
      
      blocks.push({
        id: Date.now() + i,
        type: 'paragraph',
        content: line
      })
    } else {
      if (currentBlock) {
        blocks.push(currentBlock)
        currentBlock = null
      }
    }
  }
  
  if (currentBlock) {
    blocks.push(currentBlock)
  }

  return blocks
  
  // return blocks.length > 0 ? blocks : [
  //   { id: 1, type: 'heading', content: 'Your Blog Title' },
  //   { id: 2, type: 'paragraph', content: 'Start writing your content here...' }
  // ]
}