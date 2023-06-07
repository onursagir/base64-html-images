import fs from 'fs';

export function fileExistsSync(path: string) {
  try {
    fs.lstatSync(path);
    return true;
  } catch {
    return false;
  }
}
