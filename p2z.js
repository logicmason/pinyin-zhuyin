#!/usr/bin/env node

import { readFileSync } from 'fs';
import { p2z } from './pinyin-zhuyin.js';

const args = process.argv.slice(2);
const isInteractive = process.stdin.isTTY;

if (args.length === 0 && isInteractive) {
  console.error('Usage: p2z [options] [inputfile]');
  console.error('');
  console.error('Options:');
  console.error('  --tonemarks            Use tone marks instead of tone numbers');
  console.error('  --no-neutral           Do not mark neutral tones');
  console.error('  --convert-punctuation  Convert punctuation (Chinese ↔ English)');
  console.error('  --help                 Show this help message');
  console.error('');
  console.error('If no inputfile is provided, reads from stdin.');
  console.error('');
  console.error('Examples:');
  console.error('  p2z input.txt');
  console.error('  p2z --tonemarks input.txt');
  console.error('  echo "ni3hao3" | p2z');
  console.error('  echo "ni3hao3" | p2z --tonemarks');
  process.exit(1);
} else if (args.includes('--help')) {
  console.log('p2z - Convert Pinyin to Zhuyin');
  console.log('');
  console.log('Usage: p2z [options] [inputfile]');
  console.log('');
  console.log('Options:');
  console.log('  --tonemarks            Use tone marks instead of tone numbers');
  console.log('  --no-neutral           Do not mark neutral tones');
  console.log('  --convert-punctuation  Convert punctuation (Chinese ↔ English)');
  console.log('  --help                 Show this help message');
  console.log('');
  console.log('Examples:');
  console.log('  p2z input.txt');
  console.log('  p2z --tonemarks input.txt');
  console.log('  p2z --convert-punctuation input.txt');
  console.log('  echo "ni3hao3" | p2z');
  console.log('  echo "ni3hao3" | p2z --tonemarks');
  process.exit(0);
}

// Parse options
const options = {
  tonemarks: args.includes('--tonemarks'),
  markNeutralTone: !args.includes('--no-neutral'),
  convertPunctuation: args.includes('--convert-punctuation')
};

// Get input file (last argument that's not an option)
const inputFile = args.filter(arg => !arg.startsWith('--')).pop();

if (inputFile) {
  // Read from file
  try {
    const text = readFileSync(inputFile, 'utf8');
    const result = p2z(text, options);
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
      const result = p2z(text, options);
      console.log(result);
    } catch (err) {
      console.error('Error processing stdin:', err.message);
      process.exit(1);
    }
  });
} else if (!isInteractive) {
  // No args, but input is being piped - read from stdin
  const chunks = [];
  process.stdin.on('data', chunk => chunks.push(chunk));
  process.stdin.on('end', () => {
    try {
      const text = chunks.join('');
      const result = p2z(text, options);
      console.log(result);
    } catch (err) {
      console.error('Error processing stdin:', err.message);
      process.exit(1);
    }
  });
} else {
  // No options and no file - show usage
  console.error('Usage: p2z [options] [inputfile]');
  console.error('');
  console.error('Options:');
  console.error('  --tonemarks            Use tone marks instead of tone numbers');
  console.error('  --no-neutral           Do not mark neutral tones');
  console.error('  --convert-punctuation  Convert punctuation (Chinese ↔ English)');
  console.error('  --help                 Show this help message');
  console.error('');
  console.error('If no inputfile is provided, reads from stdin.');
  console.error('');
  console.error('Examples:');
  console.error('  p2z input.txt');
  console.error('  p2z --tonemarks input.txt');
  console.error('  echo "ni3hao3" | p2z');
  console.error('  echo "ni3hao3" | p2z --tonemarks');
  process.exit(1);
}
