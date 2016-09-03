const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');


const mimeTypes = {
	"html": "text/html",
	"jpeg": "image/jpeg",
	"jpg": "image/jpg",
	"png": "image/png",
	"css": "text/css",
	"js": "text/javascript",
}

http.createServer((req, res) => {
	var uri = url.parse(req.url).pathname;
	var fileName = path.join(process.cwd(), unescape(uri));
	console.log("loading", uri);
	var stats;

	try {
		stats = fs.lstatSync(fileName);
	} catch (e) {
		console.log('Page not found\n');
		
		fs.readFile('404.html', function (err, html) {
		    if (err) {
		    	res.writeHead(404, {'Content-Type': 'text/plain'});	
		        res.write('404 Page not found'); 
		    }       
		    res.writeHead(404, {'Content-Type': 'text/html'});		    
		    res.write(html);  
		    res.end();
		
		});
		    return;
	}

	if(stats.isFile()) {
		var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
		res.writeHead(200, {'Content-Type': mimeType});

		var fileStream = fs.createReadStream(fileName);
		fileStream.pipe(res);
	} else if(stats.isDirectory()) {
		res.writeHead(302, {
			'Location': 'index.html'
		});
		res.end();
	} else {
		res.writeHead(500, {'Content-Type': 'text/plain'});
		res.write('500 Internal Error\n');
		res.end();
	}
}).listen(2200);

/*
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
*/