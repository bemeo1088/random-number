var express = require('express');
var app = express();
var port = 5000;
var bodyParser = require('body-parser');
var randomNum = require('./modules/randomNumber.js');
var ran = 0;

// use body parser
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from public directory
app.use(express.static('server/public'));

app.post('/setup', function(req, res){
    var maxNum = req.body;
    console.log(maxNum);
    var random = randomNum(0, maxNum.maxNumber);
    console.log(String(random));
    res.sendStatus(200);
    ran = random;

})
var guessResponses = []; //array to send back to client side
app.post('/game', function(req, res){
    console.log(req.body.guesses);
    var allGuesses = req.body.guesses;

    for (var i = 0; i < allGuesses.length; i++) {
        var eachGuess = parseInt(allGuesses[i]);
        if (eachGuess == ran) {
            guessResponses.push('winner');
        }
        else if (eachGuess > ran) {
            guessResponses.push('lower');
        }
        else {
            guessResponses.push('higher');
        }
    }
    console.log(guessResponses);
    res.sendStatus(200);
})

app.post('/cancel', function(req, res){
    guessResponses = [];
    res.sendStatus(200);
})

app.get('/game', function(req, res){
    res.send(guessResponses)
})

app.listen(port, function () {
    console.log('listening on port, ', port);
});