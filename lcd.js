var five = require('johnny-five');
var board = new five.Board();

board.on("ready", function(){
  // Parallel LCD
  var lcd = new five.LCD({
    pins: [12, 11, 5, 4, 3, 2]
  });


  lcd.autoscroll().print("Congratulations you scored ");
});
