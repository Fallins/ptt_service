import express from 'express'
import bodyParser from 'body-parser'
import service from './service'

const PORT = process.env.PORT || 8888
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

// default is get hot boards
app.get('/', (req, res) => {    
    service.getHotBoards()
        .then(boards => {
            console.log(boards)
            res.json(boards)
        })    
})

// get the post which you specify
app.get('/post', (req, res) => {
    const { url } = req.query
    service.getPost(url)
        .then(posts => {
            console.log(posts)
            res.json(posts)
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
})



app.listen(PORT, () => console.log(`Server has started on port ${PORT}`))