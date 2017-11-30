var request = require('request');
var cheerio = require('cheerio');

exports.init = function(app) {
    app.get("/", index)
    app.get("/config", config)
    app.get('/live-config', liveconfig)
    app.get('/viewer', viewer)
    app.get('/scrape/:path', scrape)
}
index = function(req,res) {
    res.render("index")
}
config = function(req,res) {
    res.render('config')
}

liveconfig = function(req,res) {
    res.render('live-config')
}

viewer = function(req,res) {
    res.render('viewer')
}

scrape = function(req,res) {
    ///scrape/https%3A%2F%2Fwww.crowdrise.com%2Finternational-day-of-the-girl
    var url =req.params.path
    console.log("url", url)
    request(url, function(error, response, html){
       if(!error) {
           var $ = cheerio.load(html);
           var name, amount
           var json = { name : "", amount : ""};

           // assume most recent on top
           console.log(html)
       }
    })
   
}
