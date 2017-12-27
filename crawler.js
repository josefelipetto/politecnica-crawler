var request = require('request');
var URL = require('url-parse');
var dotEnv = require('dotenv').config();
var AWS = require('aws-sdk');

AWS.config.update({ 
    accessKeyId: process.env.ACCESS_KEY_ID, 
    secretAccessKey: process.env.SECRET_ACCESS_KEY, 
    region: process.env.AWS_REGION
});

var pageToVisit = "https://politecnica.edupage.org/timetable/?";

console.log('Visited page: ' + pageToVisit);

request(pageToVisit, function(error,response,body){
    if(error) 
    {
        console.log("Error" + error);
    }
    if(response.statusCode === 200)
    {
        if(body.search("The school has not published the timetable yet.") === -1)
        {
            var sns = new AWS.SNS();

            var messageParams = {
                Message: "Horário escolar foi atualizado",
                PhoneNumber:  process.env.PHONE_NUMBER
            };

            sns.publish(messageParams, function(error, data){
                if(error)
                    console.log(err,err.stack);
            });
        }
    }
});



