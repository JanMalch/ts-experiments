'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const fs_1 = __importDefault(require('fs'));
const glob_1 = __importDefault(require('glob'));
const path_1 = __importDefault(require('path'));
const mdLink = (relPath, name, type) =>
  `[${name}](https://github.com/JanMalch/ts-experiments/${type}/master/${relPath})`;
// regex with the help of https://regex101.com/
const getResultGroupsOfRegex = (regex, content) => {
  let m;
  if ((m = regex.exec(content)) !== null) {
    return m.slice(1);
  }
  return [];
};
function persistToc(filePath, tocContent) {
  const content = fs_1.default.readFileSync(filePath, 'utf8');
  const regex = /<!-- TOC:START -->.+<!-- TOC:END -->/s;
  const updated = content.replace(
    regex,
    `<!-- TOC:START -->
${tocContent}
<!-- TOC:END -->`
  );
  fs_1.default.writeFileSync(filePath, updated);
}
function getSummary(filePath) {
  var _a, _b, _c;
  if (fs_1.default.lstatSync(filePath).isDirectory()) {
    const readmePath = path_1.default.resolve(filePath, 'README.md');
    if (!fs_1.default.existsSync(readmePath)) {
      throw new Error(
        `Every directory must have a README.md but "${readmePath}" doesn't exist`
      );
    }
    const [summary] = getResultGroupsOfRegex(
      /<!-- SUMMARY:START -->(.+)<!-- SUMMARY:END -->/s,
      fs_1.default.readFileSync(readmePath, 'utf8')
    ).map((s) => s.trim());
    if (!summary) {
      throw new Error(`"${readmePath}" found but no summary found`);
    }
    return summary;
  } else {
    const [summary] = getResultGroupsOfRegex(
      /^\/\*\s\s(.+?)\*\//s,
      fs_1.default.readFileSync(filePath, 'utf8')
    );
    return (_c =
      (_b =
        (_a =
          summary === null || summary === void 0
            ? void 0
            : summary.split('\n')) === null || _a === void 0
          ? void 0
          : _a.map((line) => line.trim().substring(2))) === null ||
      _b === void 0
        ? void 0
        : _b.join('\n').trim()) !== null && _c !== void 0
      ? _c
      : '';
  }
}
const exportCounts = {};
const countRegexOccurences = (regex, content) => {
  let m;
  let count = 0;
  while ((m = regex.exec(content)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    count++;
  }
  return count;
};
function countExports(fileOrDirectory) {
  let count = 0;
  if (fileOrDirectory.endsWith('.ts')) {
    count = countRegexOccurences(
      /export /g,
      fs_1.default.readFileSync(fileOrDirectory, 'utf8')
    );
  } else {
    const directories = glob_1.default.sync(`${fileOrDirectory}/*/`);
    const countFromNestedDirs = directories.reduce(
      (acc, d) => acc + countExports(d),
      0
    );
    const directFiles = glob_1.default.sync(`${fileOrDirectory}/*.ts`);
    const countFromDirectFiles = directFiles.reduce((acc, file) => {
      const sum = countRegexOccurences(
        /export /g,
        fs_1.default.readFileSync(file, 'utf8')
      );
      return acc + sum;
    }, 0);
    count = countFromDirectFiles + countFromNestedDirs;
  }
  exportCounts[fileOrDirectory] = count;
  return exportCounts[fileOrDirectory];
}
function processReadme(readme) {
  const directory = readme.slice(0, -10);
  const children = glob_1.default
    .sync(`${directory}/*{.ts,/}`)
    .map((c) => ({
      path: c,
      type: c.endsWith('/') ? 'tree' : 'blob',
      name: path_1.default.basename(c, '.ts'),
      summary: getSummary(c),
      exports: countExports(c),
    }))
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  const toc = children
    .map(
      (c) => `### ${mdLink(c.path, c.name, c.type)}

${c.summary}

${mdLink(
  c.path,
  `![${c.exports} export${
    c.exports === 1 ? '' : 's'
  }](https://img.shields.io/badge/exports-${c.exports}-blue)`,
  c.type
)}`
    )
    .join('\n\n');
  persistToc(readme, toc);
}
fs_1.default.copyFileSync('./README.md', './src/README.md');
glob_1.default.sync('src/**/README.md').forEach(processReadme);
fs_1.default.copyFileSync('./src/README.md', './README.md');
