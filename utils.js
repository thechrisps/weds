var mysql = require('mysql');

module.exports = {
	getDatabaseDefinition: function () {
		var connectionString = process.env.MYSQLCONNSTR_localdb;
		console.log(connectionString);
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

                result.forEach(function (value) {
                    responseCb(value["welcomeName"]);
                    return;
                });
                responseCb("");
                return;
            });
        });
    },
    registerEmail: function (inviteCode, email) {
        var databaseDetails = getDatabaseDefinition();

        var con = mysql.createConnection({
            host: databaseDetails[0],
            user: databaseDetails[2],
            password: databaseDetails[3],
            database: databaseDetails[1]
        });

        con.connect(function (err) {
            if (err) throw err;
            con.query("UPDATE invites SET contactEmail = "+mysql.escape(email)+" WHERE inviteId = " + mysql.escape(inviteCode), function (err, result) {
                if (err) throw err;
                console.log(result);

                return result.affectedRows();
            });
        });
    }
};
