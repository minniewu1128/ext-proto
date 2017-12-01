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
    /* only supports the below path currently:
        /scrape/https%3A%2F%2Fwww.crowdrise.com%2Finternational-day-of-the-girl
    */
    var url =req.params.path
    console.log("url", url)
    request(url, function(error, response, html){
       if(!error) {
            var $ = cheerio.load(html);
            var donors
            var json = {donors: []}
            namesSel = $('#donor_list span.left p')
            amountsSel = $('#donor_list span.right p')
            
            
            for(i=0; i<namesSel.length; i++){
            
            var name = namesSel[i].firstChild.data
            var amount = amountsSel[i].firstChild.data
            var donor = { name:name, amount:amount}

            json.donors.push(donor)
           }


           // turn amounts to integer
           res.send(json)
           console.log('json sent')
        
       }
    })
   
}
