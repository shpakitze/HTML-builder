const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(file, 'utf-8');
stream.on('readable', () => {
  let data = stream.read();
  if (data !== null) console.log(data);
});
