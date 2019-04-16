import "babel-polyfill";
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import service from './service'
import favicon from 'serve-favicon'
import path from 'path'

const PORT = process.env.PORT || 8888
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
// log all request details
app.use(morgan('dev'))

// default is get hot boards
app.get('/', (req, res) => {
    service.getHotBoards()
        .then(boards => {
            console.log(boards)
            // res.json(boards)
            res.send(boards)
        })
        .catch(err => {
            console.log(err)
            throw new Error(err)
        })
})

// get the post which you specify
app.get('/post', (req, res) => {
    const { url } = req.query
    service.getPostInHTML(url)
        .then(posts => {
            console.log(posts)
            res.json(posts)
        })
        .catch(err => {
            console.log(err)
            throw new Error(err)
        })
})

// get post list and quantity is base on count
app.get('/list', (req, res) => {
    const { url, count = 10 } = req.query
    service.getPostsByCount(url, count)
        .then(posts => {
            console.log(posts)
            res.json(posts)
        })
        .catch(err => {
            console.log(err)
            throw new Error(err)
        })
})

app.get('/beauty', (req, res) => {
    service.getBeauties()
        .then(images => {
            // console.log(images)
            res.json(images)
        })
        .catch(err => {
            console.log(err)
            throw new Error(err)
        })

})

app.get('/ig/:type/:keyword', (req, res) => {
    const { type, keyword } = req.params
    service.igGet(type, keyword)
        .then(images => {
            // console.log(images)
            res.json(images)
        })
        .catch(err => {
            console.log(err)
            throw new Error(err)
        })
})

app.listen(PORT, () => console.log(`Server has started on port ${PORT}`))