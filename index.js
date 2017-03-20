/*
  @author Nils Whitmont <nils.whitmont@gmail.com>

  @summary A brief Node solution to Project Euler Problem 54
  @url https://projecteuler.net/problem=54
*/

var fs = require('fs');
var byline = require('byline');
var async = require('async');
var poker = require('poker-hands');
// enable enhanced dubug logs here
var DEBUG = false;

function rankAllPokerHands(done) {
  var player1Wins = 0;
  var player2Wins = 0;

  var pokerHands = fs.createReadStream('all-hands.txt');
  pokerHands = byline.createStream(pokerHands);

  pokerHands.on('readable', function() {
    var line;
    while (null !== (line = pokerHands.read())) {
      var currentHand = line.toString()
      var player1 = currentHand.slice(0,14);
      if(DEBUG) console.log('Player 1: ' + player1);

      var player2 = currentHand.slice(-14)
      if(DEBUG) console.log('Player 2: ' + player2);

      var winner = poker.judgeWinner([player1, player2]);

      if (winner === 0) {
        // player1 wins
        if(DEBUG) console.log('Player 1 Wins!!');
        player1Wins += 1;
      } else {
        // player2 Wins
        if(DEBUG) console.log('Player 2 Wins!!');
        player2Wins += 1;
      }
    }
  });

  pokerHands.on('end', function() {
    if(DEBUG) console.log('done reading stream data');
    var totalWins = {
      player1: player1Wins,
      player2: player2Wins
    }
    done(null, totalWins);
  })
}

function displayEndMessage(wins, done) {
  if(DEBUG) console.log(wins);
  // how many hands did player1 win?
  console.log('\nPlayer 1 won a total of ' + wins.player1 + ' hands.\n');

  // show final winner message
  if(wins.player1 > wins.player2) {
    console.log('Player 1 wins BIG TIME with a total of ' + wins.player1 + ' winning hands!\n');
  } else if(wins.player2 > wins.player2) {
    console.log('Player 2 wins BIG TIME with a total of ' + wins.player2 + ' winning hands!\n');
  } else if(wins.player1 === wins.player2) {
    console.log('Both players won an equal number of hands.\n');
  }
}

// run tasks in series
async.waterfall([
  rankAllPokerHands,
  displayEndMessage
]);
