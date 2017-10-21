var utils = require("./utils");
var jsesc = require('jsesc');

module.exports = function (app) {
    app.get('/rsvp/', function (req, res) {
        res.render("rsvp");
    });

    app.get('/rsvp/:code', function (req, res) {
        var inviteCode = jsesc(req.params.code);
        var person = ((isNaN(req.query.personid) == false) ? req.query.personid : 0);
        var ceremony = ((req.query.ceremony === "yes") ? 1 : 0);
        var reception = ((req.query.reception === "yes") ? 1 : 0);
        var evening = ((req.query.evening === "yes") ? 1 : 0)

        console.log("Updating attendance for person " + person + " on invite " + inviteCode + ". Attending... ceremony: " + ceremony + ", reception: " + reception + ", evening: " + evening);

        if (isValidInvite(inviteCode)) {
            utils.checkInvite(inviteCode, function (friendlyName) {
                res.render("register", { "friendlyName": friendlyName, "inviteCode": inviteCode });
            });
        }
    });

    app.get('/rsvpsaveperson/:code/', function (req, res) {
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
