const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const webpush = require('web-push')
const path = require('path')
require('dotenv').config()

const publicVapidKey = process.env.PUBLIC_KEY
const privateVapidKey = process.env.PRIVATE_KEY

webpush.setVapidDetails(
  'mailto:test@gmail.com',
  publicVapidKey,
  privateVapidKey
)

const api = require('./helpers/api.js')
const timer = require('./helpers/timer.js')
const filter = require('./helpers/filter.js')

const app = express()

const port = 1234

app.use(express.static(__dirname + '/public'))
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(bodyParser.json())

app.engine(
  '.hbs',
  exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    partialsDir: __dirname + '/views/partials/'
  })
)

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

app.get('/', async (req, res) => {
  let data = await api.get('/api/v1/rooms')
  let filteredData = filter.filterData(data)
  console.log(filteredData)

  res.render('index', {
    data,
    filteredData
  })
})

app.get('/filter', async (req, res) => {
  res.redirect('/')
})

app.post('/subscribe', (req, res) => {
  const subscription = JSON.parse(req.body.subscription)
  console.log(subscription)

  // Send 201 status
  res.status(201).json({})

  //Create payload
  let payload = JSON.stringify({ title: `Watching ${req.body.name}` })

  // Pass object in send notification function
  webpush.sendNotification(subscription, payload).catch(err => {
    console.log(chalk.red(err))
  })

  setTimeout(function() {
    payload = JSON.stringify({ title: `Room ${req.body.name} is free` })

    webpush.sendNotification(subscription, payload).catch(err => {
      console.log(chalk.red(err))
    })
  }, 8000)
})

app.post('/filter', async (req, res) => {
  let data = await api.get('/api/v1/rooms')
  let filteredData = filter.filterData(data)

  if (req.body.method === 'occupation') {
    filteredData.sort((a, b) => b.occupation - a.occupation).reverse()
  }

  if (req.body.method === 'temprature') {
    filteredData.sort((a, b) =>
      Number(a.roomTemp.celcius) < Number(b.roomTemp.celcius) ? 1 : -1
    )
  }

  res.render('index', {
    filteredData
  })
})

app.get('/room/:name', async (req, res) => {
  console.log(req.params.name)

  let data = await api.get(`/api/v1/room/${req.params.name}`)

  res.render('detail', {
    data
  })
})

app.listen(port)
