import fs from 'fs';
import util from 'util';

const ReadFile = util.promisify(fs.readFile);
const WriteFile = util.promisify(fs.writeFile);
const UnlinkFile = util.promisify(fs.unlink);
const Rename = util.promisify(fs.rename);
const Mkdir = util.promisify(fs.mkdir);
const CopyFile = util.promisify(fs.copyFile);
const Rmdir = util.promisify(fs.rmdir);

const AsyncFiles = {
  ReadFile,
  WriteFile,
  UnlinkFile,
  Rename,
  Mkdir,
  CopyFile,
  Rmdir,
};
export default AsyncFiles;
