exports.init = function(app) {
    app.get("/", index)
    app.get("/config", config)
    app.get('/live-config', liveconfig)
    app.get('/viewer', viewer)
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
