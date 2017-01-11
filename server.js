var express = require('express');
var unirest = require('unirest');
var app = express();
app.use(express.static('public'));
// unirest.get("https://videogamesrating.p.mashape.com/get.php?count=5&game=kingdom+hearts")
// .header("X-Mashape-Key", "WSWRlNjNUEmshRZyglgBobs9R6Uop1a9fC8jsnUZaFZwRpGFgX")
// .header("Accept", "application/json")
// .end(function (result) {
//   console.log(result.status, result.headers, result.body);
// });
// var getFromApi = function (endpoint, args) {
//     var emitter = new events.EventEmitter();
//     unirest.get('https://api.spotify.com/v1/' + endpoint)
//         .qs(args)
//         //after api call we get the response inside the "response" parameter
//         .end(function (response) {
//             //success scenario
//             if (response.ok) {
//                 emitter.emit('end', response.body);
//             }
//             //failure scenario
//             else {
//                 emitter.emit('error', response.code);
//             }
//         });
//     return emitter;
// };
app.listen(process.env.PORT || 8080);