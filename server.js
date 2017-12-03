//require external resources
var express = require('express');
var unirest = require('unirest');
var mongoose = require('mongoose');
var mongodb = require('mongodb');
var config = require('./config');
var events = require('events');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var app = express();
var Wishlist = require('./models/wishlist');
app.use(express.static('public'));
app.use(bodyParser.json());

var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};

if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
};

//function to make the external API call
var getGame = function(gameName) {
    var emitter = new events.EventEmitter();
    unirest.get("https://api-2445582011268.apicast.io/games/meta" + gameName)
        .header("user-key", "87f6016d3ed314ee67c7fe018ccaf324")
        .header("Accept", "application/json")
        // unirest.get("https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name&limit=10&offset=0&order=release_dates.date%3Adesc&search=" + gameName)
        // .header("X-Mashape-Key", "WSWRlNjNUEmshRZyglgBobs9R6Uop1a9fC8jsnUZaFZwRpGFgX")
        // .header("Accept", "application/json")
        .end(function(result) {
            console.log(result.status, result.headers, result.body);
            // unirest.get("https://ahmedakhan-game-review-information-v1.p.mashape.com/api/v1/search?game_name=" + gameName)
            //     .header("X-Mashape-Key", "WSWRlNjNUEmshRZyglgBobs9R6Uop1a9fC8jsnUZaFZwRpGFgX")
            //     .header("Accept", "application/json")
            //     .end(function(result) {
            //         console.log(result.status, result.headers, result.body);

            // unirest.get("https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name&limit=10&offset=0&order=release_dates.date%3Adesc&search=" + gameName)
            //     .header("X-Mashape-Key", "WSWRlNjNUEmshRZyglgBobs9R6Uop1a9fC8jsnUZaFZwRpGFgX")
            //     .header("Accept", "application/json")
            //     .end(function(result) {
            //         console.log(result.status, result.headers, result.body);
            //success scenario
            if (result.ok) {
                emitter.emit('end', result.body);
            }
            //failure scenario
            else {
                //console.log("error line 28");
                emitter.emit('error', result.code);
            }
        });
    return emitter;
};

//create get endpoint for ajax to access the external API results data
app.get('/search/:gameName', function(req, res) {
    //first API call
    var getGameNames = getGame(req.params.gameName);

    //get the data from the first api call
    getGameNames.on('end', function(item) {
        res.json(item);
        //get the artists and ID for use in next call
    });
    getGameNames.on('error', function(code) {
        res.sendStatus(code);
    });

});


app.get('/wishlist', function(req, res) {
    Wishlist.find(function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(200).json(items);
    });
});

app.post('/wishlist/:gameName', function(req, res) {
    Wishlist.create({
        name: req.params.gameName
    }, function(err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(item);
    });
});

app.put('/wishlist/:gameName', function(req, res) {
    Wishlist.find(function(err, items) {
        if (err) {
            return res.status(404).json({
                message: 'Item not found.'
            });
        }
        Wishlist.update({
            _id: req.body.id
        }, {
            $set: {
                name: req.body.name
            }
        }, function() {
            res.status(201).json(items);
        });
    });
});

app.delete('/wishlist/:gameId', function(req, res) {
    Wishlist.findByIdAndRemove(req.params.gameId, function(err, items) {
        if (err)
            return res.status(404).json({
                message: 'Item not found.'
            });

        res.status(201).json(items);
    });
});

app.use('*', function(req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});

//server listener/settings
app.listen(process.env.PORT || 8080);
