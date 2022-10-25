const axios = require('axios')
const jsdom = require('jsdom')

//Parser function: accepts a link with all query parameters but pagination added to the string , as the function adds
//pagination strictly at the end of the url string
//All query parameters should be set outside of parse function
async function parse(link) {
    try {
        const response = [];
        //Function that parses all apartments from a page at a url and returns an array of pojo obhects
        const parsePage = async function (link) {
            const page = await axios.get(link)
            const dom = new jsdom.JSDOM(page.data)
            //get all elements that corespond with a single apartment
            const elements = [...dom.window.document.querySelectorAll('div.col-lg-12.col-md-12.col-sm-12')]
            //parse data from them into an object
            const appartments = elements.map((element) => {
                const appartment = {}
                appartment.label = element.querySelector('h3.hidden-lg.title-text.text-center')
                    ?.querySelector('a')?.textContent
                    .replace(/\n/g, '').replace(/\s{2,}/g, ' ').trim()
                appartment.address = element.querySelector('a.btn.btn-default')?.textContent
                    .replace(/\n/g, '').replace(/\s{2,}/g, ' ').trim()
                const support = element.querySelector('div.row.characteristics-apart.text-center')
                    ?.querySelectorAll("p")
                appartment.maxppl = support[0]?.textContent
                    .replace(/\n/g, '').replace(/\s{2,}/g, ' ').trim()
                appartment.rooms = support[1]?.textContent
                    .replace(/\n/g, '').replace(/\s{2,}/g, ' ').trim()
                appartment.beds = support[2]?.textContent.replace(/\n/g, '').replace(/\s{2,}/g, ' ').trim()
                appartment.price = element.querySelectorAll('div.apartment-price-box.text-center')[0]
                    ?.textContent.replace(/\n/g, '').replace(/\s{2,}/g, ' ').trim()
                appartment.link = element.querySelectorAll('div.apartment-price-box.text-center')[1]
                    ?.querySelector("a").href
                appartment.description = element.querySelector('div.col-md-12.content-padding').textContent
                    .replace(/\n/g, '').replace(/\s{2,}/g, ' ').trim()
                const contacts = element.querySelectorAll('.col-sm-6.text-center')
                appartment.phone = contacts[0]
                    ?.querySelector("a").textContent
                    .replace(/\n/g, '').replace(/\s{2,}/g, ' ').trim()
                appartment.email = contacts[1]
                    ?.querySelector("a").textContent
                    .replace(/\n/g, '').replace(/\s{2,}/g, ' ').trim()
                return appartment
            })
            //get the pagination link
            const next = dom.window.document.getElementsByClassName('pagination')[0].querySelector('.active').nextElementSibling.textContent
            return {
                data: appartments,
                next
            }
        }
        //Cal the parsePage function while pages are present
        for (let i = 1; i > 0; i++) {
            const page = 'page=' + i;
            const result = await parsePage(link + page)
            //While the next pagination button doesn't become >>
            if (result.next === "»") {
                //if pagination finished
                break;
            }
            response.push(...result.data)
        }
        return response
    } catch (err) {
        throw err
    }
}

module.exports = parse