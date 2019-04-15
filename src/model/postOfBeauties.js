import cheerio from 'cheerio'

const beautyPostHandler = (data) => {
    // console.log(data)
    const $ = cheerio.load(data)

    let images = []


    $('#main-content .richcontent').each((i, ele) => {
        const href = $(ele).find('a').attr('href')

        if(href !== undefined){
          const hash = href.replace('//imgur.com/', '')
          // the correct url is: https://i.imgur.com/${hash}.jpg
          images.push(`https://i.imgur.com/${hash}.jpg`)
        }


    })

    return {images}
}

export default beautyPostHandler