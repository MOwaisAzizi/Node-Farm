const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate')

const tempCart = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8',);
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8',);
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8',);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8',);
const dataObj = JSON.parse(data)

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true)
    console.log(query, pathname);

    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' })
        const cartHtml = dataObj.map(el => replaceTemplate(tempCart, el)).join('')
        const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cartHtml)
        res.end(output)
    }

    else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' })
        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct, product)
        res.end(output)
    }

    else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' })
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
server.listen(8000, '127.0.0.1', () => {
    console.log('listen to sever on port 8000');
})