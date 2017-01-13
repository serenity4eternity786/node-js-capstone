//require external resources
var express = require('express');
var unirest = require('unirest');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var app = express();
app.use(express.static('public'));

//function to make the external API call
var getGame = function(gameName) {
    unirest.get("https://videogamesrating.p.mashape.com/get.php?count=5&game=" + gameName)
        .header("X-Mashape-Key", "WSWRlNjNUEmshRZyglgBobs9R6Uop1a9fC8jsnUZaFZwRpGFgX")
        .header("Accept", "application/json")
        .end(function(result) {
            console.log(result.status, result.headers, result.body);
            //success scenario
            if (result.ok) {
                console.log(result.body);
            }
            //failure scenario
            else {
               console.log(result.status);
            }
        });
   };

//create get endpoint for ajax to access the external API results data
app.get('/search/:gameName', function (req, res) {
    //first API call
    var getGameNames = getGame(req.params.gameName);
        
    //get the data from the first api call
    getGameNames.on('end', function (item) {

        //get the artists and ID for use in next call
        console.log(item);
    });
     getGameNames.on('error', function (code) {
        res.sendStatus(code);
    });

});

//server listener/settings
app.listen(process.env.PORT || 8080);