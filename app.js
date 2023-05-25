//Mailchimp api key
// 659581de7ff577aa67417d1cfa7adbbd-us9
//List Id
//0abe4ecd8f

const express = require("express");

const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){

  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.mail;


  var data = {
    members:[ {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  var jsondata = JSON.stringify(data);

  const url = `https://us9.api.mailchimp.com/3.0/lists/${process.env.LIST_ID}`;

  const options = {
    method: "POST",
    body: data,
    auth: process.env.API_KEY
  };


  const request = https.request(url, options, function(response){

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname+"/failure.html");
    }



  });

  request.write(jsondata);
  request.end();



});

app.post("/failure", function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("You are now live");
});