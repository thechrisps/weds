var utils = require("./utils");
var jsesc = require('jsesc');

module.exports = function (app) {
    app.get('/rsvp/', function (req, res) {
        res.render("rsvp");
    });

    app.get('/rsvpsave/:code', function (req, res) {
        var inviteCode = jsesc(req.params.code);
        var person = ((isNaN(req.query.personid) == false) ? req.query.personid : 0);
        var ceremony = ((req.query.ceremony === "yes") ? 1 : 0);
        var reception = ((req.query.reception === "yes") ? 1 : 0);
        var evening = ((req.query.evening === "yes") ? 1 : 0)
        var requirements = jsesc(req.query.requirements);

        console.log("Updating attendance for person " + person + " on invite " + inviteCode + ". Attending... ceremony: " + ceremony + ", reception: " + reception + ", evening: " + evening+". Requirements: "+requirements);

        if (isValidInvite(inviteCode)) {
            utils.checkInvite(inviteCode, function (friendlyName) {
                if (friendlyName != "") {
                    dbResponse = utils.updateRSVP(inviteCode, person, ceremony, reception, evening, requirements, function (results) {
                        console.log("DB Response: " + results);
                        if (results != "Error" && results > 0) {
                            // Returning success
                            utils.dispatchJsonResponse(res, { "status": "ok", "response": { "valid": "1" } });
                        } else {
                            utils.dispatchJsonResponse(res, { "status": "ok", "response": { "valid": "0", "error": "We're very sorry, but for some reason, your response has not been saved. Please try again, or contact us on Facebook / by phone." } });
                        }
                    });
                    if (dbResponse === "Error") {
                        utils.dispatchJsonResponse(res, { "status": "ok", "response": { "valid": "0", "error": "We're very sorry, but we have been unable to connect to our database. We cannot save your RSVP responses. Please try again, or contact us on Facebook / by phone." } });
                    }
                } else {
                    utils.dispatchJsonResponse(res, { "status": "ok", "response": { "valid": "0", "error": "Invite code " + inviteCode + " does not seem to be a code that we recognise." } });
                }
            });
        } else {
            utils.dispatchJsonResponse(res, { "status": "ok", "response": { "valid": "0", "error": "Invite code " + inviteCode + " does not appear to be valid." } });
        }
    });

    app.get('/rsvpview/:code/', function (req, res) {
        var inviteCode = req.params.code;
        if (isValidInvite(inviteCode)) {
            utils.checkInvite(inviteCode, function (friendlyName) {
                res.render("rsvp", { "friendlyName": friendlyName, "inviteCode": inviteCode });
            });
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
