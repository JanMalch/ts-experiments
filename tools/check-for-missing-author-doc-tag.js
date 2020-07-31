'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const fs_1 = __importDefault(require('fs'));
const glob_1 = __importDefault(require('glob'));
glob_1.default.sync('src/**/*.ts').forEach((tsFile) => {
  const regex = /\* (?!@author ).+?\s\s\*\/\sexport /gm;
  const content = fs_1.default.readFileSync(tsFile, 'utf8');
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
