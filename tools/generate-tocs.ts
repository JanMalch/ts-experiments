import fs from 'fs';
import glob from 'glob';
import path from 'path';

const mdLink = (relPath: string, name: string, type: 'blob' | 'tree') =>
  `[${name}](https://github.com/JanMalch/ts-experiments/${type}/master/${relPath})`;

// regex with the help of https://regex101.com/

const getResultGroupsOfRegex = (regex: RegExp, content: string): string[] => {
  let m;
  if ((m = regex.exec(content)) !== null) {
    return m.slice(1);
  }
  return [];
};

function persistToc(filePath: string, tocContent: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /<!-- TOC:START -->.+<!-- TOC:END -->/s;
  const updated = content.replace(
    regex,
    `<!-- TOC:START -->
${tocContent}
<!-- TOC:END -->`
  );
  fs.writeFileSync(filePath, updated);
}

function getSummary(filePath: string) {
  if (fs.lstatSync(filePath).isDirectory()) {
    const readmePath = path.resolve(filePath, 'README.md');
    if (!fs.existsSync(readmePath)) {
      throw new Error(
        `Every directory must have a README.md but "${readmePath}" doesn't exist`
      );
    }

    const [summary] = getResultGroupsOfRegex(
      /<!-- SUMMARY:START -->(.+)<!-- SUMMARY:END -->/s,
      fs.readFileSync(readmePath, 'utf8')
    ).map((s) => s.trim());

    if (!summary) {
      throw new Error(`"${readmePath}" found but no summary found`);
    }
    return summary;
  } else {
    const [summary] = getResultGroupsOfRegex(
      /^\/\*\s\s(.+?)\*\//s,
      fs.readFileSync(filePath, 'utf8')
    );
    return (
      summary
        ?.split('\n')
        ?.map((line) => line.trim().substring(2))
        ?.join('\n')
        .trim() ?? ''
    );
  }
}

const exportCounts: Record<string, number> = {};

const countRegexOccurences = (regex: RegExp, content: string): number => {
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

function countExports(fileOrDirectory: string): number {
  let count = 0;
  if (fileOrDirectory.endsWith('.ts')) {
    count = countRegexOccurences(
      /export /g,
      fs.readFileSync(fileOrDirectory, 'utf8')
    );
  } else {
    const directories = glob.sync(`${fileOrDirectory}/*/`);
    const countFromNestedDirs = directories.reduce(
      (acc, d) => acc + countExports(d),
      0
    );
    const directFiles = glob.sync(`${fileOrDirectory}/*.ts`);
    const countFromDirectFiles = directFiles.reduce((acc, file) => {
      const sum = countRegexOccurences(
        /export /g,
        fs.readFileSync(file, 'utf8')
      );
      return acc + sum;
    }, 0);
    count = countFromDirectFiles + countFromNestedDirs;
  }

  exportCounts[fileOrDirectory] = count;
  return exportCounts[fileOrDirectory];
}

function processReadme(readme: string) {
  const directory = readme.slice(0, -10);
  const children = glob
    .sync(`${directory}/*{.ts,/}`)
    .map((c) => ({
      path: c,
      type: c.endsWith('/') ? 'tree' : ('blob' as 'tree' | 'blob'),
      name: path.basename(c, '.ts'),
      summary: getSummary(c),
      exports: countExports(c),
    }))
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  const toc = children
    .map(
      (c) =>
        `### ${mdLink(c.path, c.name, c.type)}

${c.summary}


${mdLink(
  c.path,
  `![${c.exports} export${
    c.exports === 1 ? '' : 's'
  }](https://img.shields.io/badge/exports-${c.exports}-blue)`,
  c.type
)}

---`
    )
    .join('\n\n');
  persistToc(readme, toc);
}

fs.copyFileSync('./README.md', './src/README.md');
glob.sync('src/**/README.md').forEach(processReadme);
fs.copyFileSync('./src/README.md', './README.md');
