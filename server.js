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

// let allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', "*");
//     res.header('Access-Control-Allow-Headers', "*");
//     next();
//   }

//   server.use(allowCrossDomain);




const port = process.env.PORT || 3003;

server.get('/',(req,res)=>{

     res.send(__dirname)
})

server.post('/generatePDF', (req,res) => {

    formData = req.body.data

    console.log(formData)

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
                    // res.header('Access-Control-Allow-Origin', "*");
                    // res.header('Access-Control-Allow-Headers', "*");
                    // res.header('Content-Type','application/pdf')
                
                    res.send(buffer);
                })

            })
    

    })

})

})


server.listen(port,() => {
    console.log(`Server running on port ${port}`)
})
