#!/usr/bin/env node

import { readFileSync } from 'fs';
import { z2p } from './pinyin-to-zhuyin.js';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: z2p [options] <inputfile>');
  console.error('');
  console.error('Options:');
  console.error('  --tonemarks    Use tone marks instead of tone numbers');
  console.error('  --convert-punct Convert punctuation (Chinese ↔ English)');
  console.error('  --help         Show this help message');
  process.exit(1);
}

if (args.includes('--help')) {
  console.log('z2p - Convert Zhuyin to Pinyin');
  console.log('');
  console.log('Usage: z2p [options] <inputfile>');
  console.log('');
  console.log('Options:');
  console.log('  --tonemarks     Use tone marks instead of tone numbers');
  console.log('  --convert-punct Convert punctuation (Chinese ↔ English)');
  console.log('  --help          Show this help message');
  console.log('');
  console.log('Examples:');
  console.log('  z2p input.txt');
  console.log('  z2p --tonemarks input.txt');
  console.log('  z2p --convert-punct input.txt');
  process.exit(0);
}

const inputFile = args[args.length - 1];
const options = {
  tonemarks: args.includes('--tonemarks'),
  convertPunctuation: args.includes('--convert-punct')
};

try {
  const text = readFileSync(inputFile, 'utf8');
  const result = z2p(text, options);
  console.log(result);
} catch (err) {
  console.error(`Error reading file "${inputFile}":`, err.message);
  process.exit(1);
}
