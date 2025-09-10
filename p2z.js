#!/usr/bin/env node
var cliArgs = process.argv.slice(2);
if (cliArgs.length !== 1) {
  console.error("Usage: p2z <inputfile>");
  process.exit(1);
}

var fs = require('fs');
var converter = require('./pinyin-to-zhuyin');

fs.readFile(cliArgs[0], function (err, data){
  if (err) {
    console.error("Error opening file:", cliArgs[0]);
    process.exit(1);
  };
  var text = data.toString();
  console.log(converter(text));
});
