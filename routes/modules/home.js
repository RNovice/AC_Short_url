const express = require('express')

const router = express.Router()

const URLs = require('../../models/url')

const makeShortCode = require('../../utils/shortCoed')

//主頁面
router.get('/', (req, res) => {
  res.render('index')
})

//產生短網址
router.post('/', (req, res) => {
  const url = req.body.url
  URLs.find()
    .then(data => {
      //確認網址是否已存在
      const foundData = data.find(existData => existData.url === url)
      //已存在即回對應傳短網址
      if(foundData){
        return foundData.short
       //不存在則創造一組尚未使用的短網址
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
    .catch(error => {
      console.log(error)
      res.status(400)
      res.render('error', { text: 'something error', linkText: 'go back to shortener', error })
    })
})

//轉址
router.get('/:short', (req,res) => {
  URLs.findOne({short: req.params.short})
    .then(data => {
      if(!data){
        console.log('not exist short_url')
        res.render('error', { text: 'url not exist', linkText: 'to make your own' })
      } else {
        res.redirect(`${data.url}`)
      }
    })
    .catch(error => {
      console.log(error)
      res.status(400)
      res.render('error', { text: 'something error', linkText: 'go back to shortener', error })
    })
})

module.exports = router
