const axios = require('axios')
const jsdom = require('jsdom')

//Parses a webpage
class Parser {
    //composites parseData and parsePagination functions passed as constructor parameters
    constructor(urlObj, parseDataFunc, parsePaginationFunc) {
        this.urlOptions = urlObj
        //parseData should accept a DOM object and return an Array of apartment objects
        this.parsePagination = parsePaginationFunc
        //parsePagination should parse from DOM and return null if the page doesn't have any links to the next one
        this.parseData = parseDataFunc
    }

    //Parser function: accepts a link object with query options,
    //then paginates through the site based on parsePagination response,
    //while scraping apartmentc datat with parseData
    //returns an Array of apartments
    async parse(options) {
        try {
            //Cal the parsePage function while pages are present
            const response = [];
            for (let i = 0; i >= 0; i++) {
                //Build url from a passed object
                //We still pass the whole object to parseData, as we may need to address
                //domain to build url from img srcs, for example
                const page = '&page=' + (i ? i + 1 : '');
                const link = this.urlOptions.fullurl + '?' + (options ?? '') + page

                const pagedata = await axios.get(link)
                const dom = new jsdom.JSDOM(pagedata.data)

                const result = await this.parseData(dom)
                const persist = await this.parsePagination(dom)
                //While the next pagination is available
                if (!persist) {
                    //if pagination finished
                    break;
                }
                response.push(...result)
            }
            return response
        } catch (err) {
            throw err
        }
    }
}

module.exports = Parser