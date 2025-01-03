const axios = require('axios')
const cheerio = require('cheerio')
const fetch = require('node-fetch')
const FormData = require('form-data')

// ========== [ ANIME ] ========== \\
const character = async (name) => {
    return new Promise(async (resolve, reject) => {
        await axios.get('https://www.anime-planet.com/characters/all?name=' + name)
            .then(({ data }) => {
                let $ = cheerio.load(data)
                let img = $('.mainEntry > img').attr('src')
                let description = $('.pure-1 > div > p').text().trim()

                return resolve({ status: true, creator: 'NuxrDev', result: { img, description } })
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

const kiryu = async (query) => {
    return new Promise(async (resolve, reject) => {
        await axios.get('https://kiryuu.id/?s=' + query)
            .then(({ data }) => {
                let result = []
                let $ = cheerio.load(data)

                $('.listupd > div').get().map(a => {
                    let url = $(a).find('.bs > .bsx > a').attr('href')
                    let title = $(a).find('.bs > .bsx > a').attr('title')
                    let thumb = $(a).find('.bs > .bsx > a > .limit > img').attr('src')
                    let last = $(a).find('.bs > .bsx > a > .bigor > .adds > .epxs').text().trim()
                    let rating = $(a).find('.bs > .bsx > a > .bigor > .adds > .rt > .rating > .numscore').text().trim()
                    let status = ($(a).find('.bs > .bsx > a > .limit > span.status.Completed').text().trim()) ? $(a).find('.bs > .bsx > a > .limit > span.status.Completed').text().trim() : 'Ongoing'

                    result.push({ last, rating, status, title, thumb, url })
                })

                if (!result || !result.length) return resolve({ statur: false, creator: 'NuxrDev' })
                return resolve({ status: true, creator: 'NuxrDev', result })
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

const anime = async (query) => {
    return new Promise(async (resolve, reject) => {
        await axios.get('https://www.anime-planet.com/anime/all?name=' + query)
            .then(({ data }) => {
                let result = []
                let $ = cheerio.load(data)

                $('#siteContainer > ul.cardDeck.cardGrid > li').each((b, a) => {
                    let url = $(a).find('a').attr('href')
                    let title = $(a).find('h3.cardName').text().trim()
                    let thumb = $(a).find('.card > a > .crop > img').attr('src')

                    if (thumb === '/inc/img/card-load.svg') return
                    result.push({ title, url: 'https://www.anime-planet.com' + url, thumb })
                })

                if (!result || !result.length) return resolve({ status: false, creator: 'NuxrDev' })
                return resolve({ status: true, creator: 'NuxrDev', result })
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

const manga = async (query) => {
    return new Promise(async (resolve, reject) => {
        await axios.get('https://www.anime-planet.com/manga/all?name=' + query)
            .then(({ data }) => {
                let result = []
                let $ = cheerio.load(data)

                $('.cardDeck > li').each((a, b) => {
                    let url = $(b).find('a').attr('href')
                    let thumb = $(b).find('img').attr('src')
                    let title = $(b).find('.cardName').text().trim()

                    if (thumb === '/inc/img/card-load.svg') return
                    result.push({ title, url: 'https://www.anime-planet.com' + url, thumb })
                })

                if (!result || !result.length) return resolve({ status: false, creator: 'NuxrDev' })
                return resolve({ status: true, creator: 'NuxrDev', result })
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

// ========== [ SEARCHER ] ========== \\
const stickerpack = async (query) => {
    return new Promise(async (resolve, reject) => {
        await axios.get('https://getstickerpack.com/stickers?query=' + query)
            .then(async ({ data }) => {
                let source = []
                let $ = cheerio.load(data)

                $('div.sticker-pack-cols').each((a, b) => {
                    source.push($(b).find('a').attr('href'))
                })

                await axios.get(source[Math.floor(Math.random() * source.length)])
                    .then(({ data }) => {
                        let url = []
                        $ = cheerio.load(data)

                        $('div.sticker-pack-cols').each((a, b) => {
                            url.push($(b).find('img').attr('src'))
                        })

                        let json = (url.length) ? { status: true, creator: 'NuxrDev', result: url } : { status: false, creator: 'NuxrDev' }
                        return resolve(json)
                    })
                    .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

const pinterest = async (query) => {
    return new Promise(async (resolve, reject) => {
        await axios({ method: 'get', url: 'https://id.pinterest.com/search/pins/?autologin=true&q=' + query, headers: { "cookie": "_auth=1; _b=\"AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=\"; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0" } })
            .then(({ data }) => {
                let result = []
                let $ = cheerio.load(data)

                $('div > a').get().map(b => {
                    let url = $(b).find('img').attr('src')
                    if (url === undefined || url === 'https://i.pinimg.com/75x75_RS/9e/83/41/9e834154eda275f4d5d56ecde2cbf1ca.jpg') return

                    result.push(url.replace(/236/g, '736'))
                })

                let json = result.length ? { status: true, creator: 'NuxrDev', result } : { status: false, creator: 'NuxrDev' }
                return resolve(json)
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

const wikimedia = async (query) => {
    return new Promise(async (resolve, reject) => {
        await axios.get('https://commons.wikimedia.org/w/index.php?search=' + query + '&title=Special:MediaSearch&go=Go&type=image')
            .then(({ data }) => {
                let result = []
                let $ = cheerio.load(data)

                $('.sdms-search-results__list-wrapper > div > a').each(function (a, b) {
                    let url = $(b).find('img').attr('data-src') || $(b).find('img').attr('src')
                    result.push(url)
                })

                let json = (result.length) ? { status: true, creator: 'NuxrDev', result } : { status: false, creator: 'NuxrDev' }
                return resolve(json)
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

const dafont = async (query) => {
    return new Promise(async (resolve, reject) => {
        await axios.get('https://www.dafont.com/search.php?q=' + query)
            .then(({ data }) => {
                let result = []
                let $ = cheerio.load(data)

                $('.dlbox').get().map(b => {
                    let url = $(b).find('a').attr('href')
                    result.push('https:' + url)
                })

                let json = (result.length) ? { status: true, creator: 'NuxrDev', result } : { status: false, creator: 'NuxrDev' }
                return resolve(json)
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

const wikipedia = async (query) => {
    return new Promise(async (resolve, reject) => {
        await axios.get('https://id.wikipedia.org/wiki/' + query)
            .then(({ data }) => {
                let $ = cheerio.load(data)
                let artikel = $('div.mw-parser-output > p').text()
                let image = 'https:' + ($('.infobox-image > span > a > img').attr('src') || $('.mw-file-description > img').attr('src'))

                if (!image || !artikel) return resolve({ status: false, creator: 'NuxrDev' })
                return resolve({ status: true, creator: 'NuxrDev', result: { image, artikel } })
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

// ========== [ RANDOM TEXT ] ========== \\
const artinama = async (name) => {
    return new Promise(async (resolve, reject) => {
        await axios.get('https://www.primbon.com/arti_nama.php?nama1=' + name + '&proses=+Submit%21+')
            .then(({ data }) => {
                let $ = cheerio.load(data)
                let arti = $('#body').text().split(', memiliki arti: ')[1].split('Nama:')[0].trim()

                return resolve({ status: true, creator: 'NuxrDev', result: arti })
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

const quotes = async () => {
    return new Promise(async (resolve, reject) => {
        await axios.get('https://api.quotable.io/random')
            .then(({ data }) => {
                if (!data || !data.content) return resolve({ status: false, creator: 'NuxrDev' })
                return resolve({ status: true, creator: 'NuxrDev', result: { name: data.author, quote: data.content } })
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

const quotesNime = async () => {
    return new Promise(async (resolve, reject) => {
        let page = Math.floor(Math.random() * 189)
        await axios.get('https://otakotaku.com/quote/feed/' + page)
            .then(({ data }) => {
                let result = []
                let $ = cheerio.load(data)

                $('div.kotodama-list').each((a, b) => {
                    result.push({ name: $(b).find('div.char-name').text().trim(), quote: $(b).find('div.quote').text().trim() })
                })

                let quote = result[Math.floor(Math.random() * result.length)]
                let json = (result.length) ? { status: true, creator: 'NuxrDev', result: quote } : { status: false, creator: 'NuxrDev' }
                return resolve(json)
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

// ========== [ CONVERTER ] ========== \\
const ssWeb = async ({ width, height, url }) => {
    return new Promise(async (resolve, reject) => {
        await axios.post('https://webscreenshot.vercel.app/api', { format: 'jpeg', full: false, isTweet: false, scale: 1, width, height, url })
            .then(({ data }) => {
                if (!data || !data.image) return resolve({ status: false, creator: 'NuxrDev' })
                return resolve({ status: true, creator: 'NuxrDev', result: data.image })
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

const removeBg = async (image) => {
    return new Promise(async (resolve, reject) => {
        await axios.post('https://backend.zyro.com/v1/ai/remove-background', { image })
            .then(({ data }) => {
                if (!data || !data.result) return resolve({ status: false, creator: 'NuxrDev' })
                return resolve({ status: true, creator: 'NuxrDev', result: data.result })
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

const upscale = async (image) => {
    return new Promise(async (resolve, reject) => {
        await axios.post('https://upscaler.zyro.com/v1/ai/image-upscaler', { image_data: image })
            .then(({ data }) => {
                if (!data || !data.upscaled) return resolve({ status: false, creator: 'NuxrDev' })
                return resolve({ status: true, creator: 'NuxrDev', result: data.upscaled })
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

// ========== [ DOWNLOADER ] ========== \\
const youtubeDL = async (url) => {
    return new Promise(async (resolve, reject) => {
        await axios.post('https://video-downloader.optizord.com/wp-json/aio-dl/video-data/', { url, token: 'f46b50094b28d24a8dbb563979b2326e021017d334b972393b10d06c2e1f9344' })
            .then(({ data }) => {
                let hasil = []
                if (!data) return resolve({ status: false, creator: 'NuxrDev' })

                data.medias.forEach(v => {
                    if (!v || (!v.audioAvailable)) return
                    hasil.push({ quality: v.quality, audioAvailable: v.audioAvailable, filetype: v.extension, url: v.url })
                })

                let json = (hasil.length) ? { status: true, creator: 'NuxrDev', result: { title: data.title, thumbnail: data.thumbnail, media: hasil } } : { status: false, creator: 'NuxrDev' }
                return resolve(json)
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

const facebook = async (url) => {
    return new Promise(async (resolve, reject) => {
        await axios.post('https://getmyfb.com/process', { id: url, locale: 'en' })
            .then(({ data }) => {
                let $ = cheerio.load(data)
                let urlHd = $('ul.results-list > li:first-child > a').attr('href')
                let qualityHd = $('ul.results-list > li:first-child').text().replace(/\n|Download| /g, '')

                let urlSd = $('ul.results-list > li:last-child > a').attr('href')
                let qualitySd = $('ul.results-list > li:last-child').text().replace(/\n|Download| /g, '')

                let thumbnail = $('.results-item-image').attr('src')

                return resolve({ status: true, creator: 'NuxrDev', result: { thumbnail, hd: { quality: qualityHd, url: urlHd }, sd: { quality: qualitySd, url: urlSd } } })
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

const tiktokDL = async (url) => {
    return new Promise(async (resolve, reject) => {
        await axios.get('https://tikmate.cc/analyze?url=' + url)
            .then(({ data }) => {
                if (!data || data.error) return resolve({ status: false, creator: 'NuxrDev' })
                return resolve({ status: true, creator: 'NuxrDev', result: { creator: data.formats.creator, title: data.formats.title, thumbnail: data.formats.thumbnail, video: data.formats.video, audio: data.formats.audio } })
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

const soundcloud = async (url) => {
    return new Promise(async (resolve, reject) => {
        let getToken = await axios.get('https://soundcloudmp3.org/id')
        let $t = cheerio.load(getToken.data)

        let token = $t('form#conversionForm > input[type=hidden]').attr('value')
        if (!token) return resolve({ status: false, creator: 'NuxrDev' })

        await axios.post('https://soundcloudmp3.org/converter', { _token: token, url }, { headers: { "content-type": "application/x-www-form-urlencoded;", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36", "Cookie": getToken['headers']['set-cookie'] } })
            .then(({ data }) => {
                let $u = cheerio.load(data)
                let url = $u('#download-btn').attr('href')

                if (!url) return resolve({ status: false, creator: 'NuxrDev' })
                return resolve({ status: true, creator: 'NuxrDev', result: url })
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })

    })
}

const mediafire = async (url) => {
    return new Promise(async (resolve, reject) => {
        await axios.get(url)
            .then(({ data }) => {
                let $ = cheerio.load(data)
                let filetype = $('.filetype').text()
                let url = $('#downloadButton').attr('href')
                let filename = $('.dl-btn-label').attr('title')
                let filesize = $('ul.details > li:nth-child(1) > span').text()
                let uploaded = $('ul.details > li:nth-child(2) > span').text()

                if (!url) return resolve({ status: false, creator: 'NuxrDev' })
                return resolve({ status: true, creator: 'NuxrDev', result: { filesize, filetype, uploaded, filename, url } })
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

const instaDL = async (url) => {
    return new Promise(async (resolve, reject) => {
        let formdata = new URLSearchParams({ url, via: 'form' })
        await fetch('https://snapinsta.world/api/instagram', { method: 'POST', body: formdata })
            .then(async (result) => {
                let json = await result.json()

                if (!json.success) return resolve({ status: false, creator: 'NuxrDev' })
                return resolve({ status: true, creator: 'NuxrDev', result: json.data.medias })
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

const twitter = async (url) => {
    return new Promise(async (resolve, reject) => {
        await axios.get('https://snaptwitter.com/')
            .then(async ({ data }) => {
                let $ = cheerio.load(data)
                let token = $('input[name="token"]').val()

                let formdata = new URLSearchParams({ url, token })
                await fetch('https://snaptwitter.com/action.php', { method: 'POST', body: formdata })
                    .then(async (result) => {
                        let json = await result.json()
                        let $ = cheerio.load(json.data)

                        let thumbnail = $('.videotikmate-left > img').attr('src')
                        let url = 'https://snaptwitter.com' + $('.abuttons > a').attr('href')
                        let quality = $('.is-desktop-only > .abuttons > a > span').text().replace(/Download Video |(|)| /g, '').split('(')[1].split('x')[0] || null

                        return resolve({ status: true, creator: 'NuxrDev', result: { quality, thumbnail, url } })
                    })
                    .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

const y2mate = async (url) => {
    return new Promise(async (resolve, reject) => {
        let formdata = { k_query: url, q_auto: 0, ajax: 1, k_page: 'instagram' }
        await fetch('https://www.y2mate.com/mates/analyzeV2/ajax', { method: 'POST', headers: { accept: "*/*", 'accept-language': "en-US,en;q=0.9", 'content-type': "application/x-www-form-urlencoded; charset=UTF-8" }, body: Object.keys(formdata).map(key => `${key}=${encodeURIComponent(formdata[key])}`).join('&') })
            .then(async (result) => {
                let json = await result.json()

                if (json.status !== 'ok') return resolve({ status: false, creator: 'NuxrDev' })
                return resolve({ status: true, creator: 'NuxrDev', result: { title: json.title, thumbnail: json.thumbnail, video: json.links.video } })
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

// ========== [ CHECKER ] ========== \\
const getMole = async ({ user_id, zone_id }) => {
    return new Promise(async (resolve, reject) => {
        await axios.post('https://www.smile.one/merchant/mobilelegends/checkrole/', { user_id, zone_id, pid: 25, checkrole: 1 })
            .then(({ data }) => {
                if (!data || data.code !== 200) return resolve({ status: false, creator: 'NuxrDev' })
                return resolve({ status: true, creator: 'NuxrDev', result: data.username })
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

const getPLN = async (id) => {
    return new Promise(async (resolve, reject) => {
        await axios.post('https://api.digiflazz.com/v1/transaction', { commands: 'pln-subscribe', customer_no: id })
            .then(({ data }) => {
                if (!data || !data.data.name) return resolve({ status: false, creator: 'NuxrDev' })
                return resolve({ status: true, creator: 'NuxrDev', result: data.data })
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

// ========== [ ARTIFICIAL INTELLIGENCE ] ========== \\
const aiSlogan = async (keyword) => {
    return new Promise(async (resolve, reject) => {
        await axios.post('https://backend.zyro.com/v1/ai/slogans', { keyword })
            .then(({ data }) => {
                if (!data || !data.slogans) return resolve({ status: false, creator: 'NuxrDev' })
                return resolve({ status: true, creator: 'NuxrDev', result: data.slogans })
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

const aiName = async (keyword) => {
    return new Promise(async (resolve, reject) => {
        let keywords = keyword.split(',')
        await axios.post('https://backend.zyro.com/v1/ai/names', { keywords })
            .then(({ data }) => {
                if (!data || !data.names) return resolve({ status: false, creator: 'NuxrDev' })
                return resolve({ status: true, creator: 'NuxrDev', result: data.names })
            })
            .catch(() => { return resolve({ status: false, creator: 'NuxrDev' }) })
    })
}

module.exports = { character, kiryu, anime, manga, stickerpack, pinterest, wikimedia, dafont, wikipedia, artinama, quotes, quotesNime, ssWeb, removeBg, upscale, youtubeDL, tiktokDL, soundcloud, mediafire, instaDL, twitter, y2mate, facebook, getMole, getPLN, aiSlogan, aiName }