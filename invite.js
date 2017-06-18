module.exports = function(app){
    app.get('/invite', function(req, res){
      res.send("Test");
        //res.send("Test:"+utils.getDatabaseDefinition().toString());
    });

    //other routes..
}
