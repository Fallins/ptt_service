import cheerio from 'cheerio'

const beautyPostHandler = (data) => {
    // console.log(data)
    const $ = cheerio.load(data)

    let images = []


    $('#main-content .richcontent').each((i, ele) => {
        const $ele = $(ele).find('a').attr('href')

        if($ele !== undefined)
          images.push(`https:${$ele}`)
    })

    return {images}
}

export default beautyPostHandler