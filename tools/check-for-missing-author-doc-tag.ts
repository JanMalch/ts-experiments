import fs from 'fs';
import glob from 'glob';

glob.sync('src/**/*.ts').forEach((tsFile) => {
  const regex = /\* (?!@author ).+?\s\s\*\/\sexport /gm;
  const content = fs.readFileSync(tsFile, 'utf8');
  let count = 0;
  let m;

  while ((m = regex.exec(content)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    count++;
  }

  if (count > 0) {
    throw new Error(`'${tsFile}' seems to be missing @author doc tags`);
  }
});
