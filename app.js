const express = require('express')
const exphbs = require('express-handlebars')
const URLs = require('./models/url')
const makeShortCode = require('./utils/shortCoed')

require('./config/mongoose')

const app = express()
const port = 3000

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  const url = req.body.url
  URLs.find()
    .then(data => {
      const foundData = data.find(existData => existData.url === url)
      if(foundData){
        return foundData.short
      } else {
        let shortCode = makeShortCode()
        while (data.find(existData => existData.short === shortCode)){
          shortCode = makeShortCode()
        }
        URLs.create({
          url: url,
          short: shortCode
        })
        return shortCode
      } 
    })
    .then(shortCode => {
      const short = req.protocol + '://' + req.headers.host + '/' + shortCode
      res.render('index', { url, short })
    })
    .catch(error => console.log(error))
})

app.get('/:short', (req,res) => {
  URLs.findOne({short: req.params.short})
    .then(data => {
      if(!data){
        console.log('not exist short_url')
        res.render('notExist')
      } else {
        res.redirect(`${data.url}`)
      }
    })
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})