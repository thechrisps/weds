module.exports = function(app){

    var connection = process.env.MYSQLCONNSTR_localdb.match(/^.*Data Source=(.+?);.*$/gm)

    app.get('/invite', function(req, res){
        res.send("Test:"+connection);
    });

    //other routes..
}
