import cheerio from 'cheerio'

import BASE_URL from '../config'


/*
 * oldest: /bbs/Gossiping/index1.html
 * newest: /bbs/Gossiping/index.html
 * specify page : /bbs/Gossiping/index${page}.html
 * 
 */
const postsHandler = (data) => {
    const $ = cheerio.load(data)
    const posts = []
    $('.r-list-container .r-ent').each((i, ele) => {        
        const $ele = $(ele)
        const href = $ele.find('.title a').attr('href')
        const like = $ele.children('.nrec').text()
        const date = $ele.find('.meta .date').text()
        const title = $ele.children('.title').text()
        // console.log(href)
        // console.log(like)
        // console.log(date)
        // console.log(title)

        posts.push({
            href, like, date, title
        })        
    })

    const prevPage = $('.btn-group-paging a:nth-of-type(2)').attr('href').replace(/\D/g, '')

    const length = $('.r-list-sep ~ .r-ent').length
    const popular = posts.splice(-length, length)

    // console.log({posts, popular, length, prevPage})
    return {posts, popular, prevPage}
}

export default postsHandler