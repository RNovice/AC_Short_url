const express = require('express')
const exphbs = require('express-handlebars')
const URL = require('./models/url')
const makeShortCode = require('./utils/shortCoed')

require('./config/mongoose')

const app = express()
const port = 3000

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  const url = req.body.url
  URL.find()
    .then(data => {
      const foundData = data.find(existData => existData.url === url)
      if(foundData){
        return foundData.short
      } else {
        let shortCode = makeShortCode()
        while (data.find(existData => existData.short === shortCode)){
          shortCode = makeShortCode()
        }
        URL.create({
          url: url,
          short: shortCode
        })
        return shortCode
      } 
    })
    .then(short => console.log(short))

  res.render('index', { url })
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})