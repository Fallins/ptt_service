import cheerio from 'cheerio'

const igHandler = (html) => {
    const $ = cheerio.load(html)
    const images = []
    $('main article .FFVAD').each(function(idx, ele) {
      const srcArr = $(ele).attr('srcset').split(',')
      if(srcArr && srcArr[3])
        images.push(srcArr[3].replace(' 480w', ''))
    })

    // console.log(images)
    console.log({length: images.length})

    return images
}

export default igHandler