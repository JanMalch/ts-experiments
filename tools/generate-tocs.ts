import glob from 'glob';
import fs from 'fs';
import path from 'path';

const mdLink = (relPath: string, name: string, type: 'blob' | 'tree') =>
  `[${name}](https://github.com/JanMalch/ts-experiments/${type}/master/${relPath})`;

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

function processReadme(readme: string) {
  let directory = readme.slice(0, -10);
  if (directory === '.') {
    directory = 'src';
  }
  const children = glob
    .sync(`${directory}/*{.ts,/}`)
    .map((c) => ({
      path: c,
      type: c.endsWith('/') ? 'tree' : ('blob' as 'tree' | 'blob'),
      name: path.basename(c, '.ts'),
      summary: getSummary(c),
    }))
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  const toc = children
    .map((c) =>
      `### ${mdLink(c.path, c.name, c.type)}

${c.summary}`.trimRight()
    )
    .join('\n\n');
  persistToc(readme, toc);
}

processReadme('./README.md');
glob.sync('src/**/README.md').forEach(processReadme);
