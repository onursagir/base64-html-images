#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { RewritingStream } from 'parse5-html-rewriting-stream';
import { fileExistsSync } from './file-exists-sync';
import { fileExists } from './file-exists';
import { stringIsLink } from './string-is-link';

interface Args {
  input: string;
  output: string;
}

yargs(hideBin(process.argv))
  .command(
    '$0 <input> <output>',
    'Replace images in HTML file with base64 string',
    (yargs) => {
      return yargs
        .positional('input', {
          type: 'string',
          demandOption: true,
          describe: 'Path to the HTML file',
        })
        .positional('output', {
          type: 'string',
          demandOption: true,
          describe: 'Path to write the new HTML file with the images converted to base64 string',
        });
    },
    async (yargs) => {
      const { input, output } = yargs;

      const inputPath = path.resolve(input);
      const inputExists = await fileExists(inputPath);

      if (!inputExists) throw new Error('Unable to resolve input file');

      const outputPath = path.resolve(output);
      const outputStream = fs.createWriteStream(outputPath);

      const rewritingStream = new RewritingStream();

      rewritingStream.on('startTag', (startTag) => {
        if (startTag.tagName !== 'img') return rewritingStream.emitStartTag(startTag);

        const srcIndex = startTag.attrs.findIndex(({ name }) => name === 'src');

        if (srcIndex === -1) return rewritingStream.emitStartTag(startTag);

        const imageSource = startTag.attrs[srcIndex].value;

        if (stringIsLink(imageSource)) return rewritingStream.emitStartTag(startTag);

        const imagePath = path.resolve(path.dirname(inputPath), imageSource);
        const imageExists = fileExistsSync(imagePath);

        if (!imageExists) {
          console.warn(`⚠️  Unable to resolve image source ${imageSource} skipping...`);

          return rewritingStream.emitStartTag(startTag);
        }

        const image = fs.readFileSync(imagePath, 'base64');
        startTag.attrs[srcIndex].value = `data:image/png;base64,${image}`;

        rewritingStream.emitStartTag(startTag);
      });

      const readStream = fs.createReadStream(inputPath, 'utf-8');

      readStream.pipe(rewritingStream).pipe(outputStream);
    }
  )
  .help().argv;
