const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');
const readlune = require('readline');

const filePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath, 'utf8');
const rl = readlune.createInterface({ input: stdin, output: stdout });

stdout.write('Enter text. For close: "exit" or press CTRL+C\n');

rl.on('SIGINT', () => {
  closeStream();
});

const closeStream = () => {
  writeStream.end();
  rl.close();
};

rl.on('line', (data) => {
  if (data === 'exit') {
    closeStream();
  } else {
    writeStream.write(`${data}\n`);
  }
});
