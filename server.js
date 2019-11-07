const express = require('express');
const puppeteer = require('puppeteer');
const pug = require('pug');
const cors = require('cors');
const bodyParser = require('body-parser');


const server = express();

server.set('views','./views');
server.set('view engine', 'pug');
server.use(cors());
server.use(bodyParser.json())

server.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


const port = process.env.PORT || 3003;

server.get('/',(req,res)=>{

     res.send(__dirname)
})

server.post('/generatePDF', (req,res) => {

    formData = req.body

    const options = {
        format: 'A4',
        headerTemplate: "<p></p>",
        footerTemplate: "<p></p>",
        printBackground:true,
        displayHeaderFooter: false,
        margin: {
            top: "40px",
            bottom: "40px"
        },
        path:'resume.pdf'

    }

  

    let html = pug.renderFile('views/index.pug',{data:formData})

    puppeteer.launch({args:['--no-sandbox'],headless:true}).then(browser => {

        browser.newPage().then(page => {
  
               page.setContent(html).then(response => {

                page.pdf(options).then(buffer => {
                    res.header().sendFile(__dirname+'/resume.pdf');
                })

            })
    

    })

})

})


server.listen(port,() => {
    console.log(`Server running on port ${port}`)
})
