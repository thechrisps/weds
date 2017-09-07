var utils = require("./utils");

module.exports = function (app) {
    app.get('/invite/', function (req, res) {
        res.render("invite");
    });

    app.get('/invite/:code', function (req, res) {
        var inviteCode = req.params.code;
        if (isValidInvite(inviteCode)) {
            utils.checkInvite(inviteCode, function (friendlyName) {
                res.render("register", { "friendlyName": friendlyName, "inviteCode": inviteCode });
            });
        }
    });

    app.get('/validateinvite/:code', function (req, res) {
        var inviteCode = req.params.code;
        if (isValidInvite(inviteCode)) {
            utils.checkInvite(inviteCode, function (friendlyName) {
                if (typeof friendlyName !== "undefined" &&  friendlyName != "") {
                    utils.dispatchJsonResponse(res, { "status": "ok", "response": { "valid": "1" } });
                } else {
                    utils.dispatchJsonResponse(res, { "status": "ok", "response": { "valid": "0" } });
                }
            });
        } else {
            utils.dispatchJsonResponse(res, { "status": "ok", "response": { "valid": "0" } });
        }
    });

    app.get('/register/:code/', function (req, res) {
        var inviteCode = req.params.code;
        var email = req.query.email;
        if (isValidInvite(inviteCode)) {
            utils.checkInvite(inviteCode, function (friendlyName) {
                utils.registerEmail(inviteCode, email);
                utils.dispatchJsonResponse(res, { "status": "ok", "response": { "saved": "1" } });
            });
        } else {
            utils.dispatchJsonResponse(res, { "status": "ok", "response": { "saved": "0" } });
        }
    });
}

function isValidInvite(inviteCode) {
    if (/^[A-Z]{5}$/.test(inviteCode)) {
        //if (inviteCode == "ABCDEF") {
            return true;
        //}
    }
    return false;
}
