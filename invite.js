var utils = require("./utils");

module.exports = function (app) {
    app.get('/invite/', function (req, res) {
        res.render("invite");
    });

    app.get('/invite/:code', function (req, res) {
        var inviteCode = req.params.code;
        if (isValidInvite(inviteCode)) {
            utils.checkInvite(inviteCode, function (friendlyName) {
                res.render("register", { "friendlyName": friendlyName });
            });
        } else {
            utils.dispatchJsonResponse(res, { "status": "ok", "response": { "valid": "0" } });
        }
    });

    app.get('/validateinvite/:code', function (req, res) {
        var inviteCode = req.params.code;
        if (isValidInvite(inviteCode)) {
            utils.dispatchJsonResponse(res, { "status": "ok", "response": { "valid": "1" } });
        } else {
            utils.dispatchJsonResponse(res, { "status": "ok", "response": { "valid": "0" } });
        }
    });

    //other routes..
}

function isValidInvite(inviteCode) {
    if (/^[A-Z]{5}$/.test(inviteCode)) {
        //if (inviteCode == "ABCDEF") {
            return true;
        //}
    }
    return false;
}
