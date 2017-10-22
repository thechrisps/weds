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
        console.log("Person ID: " + person);
        var ceremony = parseInt(req.query.ceremony);
        console.log("Ceremony: " + ceremony);
        var reception = parseInt(req.query.reception);
        console.log("Reception: " + reception);
        var evening = parseInt(req.query.evening);
        console.log("Evening: " + evening);
        var requirements = jsesc(req.query.requirements);

        if (isNaN(person) || isNaN(ceremony) || isNaN(reception) || isNaN(evening)) {
            utils.dispatchJsonResponse(res, { "status": "ok", "response": { "valid": "0", "error": "We're very sorry, but your responses have not been handled correctly. Please try again, or contact us on Facebook / by phone." } });
            return;
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
                if (friendlyName != "") {
                    utils.getPeopleForInvite(inviteCode, function (people) {
                        console.log("Rendering RSVP with: " + util.inspect(people, false, null));
                        res.render("rsvp", { "inviteCode": inviteCode, "friendlyName": friendlyName, "people": people });
                    });
                } else {
                    res.render("invite");
                }
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
