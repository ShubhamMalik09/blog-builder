const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "src");
const OUTPUT_FILE = "tree.txt";

function walk(dir, prefix = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .filter(e => !["node_modules", ".next", ".git"].includes(e.name));

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    const connector = isLast ? "└── " : "├── ";

    const line = prefix + connector + entry.name;
    lines.push(line);

    if (entry.isDirectory()) {
      const nextPrefix = prefix + (isLast ? "    " : "│   ");
      walk(path.join(dir, entry.name), nextPrefix);
    }
  });
}

const lines = [];
walk(ROOT);

fs.writeFileSync(OUTPUT_FILE, lines.join("\n"));
console.log(`Tree written to ${OUTPUT_FILE}`);
