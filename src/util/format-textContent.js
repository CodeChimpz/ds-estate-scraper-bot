module.exports = function(){
    return this.replace(/\n/g, '').replace(/\s{2,}/g, ' ').trim()
}