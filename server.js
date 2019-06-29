const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const videoFilePath = path.join(__dirname, 'vid.mp4');
const fileSize = fs.statSync(videoFilePath).size;

app.get('/video', (req, res) => {
  const { range } = req.headers;
  const [s, e] = range.replace('bytes=', '').split('-');
  const start = Number(s);
  const end = Number(e) || fileSize - 1;
  res.append('Accept-Ranges', 'bytes');
  res.append('Content-Range', `bytes ${start}-${end}/${fileSize}`);
  res.append('Content-Length', end - start + 1);
  res.append('Content-Type', 'video/mp4');
  res.status(206);
  const fileStream = fs.createReadStream(videoFilePath, { start, end });
  fileStream.pipe(res);
});

app.listen(3000, () => {
  console.log('Server is up...');
});