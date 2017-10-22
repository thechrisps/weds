var utils = require("./utils");
var jsesc = require('jsesc');
const util = require('util')

module.exports = function (app) {
    app.get('/rsvp/', function (req, res) {
        res.render("rsvp");
    });

    app.get('/rsvpsave/:code', function (req, res) {
        var inviteCode = jsesc(req.params.code);
        console.log("RSVP Save == Code:" + inviteCode + ". Query String: " + util.inspect(req.query, false, null));
        var person = parseInt(req.query.personid);
        var ceremony = parseInt(req.query.ceremony);
        var reception = parseInt(req.query.reception);
        var evening = parseInt(req.query.evening);
        var requirements = jsesc(req.query.requirements);

        if (isNaN(person) || isNaN(ceremony) || isNaN(reception) || isNaN(evening)) {
            utils.dispatchJsonResponse(res, { "status": "ok", "response": { "valid": "0", "error": "We're very sorry, but your responses have not been handled correctly. Please try again, or contact us on Facebook / by phone." } });
            return
        }

        console.log("Updating attendance for person " + person + " on invite " + inviteCode + ". Attending... ceremony: " + ceremony + ", reception: " + reception + ", evening: " + evening+". Requirements: "+requirements);

        if (isValidInvite(inviteCode)) {
            utils.checkInvite(inviteCode, function (friendlyName) {
                if (friendlyName != "") {
                    dbResponse = utils.updateRSVP(inviteCode, person, ceremony, reception, evening, requirements, function (results) {
                        console.log("DB Response: " + results);
                        if (results != "Error" && results > 0) {
                            // Returning success
                            utils.dispatchJsonResponse(res, { "status": "ok", "response": { "valid": "1" } });
                            return;
                        } else {
                            utils.dispatchJsonResponse(res, { "status": "ok", "response": { "valid": "0", "error": "We're very sorry, but for some reason, your response has not been saved. Please try again, or contact us on Facebook / by phone." } });
                            return;
                        }
                    });
                    if (dbResponse === "Error") {
                        utils.dispatchJsonResponse(res, { "status": "ok", "response": { "valid": "0", "error": "We're very sorry, but we have been unable to connect to our database. We cannot save your RSVP responses. Please try again, or contact us on Facebook / by phone." } });
                        return;
                    }
                } else {
                    utils.dispatchJsonResponse(res, { "status": "ok", "response": { "valid": "0", "error": "Invite code " + inviteCode + " does not seem to be a code that we recognise." } });
                    return;
                }
            });
        } else {
            utils.dispatchJsonResponse(res, { "status": "ok", "response": { "valid": "0", "error": "Invite code " + inviteCode + " does not appear to be valid." } });
            return;
        }
    });

    app.get('/rsvpview/:code/', function (req, res) {
        var inviteCode = req.params.code;
        if (isValidInvite(inviteCode)) {
            utils.checkInvite(inviteCode, function (friendlyName) {
                res.render("rsvp", {"inviteCode":inviteCode, "people": [{ name: "Joe", personId: "1", ceremony: "1", reception: "1", evening: "-1", requirements: "None" }, { name: "Fred", personId: "2", ceremony: "-1", reception: "-1", evening: "0", requirements: "Vegan" }] });
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
