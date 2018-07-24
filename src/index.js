import express from 'express'
import bodyParser from 'body-parser'
import service from './service'

const PORT = process.env.PORT || 8888
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {        
    service.getPostsByCount('/bbs/Gossiping/index.html', 39)
        .then(posts => {
            console.log(posts)
            res.json(posts)
        })
})

app.get('/hotBoards', (req, res) => {    
    service.getHotBoards()
        .then(boards => {
            console.log(boards)
            res.json(boards)
        })    
})


app.listen(PORT, () => console.log(`Server has started on port ${PORT}`))