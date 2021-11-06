const fs = require('fs');
const path = require('path');
const files = path.join(__dirname, 'secret-folder');

function getFile(folder) {
  fs.readdir(
    folder,
    { encoding: 'utf8', withFileTypes: true },
    (err, files) => {
      if (err) throw err;
      files.forEach((el) => {
        if (!el.isDirectory()) {
          fs.stat(path.join(folder, el.name), (err, stats) => {
            if (err) throw err;
            const ext = path.extname(el.name);
            const filelName = path.basename(el.name, ext);
            const fileSize = stats.size;
            console.log(`${filelName} - ${ext.slice(1)} - ${fileSize} bytes`);
          });
        } else getFile(path.join(folder, el.name));
      });
    }
  );
}
getFile(files);
