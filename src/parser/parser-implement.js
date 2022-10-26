const Parser = require('./Parser')
const util = require('../util')
String.prototype.format_c = util.format
//Declare parsers for specific webpages

const Parser1 = new Parser(
    {
        domain:'https://www.cvs.md',
        fullurl:'https://www.cvs.md/en/chisinau_apartment_rental/long_term_rentals'
    },function (dom) {
        //get all elements that correspond with a single apartment
        const elements = [...dom.window.document.querySelectorAll('div.col-lg-12.col-md-12.col-sm-12')]
        //parse data from them into an object
        return elements.map((element) => {
            const appartment = {}
            appartment.label = element.querySelector('h3.hidden-lg.title-text.text-center')?.querySelector('a')
                ?.textContent.format_c()
            appartment.address = element.querySelector('a.btn.btn-default')?.textContent.format_c()
            const support = element.querySelector('div.row.characteristics-apart.text-center')?.querySelectorAll("p")
            appartment.maxppl = support[0]?.textContent.format_c()
            appartment.rooms = support[1]?.textContent.format_c()
            appartment.beds = support[2]?.textContent.format_c()
            appartment.price = element.querySelectorAll('div.apartment-price-box.text-center')[0]
                ?.textContent.format_c()
            appartment.link = element.querySelectorAll('div.apartment-price-box.text-center')[1]
                ?.querySelector("a").href
            appartment.descr = element.querySelector('div.col-md-12.content-padding').textContent.format_c()
            const contacts = element.querySelectorAll('.col-sm-6.text-center')
            appartment.phone = contacts[0]?.querySelector("a").textContent.format_c()
            appartment.email = contacts[1]?.querySelector("a").textContent.format_c()
            appartment.img = [...element.querySelector('.carousel-inner').querySelectorAll('img')].map(img => {
                return this.urlOptions.domain + '/' + encodeURI(img.src)
            })
            return appartment
        })
    },(dom)=>{
        const next = dom.window.document.getElementsByClassName('pagination')[0].querySelector('.active').nextElementSibling.textContent
        if (next === "»") {
            return 0
        }
        return 1
    }
)


module.exports = [
    Parser1
]