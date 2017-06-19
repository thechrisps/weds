var utils = require("./utils");

module.exports = function(app){
    app.get('/invite/:code', function(req, res){
      var inviteCode = req.params.code;
      if isValidInvite(inviteCode) {
        utils.dispatchJsonResponse(res, {"status": "ok", "response": {"valid": "1"}});
      }, else {
        utils.dispatchJsonResponse(res, {"status": "ok", "response": {"valid": "0"}});
      }
    });

    //other routes..
}

function isValidInvite(inviteCode) {
  if (inviteCode == "ABCDEF") {
    return true;
  }
  return false;
}
