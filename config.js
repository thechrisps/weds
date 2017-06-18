var config = {}

 config.host = process.env.DB_HOST
 config.authKey = process.env.DB_KEY
 config.databaseId = "weds";
 config.collectionId = "wedsInvites";

 module.exports = config;
