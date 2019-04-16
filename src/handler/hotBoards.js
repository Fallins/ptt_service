import cheerio from 'cheerio'

import BASE_URL from '../config'

const hotBoardsHandler = (data) => {
    const $ = cheerio.load(data)
    const boards = []
    $('.b-list-container a.board').each((i, ele) => {
        const $ele = $(ele)
        const href = $ele.attr('href')
        const name = $ele.children('.board-name').text()
        const countOfPosts = $ele.children('.board-nuser').text()
        const title = $ele.children('.board-title').text()
        // console.log(href)
        // console.log(name)
        // console.log(countOfPosts)
        // console.log(title)

        boards.push({
            href, name, countOfPosts, title
        })        
    })

    return boards
}

export default hotBoardsHandler