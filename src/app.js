/**
 * @Author: tongtong.ctt
 * @Date: 2021-12-07 22:55:10
 * @Last Modified by: tongtong.ctt
 * @Last Modified time: 2021-12-07 23:21:14
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer();

function getFilePath(relativePath) {
  const rootPath = path.join(__dirname, './');
  return path.join(rootPath, relativePath);
}
server.on('request', (req, res) => {
  const url = req.url;
  console.log(url);
  const filePath = getFilePath(req.url);
  const isExist = fs.existsSync(filePath);
  if (!isExist) {
    res.end('404');
    return;
  }
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  
  if (url.endsWith('.html')) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
  } else if (url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
  } else if (/(gif|png)$/.test(url)) {
    res.setHeader('Content-Type', 'image/jpeg');
  } else if (/js$/.test(url)) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  }
  res.end(fileContent);
});
server.listen(80, () => {
  console.log('服务器已经启动，可以访问了。。。');
});
