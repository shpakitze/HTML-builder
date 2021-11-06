const fs = require('fs');
const path = require('path');

const styleFolder = path.join(__dirname, 'styles');
const boundleFolder = path.join(__dirname, 'project-dist');
const boundleFile = path.join(boundleFolder, 'bundle.css');
const writeStream = fs.createWriteStream(boundleFile, 'utf-8');
const appendInfo = (file) => {
  const readableStream = fs.createReadStream(file, 'utf-8');
  readableStream.on('data', (chunk) => writeStream.write(chunk));
};
function getFile(folder) {
  fs.readdir(
    folder,
    { encoding: 'utf8', withFileTypes: true },
    (err, files) => {
      if (err) throw err;
      files.forEach((el) => {
        if (el.isFile()) {
          const ext = path.extname(el.name);

          if (ext === '.css') appendInfo(path.join(styleFolder, el.name));
        } else getFile(path.join(folder, el.name));
      });
    }
  );
}
getFile(styleFolder);
