var express = require("express");
var app = express();
app.set('view engine', 'ejs')
var utils = require("./utils");
var router = express.Router();
var path = __dirname + '/views/';
// MUST ENABLED THIS PORT NUMBER TO WORK IN AZURE!
var portno = process.env.PORT;
//var portno = 3000;


router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

require("./invite")(app);

router.get("/", function (req, res) {
    res.redirect("/invite");
  //console.log("Providing "+path+"index.html");
  //res.sendFile(path + "index.html");
});

router.get("/dev/",function(req,res){
  console.log("Development Request Received");
  res.send("Vars:"+process.env.MYSQLCONNSTR_localdb);
});

app.use("/",router);

app.use(express.static('views'))

app.use("*",function(req,res){
  console.log("Providing "+path+"404.html");
  res.sendFile(path + "404.html");
});

app.listen(portno,function(){
  console.log("App up! Live at Port"+process.env.PORT);
});
