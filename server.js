var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var url = require("url");
var log4js = require('log4js');

var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});

var cache = {};

function send404(response) {
    response.writeHead(404, {
        'Content-Type': 'text/plain'
    });
    response.write('Error 404: resource not found.');
    response.end();
}

/**
* 文件转发
**/
function sendFile(response, filePath, fileContents) {
    response.writeHead(200, {
        "content-type": mime.lookup(path.basename(filePath))
    });
    response.end(fileContents);
}

/**
* 静态资源转发
**/
function serveStatic(response, cache, absPath) {
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function(exists) {
            if (exists) {
                fs.readFile(absPath, function(err, data) {
                    if (err) {
                        send404(response);
                    } else {
                        //cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                send404(response);
            }
        });
    }
}

// Listen for the `error` event on `proxy`.
proxy.on('error', function(err, req, res) {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });

    res.end('Something went wrong. And we are reporting a custom error message.');
})

var server = http.createServer(function(req, res) {
    var filePath = false;
    var pathname = url.parse(req.url).pathname;
    var reg = new RegExp("^/api/");
    if (reg.test(pathname)) {
        proxy.web(req, res, {
            target: {
                host: "127.0.0.1",
                port: 8080
            }
        });
        return;
    }

    if (pathname == '/') {
        filePath = 'view/main.html';
    } else {
        filePath = pathname;
    }
    var absPath = './dist/' + filePath;
    serveStatic(res, cache, absPath);
});


server.listen(3000, function() {
    console.log("Server listening on port 3000.");
});
