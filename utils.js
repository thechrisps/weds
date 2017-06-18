module.exports = {
	getDatabaseDefinition: function () {
		var connectionString = process.env.MYSQLCONNSTR_localdb;
		console.log(connectionString);
		var dataSourceRE = /.*Data Source=(.+?);.*/g;
		var databaseRE = /.*Database=(.+?);.*/g;
		var useRE = /.*User Id=(.+?);.*/g;
		var passwordRE = /.*Password=(.+?);.*/g;

		var dataSourceArr = dataSourceRE.exec(connectionString)[1];
		var databaseArr = databaseRE.exec(connectionString)[1];
		var userArr = useRE.exec(connectionString)[1];
		var passwordArr = passwordRE.exec(connectionString)[1];

		return [dataSourceArr, databaseArr, userArr, passwordArr];
	}
};
