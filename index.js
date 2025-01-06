const fs = require('fs');
const http = require('http');
const { dirname } = require('path');
const url = require('url');




const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8',);
const dataObject = JSON.parse(data)

////Server every thing in it recreate for each request
const server = http.createServer((req, res) => {
    const pathName = req.url

    if (pathName === '/' || pathName === '/overview') {
        res.end('Hello from your servessssssssr')
    } else if (pathName === '/product') {
        res.end('Hello from your product')
    }
    else if (pathName === '/api') {
        //this is not effient couse for each requst it read again
        // fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
        //     const productData = JSON.parse(data)
        //     res.writeHead(200, {'Content-type': 'application/json'})
        //     res.end(data);
        // })

        //effient way is to take it outside
            res.writeHead(200, {'Content-type': 'application/json'})
            res.end(data);
    }
    else {
        res.writeHead(404, {
            'content-type': 'text/html',
            'my-own-words': 'Hello Error'
        })
        res.end('<h1>Page Not FOund</h1>')
    }

})
//listen to incomming request on port 8000 and host 127
server.listen(8000, '127.0.0.1', () => {
    console.log('listen to sever on port 8000');
})