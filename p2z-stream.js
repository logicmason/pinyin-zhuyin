#!/usr/bin/env node
var converter = require('./pinyin-to-zhuyin');
var readline = require('readline');
var reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

reader.on('line', function(line){
  if (line === "exit" || line === "quit") {
    reader.close();
  } else {
    console.log(converter(line));
  }
});
