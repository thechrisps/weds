var mysql = require('mysql');
var nodemailer = require('nodemailer');

module.exports = {
	getDatabaseDefinition: function () {
		var connectionString = process.env.MYSQLCONNSTR_localdb;
		//console.log(connectionString);
		var dataSourceRE = /.*Data Source=(.+?);.*/g;
		var databaseRE = /.*Database=(.+?);.*/g;
		var useRE = /.*User Id=(.+?);.*/g;
		var passwordRE = /.*Password=(.+?)$/g;

		var dataSourceArr = dataSourceRE.exec(connectionString)[1];
		var databaseArr = databaseRE.exec(connectionString)[1];
		var userArr = useRE.exec(connectionString)[1];
		var passwordArr = passwordRE.exec(connectionString)[1];

		return [dataSourceArr, databaseArr, userArr, passwordArr];
	},
	dispatchJsonResponse: function (res, jsonContent) {
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(jsonContent));
    },
    checkInvite: function (inviteCode, responseCb) {
        var databaseDetails = module.exports.getDatabaseDefinition();
        console.log("Host: " + databaseDetails[0].split(":")[0]);
        console.log("Port: " + databaseDetails[0].split(":")[1]);
        console.log("User: " + databaseDetails[2]);
        console.log("DB: " + databaseDetails[1]);

        var con = mysql.createConnection({
            host: databaseDetails[0].split(":")[0],
            port: databaseDetails[0].split(":")[1],
            user: databaseDetails[2],
            password: databaseDetails[3],
            database: databaseDetails[1]
        });

        con.connect(function (err) {
            if (err) throw err;
            con.query("SELECT * FROM invites WHERE inviteId = " + mysql.escape(inviteCode), function (err, result, fields) {
                if (err) throw err;
                console.log(result);

                console.log("Results found for " + inviteCode + ": " + result.length);

                if (result.length > 0) {
                    result.forEach(function (value) {
                        responseCb(value["welcomeName"]);
                        return;
                    });
                } else {
                    responseCb("");
                    return;
                }
            });
        });
    },
    registerEmail: function (inviteCode, email) {
        var databaseDetails = module.exports.getDatabaseDefinition();

        var con = mysql.createConnection({
            host: databaseDetails[0].split(":")[0],
            port: databaseDetails[0].split(":")[1],
            user: databaseDetails[2],
            password: databaseDetails[3],
            database: databaseDetails[1]
        });

        con.connect(function (err) {
            if (err) throw err;
            con.query("UPDATE invites SET contactEmail = "+mysql.escape(email)+" WHERE inviteId = " + mysql.escape(inviteCode), function (err, result) {
                if (err) throw err;
                console.log(result);

                return result.affectedRows;
            });
        });
    },
    getPeopleForInvite: function (inviteCode, responseCb) {
        var databaseDetails = module.exports.getDatabaseDefinition();
        console.log("Host: " + databaseDetails[0].split(":")[0]);
        console.log("Port: " + databaseDetails[0].split(":")[1]);
        console.log("User: " + databaseDetails[2]);
        console.log("DB: " + databaseDetails[1]);

        var con = mysql.createConnection({
            host: databaseDetails[0].split(":")[0],
            port: databaseDetails[0].split(":")[1],
            user: databaseDetails[2],
            password: databaseDetails[3],
            database: databaseDetails[1]
        });

        con.connect(function (err) {
            if (err) throw err;
            con.query("SELECT * FROM people WHERE invite = " + mysql.escape(inviteCode), function (err, result, fields) {
                if (err) throw err;
                console.log(result);

                console.log("People found for " + inviteCode + ": " + result.length);

                if (result.length > 0) {
                    var people = [];
                    var person = 0;
                    console.log("Entered people enumeration");
                    for (var i = 0; i < result.length; i++) {
                        console.log("Retreived person " + result[i].id + " on invite " + result[i].invite + " == ceremony: " + result[i].attendCeremony + ", reception: " + result[i].attendReception + ", evening: " + result[i].attendEvening + ", requirements: " + result[i].requirements);
                        thisPerson = { "id": result[i].id, "invite": result[i].invite, "name": result[i].name, "ceremony": result[i].attendCeremony, "reception": result[i].attendReception, "evening": result[i].attendEvening, "requirements": result[i].requirements };
                        people[person] = thisPerson;
                        person++;
                    }
                    responseCb(people);
                } else {
                    console.log("Returning blank response");
                    responseCb("");
                    return;
                }
            });
        });
    },
    updateRSVP: function (inviteCode, personId, ceremony, reception, evening, requirements, responseCb) {
        var databaseDetails = module.exports.getDatabaseDefinition();

        var con = mysql.createConnection({
            host: databaseDetails[0].split(":")[0],
            port: databaseDetails[0].split(":")[1],
            user: databaseDetails[2],
            password: databaseDetails[3],
            database: databaseDetails[1]
        });

        con.connect(function (err) {
            if (err) {
                console.log("DB Error on connection: " + err);
                return "Error";
            }
            queryString = "UPDATE people SET attendCeremony = " + ceremony + ", attendReception = " + reception + ", attendEvening = " + evening + ", requirements = " + mysql.escape(requirements) + " WHERE id = " + personId;
            console.log("Running RSVP Save: " + queryString);
            con.query(queryString, function (err, result) {
                
                if (err) {
                    console.log("DB Error on query: " + err);
                    responseCb("Error");
                }
                console.log(result);
                console.log("Rows affected: " + result.affectedRows);
                
                responseCb(result.affectedRows);
            });
        });
    },
    sendEmail: function (inviteCode, personId, ceremony, reception, evening, requirements, responseCb) {
        var databaseDetails = module.exports.getDatabaseDefinition();

        var con = mysql.createConnection({
            host: databaseDetails[0].split(":")[0],
            port: databaseDetails[0].split(":")[1],
            user: databaseDetails[2],
            password: databaseDetails[3],
            database: databaseDetails[1]
        });

        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'chrisps@gmail.com', // Your email id
                pass: 'password' // Your password
            }
        });
    }
};
