console.log('js sourced');

$(document).ready(readyNow);

function readyNow() {
    //event handlers
    $('#startButton').on('click', start);
    $('#submitButton').on('click', playGame);
    $('#cancelButton').on('click', cancelGame);
    $('body').on('click', '#gameRestart', cancelGame)
    
}

var maximus = 0;
function randomNum(min, max) {
    //var x = Math.floor(Math.random() * (1 + max - min) + min);
    return String(Math.floor(Math.random() * (max - min) + min))
    //creturn x;
}

//get hints from the server
function getHints(){
    $.ajax({
        type: 'GET',
        url: '/game'
    })
    .done(function(response) {
        var allGuesses = response;
        appendHints(allGuesses);

        console.log('allguesses', allGuesses);
        
    })
}
//appends hints to the DOM
function appendHints(array) {
    var player1hint = array[array.length - 5];
    var player2hint = array[array.length - 4];
    var player3hint = array[array.length - 3];
    var player4hint = array[array.length - 2];
    var deepBluehint = array[array.length - 1];

    //Add player hints "higher" or "lower"
    $('#deepBlue').text(DB);
    $('#player1hint').text(player1hint);
    $('#player2hint').text(player2hint);
    $('#player3hint').text(player3hint);
    $('#player4hint').text(player4hint);
    $('#deepBlueHint').text(deepBluehint);

    //Clear out input values on click
    $('#player1').val('');
    $('#player2').val('');
    $('#player3').val('');
    $('#player4').val('');

    //If statement to determine whether there is a winner, then create winner message
    if (player1hint === 'winner') {
        $('body').empty();
        console.log('player 1 wins');
        $('body').append('<div id="winner"><h1>Player 1 Wins!!!!</h1><button id="gameRestart">Restart the Game</button></div>')
    }
    else if (player2hint === 'winner') {
        $('body').empty();
        console.log('player 2 wins');
        $('body').append('<div id="winner"><h1>Player 2 Wins!!!!</h1><button id="gameRestart">Restart the Game</button></div>')
        
    }
    else if (player3hint === 'winner'){
        $('body').empty();
        console.log('player 3 wins');
        $('body').append('<div id="winner"><h1>Player 3 Wins!!!!</h1><button id="gameRestart">Restart the Game</button></div>')
        
    }
    else if (player4hint === 'winner') {
        $('body').empty();
        console.log('player 4 wins');
        $('body').append('<div id="winner"><h1>Player 4 Wins!!!!</h1><button id="gameRestart">Restart the Game</button></div>')
        
    }
    else if (deepBluehint === 'winner') {
        $('body').empty();
        console.log('deep blue wins');
        $('body').append('<div id="winner"><h1>DEEP BLUE thrashed u scrubs!!!!!!</h1><button id="gameRestart">Restart the Game</button></div>')
    }
}

var numberOfRounds = 0; //var for round counts
var DB = '';

function playGame(event) { //submits guesses to server
    console.log('playing game');
    event.preventDefault();
    var p1 = $('#player1').val();
    var p2 = $('#player2').val();
    var p3 = $('#player3').val();
    var p4 = $('#player4').val();
    var deepBlue = randomNum(0, maximus);
    console.log('array of guesses', p1, p2, p3, p4);
    DB = deepBlue;
    var arrOfGuesses = [p1, p2, p3, p4, deepBlue];

    for(var i = 0; i < arrOfGuesses.length - 1; i += 1){
        var number = arrOfGuesses[i];
        for(var j = i + 1; j < arrOfGuesses.length - 1; j += 1){
            var number2 = arrOfGuesses[j];
            if(number === number2){
                alert('You may not select the same number');
                return
            }
        }
    };

    $.ajax({
        method: 'POST',
        url: '/game',
        data: {guesses: arrOfGuesses}
    })
    .done(function(response){
        console.log('Success', response);
        getHints();
        numberOfRounds ++;
        $('#roundsTotal').text(numberOfRounds); //appends total guess to DOM
    })
    .fail(function(message){
        console.log(message)
    })
}

//Starts Play Mode
function start(event) { 
    console.log('button clicked');

    if($('.numberSelector:checked').val()){ 
        console.log('exists')  

    $('#playmode').toggleClass('hide');
    $('#setup').toggleClass('hide');
    event.preventDefault();
    var maxNumber = $('.numberSelector:checked').val();
    maximus = maxNumber;

    $.ajax({
        method: 'POST',
        url: '/setup',
        data: {maxNumber: maxNumber}
    })
    .done(function(response){
        console.log('Success',response);
        $('#max').text(maxNumber);
    })
    .fail(function(message){
        console.log(message);
    })
}else{
    alert('Select a value') 
}
}

//Cancels the Game
function cancelGame(){
    console.log('cancel clicked');
    $.ajax({
        method: 'POST',
        url: '/cancel',
        data: { }
    })
    .done(function(response){
        console.log('success', response);
        location.reload();
    })
    .fail(function(message){
        console.log('message', message);
    })
}
