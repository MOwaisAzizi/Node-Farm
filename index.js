const fs = require('fs');
const http = require('http');
const url = require('url');

const replaceTemplate = require('./modules/replaceTemplate')

//Files
//sycrounose(blocking)
////read
// const textIn = fs.readFileSync('./txt/input.txt','utf-8')
// console.log(textIn);

// // write
// const textOut = `this is what we create ${textIn} \n created ${Date.now()}`
//  fs.writeFileSync('./txt/output.txt',textOut)

//asyncronouse(non=blocking)
// fs.readFile('./txt/start.txt','utf-8',(err,data1)=>{
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=>{
//         console.log(data2+'****');
//         fs.readFile('./txt/append.txt','utf-8',(err,data3)=>{
//           console.log(`${data3}`);
//           fs.writeFile('./txt/final.txt', `${data2} ------------ to ${data3}. `,'utf-8',err=>{
//             console.log('wrting to the final finished👌👌');
//           })
//         })

//     })
// })
// console.log('will read the file');

// const replaceTemplate = (tempCart,product)=>{
//     let output = tempCart.replace(/{%PRODUCTNAME%}/g, product.productName)
//      output = output.replace(/{%IMAGE%}/g, product.image)
//      output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
//      output = output.replace(/{%QUANTITY%}/g, product.quantity)
//      output = output.replace(/{%PRICE%}/g, product.price)
//      output = output.replace(/{%ID%}/g, product.id)
//      output = output.replace(/{%DESCRIPTION%}/g, product.description)
//     if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')        
//     return output
//     }

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8',);
const tempCart = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8',);
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8',);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8',);
const dataObj = JSON.parse(data)


////Server every thing in it recreate for each request
const server = http.createServer((req, res) => {
    // const pathname = req.url
    const {query,pathname} = url.parse(req.url,true)

    //overviw
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' })
        const cartHtml = dataObj.map(el=>replaceTemplate(tempCart,el)).join('')        
        const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cartHtml)
        res.end(output)
    }

    //product
    else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' })
        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct,product)
        res.end(output)
    }

    //API
    else if (pathname === '/api') {
        //this is not effient couse for each requst it read again
        // fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
        //     const productData = JSON.parse(data)
        //     res.writeHead(200, {'Content-type': 'application/json'})
        //     res.end(data);
        // })

        //effient way is to take it outside
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end(data);
    }
    //ERROR
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