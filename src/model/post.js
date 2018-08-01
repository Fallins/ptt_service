import cheerio from 'cheerio'

const postHandler = (data) => {
    console.log(data)
    const $ = cheerio.load(data)
    
    let auther, title, time, content, pushes = [], html
    
    $('#main-content .article-meta-value').each((i, ele) => {
        const $ele = $(ele)
        switch(i){
            case 0:
                auther = $ele.text()
                break
            case 2:
                title = $ele.text()
                break
            case 3:
                time = $ele.text()
                break
        }    
    })

    $('.push').each((i, ele) => {
        const $ele = $(ele)
        const tag = $ele.find('.push-tag').text()
        const userid = $ele.find('.push-userid').text()
        const content = $ele.find('.push-content').text()
        const ipdatetime = $ele.find('.push-ipdatetime').text()

        pushes.push({
            tag, userid, content, ipdatetime
        })
    })

    // remove will cause side effect, So it has to be process in the end
    $('#main-content .richcontent').each((i, ele) => {
        const $ele = $(ele)
        $ele.after($ele.find('img, iframe'))
    })
    $('#main-content div').remove()
    $('#main-content span>a').remove()
    $('#main-content a').remove()
    
    content = $('#main-content').text()
    html = $('#main-content').html()

    // console.log({auther, title, time, content, pushes, html})
    return {auther, title, time, content, pushes, html}
}

export default postHandler