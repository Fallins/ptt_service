import axios from 'axios'
import querystring from 'querystring'
import { hotBoardsHandler, postsHandler, postHandler, beautyPostHandler, igHandler } from './handler'
import { BASE_URL, POSTS_COUNT_PER_PAGE } from './config'
import { timeout } from './utils'

// 取得熱門看板
const getHotBoards = () => get('/bbs/hotboards.html', hotBoardsHandler)

// 取得最新貼文列表(含置頂)
const getPosts = (url) => get(url, postsHandler)

// 取得固定數量貼文列表
const getPostsByCount = (url, count) => {
    let result
    return getPosts(url)
        .then(postsData => {
            result = postsData

            // 計算需要再發 request 的數量
            const restRequestCount = Math.ceil((count - result.posts.length) / POSTS_COUNT_PER_PAGE)

            // 做出一個假的 array 供 map 使用，組出 array of function
            const promiseArr = []
            for(let i = 1; i <= restRequestCount; i++) {
                promiseArr.push(i)
            }

            // 取得需要的數量的文章資訊，並刪除多餘或不必要的資訊
            return Promise.all(promiseArr.map((_, i) => getPostsByPage(url, result.prevPage - i)))
                .then(restData => {
                    restData.forEach(({posts}) => result.posts = result.posts.concat(posts))
                    result.posts = result.posts.slice(0, count)
                    delete result.prevPage

                    return result
                })
        })
}

// 取得指定頁數之貼文列表
const getPostsByPage = (url, page = '') => {
    const newUrl = url.split('.')[0] + page + '.html'
    return getPosts(newUrl)
}

const getLastFiftyPostOfBeauty = (url) => {
    return getPostsByCount(url, 50)
        .then(res => {
            const { posts } = res
            // 進行過濾，標題含有正妹的才去查詢
            const beautyPostsList = posts.filter(post => post.title.includes('[正妹]') || post.title.includes('正妹'))

            // console.log({
            //     allPosts: res.posts.length,
            //     beautyPostsLists: beautyPostsList.length
            // })

            return Promise.all(beautyPostsList.map(post => get(post.href, beautyPostHandler)))
                .then(finalResult => {
                    // format of finalResult will be [{images}, {images}, ....]
                    // and then flat all together
                    finalResult = finalResult.reduce((acc, cur) => {
                        console.log({acc, cur})
                        return acc.concat(cur.images)
                    }, [])
                    // console.log({finalResult})
                    return finalResult
                })
        })
}

const getPost = (url) => get(url, postHandler)

const getPostInHTML = (url) => get(url, postHandler, true)

const getBeauties = () => getLastFiftyPostOfBeauty('/bbs/Beauty/index.html')

// const over18 = (url) => {
//     return axios({
//         method: 'post',
//         url: `${BASE_URL}/ask/over18`,
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             'Cache-Control': 'no-cache',
//             'Cookie': "over18=1;"},
//         data: querystring.stringify({
//             from: `${url}`,
//             yes: "yes"
//         })
//     })
// }

const get = (url, handler, inHTML) => {
    // console.log(`Request to ${url}`)
    return axios({
        method: 'get',
        url: `${BASE_URL}${url}`,
        headers: {
            'Cache-Control': 'no-cache',
            'Cookie': "over18=1;"}
    })
        .then(response => {
            // console.log("============")
            // console.log(response.data)
            // console.log("============")
            return inHTML ?
                handler(response.data) :
                handler(response.data.replace(/(\n|\t|\r)/gm, ''))
        })
        .catch(e => console.log)
}

// ============================
import puppeteer from 'puppeteer'


const igGet = async (type = 'tags', keyword = 'minaaaa_908') => {
    try{
        const getUrl = (type, keyword) => {
            const urlMapping = {
                tags: `https://www.instagram.com/explore/tags/${keyword}/`,
                account: `https://www.instagram.com/${keyword}/`
            }
            return urlMapping[type]
        }

        let url = getUrl(type, keyword)
        console.log(url)
        // seems IG can NOT use the headless mode to fetch
        const browser = await puppeteer.launch({headless: false})
        const page = await browser.newPage()
        await page.goto(url)

        // simulate the scroll action to fetch as more as posible
        await page.evaluate(() => { window.scrollTo(0, 3000) })
        await page.evaluate(() => { window.scrollBy(0, 1000) })
        await timeout(100)
        await page.evaluate(() => { window.scrollBy(0, 1000) })
        await timeout(100)
        await page.evaluate(() => { window.scrollBy(0, 1000) })
        await timeout(100)

        const html = await page.content()
        await browser.close()

        return igHandler(html)
    }catch(e) {
        console.log(e)
    }
}

export default {
    getHotBoards,
    getPosts,
    getPostsByCount,
    getPost,
    getPostInHTML,
    getBeauties,

    igGet
}