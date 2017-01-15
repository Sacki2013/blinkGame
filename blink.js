// Require JohnnyFive and Create a board
var five = require("johnny-five");
var board = new five.Board();

// Initialize variables
var counter = 0; // Used to restet on last Led and return to start
var score = 0;
var gameOver = false; // Triggers results when true
var level = 600; // Starting speed
var leds = [];

board.on("ready", function() {
  // Initialize Components
  // Create a button at Pin - 8 on the Arduino
  var button = new five.Button(8);
  // Create the ledMatrix at Pins - 5,6,7
  var ledMatrix = new five.Led.Matrix({
        pins: {
          data: 7,
          clock: 5,
          cs: 6
        }
      });

  // Creat Leds and store in ledsArray. Pins - 9,10,11,12,13
  for(var i = 0; i < 5; i++) {
      leds[i] = new five.Led(i + 9);
  }

  // Shutdown the Led Matrix
  ledMatrix.off();

  // Call to start the game, taking in the starting level
  gameStart(level);

  // Listening for the button to be pressed. It will then check if the value of counter is equal to the green
  // led(target). If it is then it will reduce the level value, therefore increasing the speed, and makes a call
  // again to the startGame function. This time when the level is entered it is faster. This will continue
  // until you lose, at which point counter is reset and the scoreLed~() function is started.
  button.on("press", function() {
    clearInterval(ledLoop);
    if(counter == 3) {
      score++;
      if(score < 5) {
        level -= 75;
      } else if(score < 11) {
          level -= 25;
      } else {
          level -= 10;
        }
      gameStart(level);
    } else {
        counter = 0;
        scoreLed(score);
      }
  });

  // Loops through and turns off all Leds. Then using counter it will turn them on in order to form a moving light,
  // If counter is equal to four, therefore you are on the last light, it will reset to 0. The interval is the current
  // level.
  function gameStart(level) {
    ledLoop = setInterval(function(){
      lightsOut();
      leds[counter].on();
      if(counter == 4) {
        counter = 0;
      } else {
          counter++;
      }
    }, level);
  }

  function randBtn() {
    var rand = Math.floor((Math.random() * 5));
    return rand;
  }
  // The score function used the draw function to display the score to the matrix after 3 seconds it will turn off the display. After a further 1 second it will exit the program. Lightout is called at the start to shut down the leds.
  function scoreLed(score) {
    lightsOut();
    ledMatrix.on().draw(score);
    board.wait(3000,function(){
      ledMatrix.off();
      board.wait(1000, function(){
          process.exit();
      });
    });
  }

  // Lights will loop leds and turn them off
  function lightsOut(){
    for(var i = 0; i < leds.length; i++) {
        leds[i].off();
    }
  }
});
