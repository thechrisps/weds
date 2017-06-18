module.exports = function(app){



    app.get('/invite', function(req, res){
        res.send("Test:"+util.getDatabaseDefinition().stringify());
    });

    //other routes..
}
