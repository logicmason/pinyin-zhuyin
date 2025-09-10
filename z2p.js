#!/usr/bin/env node

import { readFileSync } from 'fs';
import { z2p } from './pinyin-zhuyin.js';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: z2p [options] [inputfile]');
  console.error('');
  console.error('Options:');
  console.error('  --tonemarks    Use tone marks instead of tone numbers');
  console.error('  --convert-punctuation Convert punctuation (Chinese ↔ English)');
  console.error('  --help         Show this help message');
  console.error('');
  console.error('If no inputfile is provided, reads from stdin.');
  console.error('');
  console.error('Examples:');
  console.error('  z2p input.txt');
  console.error('  z2p --tonemarks input.txt');
  console.error('  echo "ㄋㄧˇㄏㄠˇ" | z2p');
  console.error('  echo "ㄋㄧˇㄏㄠˇ" | z2p --tonemarks');
  process.exit(1);
} else if (args.includes('--help')) {
  console.log('z2p - Convert Zhuyin to Pinyin');
  console.log('');
  console.log('Usage: z2p [options] [inputfile]');
  console.log('');
  console.log('Options:');
  console.log('  --tonemarks            Use tone marks instead of tone numbers');
  console.log('  --convert-punctuation  Convert punctuation (Chinese ↔ English)');
  console.log('  --help                 Show this help message');
  console.log('');
  console.log('Examples:');
  console.log('  z2p input.txt');
  console.log('  z2p --tonemarks input.txt');
  console.log('  z2p --convert-punctuation input.txt');
  console.log('  echo "ㄋㄧˇㄏㄠˇ" | z2p');
  console.log('  echo "ㄋㄧˇㄏㄠˇ" | z2p --tonemarks');
  process.exit(0);
}

// Parse options
const options = {
  tonemarks: args.includes('--tonemarks'),
  convertPunctuation: args.includes('--convert-punctuationuation')
};

// Get input file (last argument that's not an option)
const inputFile = args.filter(arg => !arg.startsWith('--')).pop();

if (inputFile) {
  // Read from file
  try {
    const text = readFileSync(inputFile, 'utf8');
    const result = z2p(text, options);
    console.log(result);
  } catch (err) {
    console.error(`Error reading file "${inputFile}":`, err.message);
    process.exit(1);
  }
} else if (args.some(arg => arg.startsWith('--'))) {
  // Options provided but no file - read from stdin
  const chunks = [];
  process.stdin.on('data', chunk => chunks.push(chunk));
  process.stdin.on('end', () => {
    try {
      const text = chunks.join('');
      const result = z2p(text, options);
      console.log(result);
    } catch (err) {
      console.error('Error processing stdin:', err.message);
      process.exit(1);
    }
  });
} else {
  // No options and no file - show usage
  console.error('Usage: z2p [options] [inputfile]');
  console.error('');
  console.error('Options:');
  console.error('  --tonemarks            Use tone marks instead of tone numbers');
  console.error('  --convert-punctuation  Convert punctuation (Chinese ↔ English)');
  console.error('  --help                 Show this help message');
  console.error('');
  console.error('If no inputfile is provided, reads from stdin.');
  console.error('');
  console.error('Examples:');
  console.error('  z2p input.txt');
  console.error('  z2p --tonemarks input.txt');
  console.error('  echo "ㄋㄧˇㄏㄠˇ" | z2p');
  console.error('  echo "ㄋㄧˇㄏㄠˇ" | z2p --tonemarks');
  process.exit(1);
}
