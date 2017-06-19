var utils = require("./utils");

module.exports = function(app){
    app.get('/invite/:code', function(req, res){
      var inviteCode = req.params.code;
      res.send("Test:"+utils.getDatabaseDefinition().toString());
      res.send("Invite: "+inviteCode);
    });

    //other routes..
}
