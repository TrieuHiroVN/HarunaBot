const { createServer } = require('http');
createServer((req, res) => {
    res.write('Server is ready!');
    res.end();
}).listen(8080);