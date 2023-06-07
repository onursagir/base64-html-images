import fs from 'fs/promises';

export async function fileExists(path: string) {
  return fs
    .lstat(path)
    .then(() => true)
    .catch(() => false);
}
