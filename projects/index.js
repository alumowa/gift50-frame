const EventGenerator = require('EventGenerator');
const Util = require('Util');
const Display = require('Display');
const images = require('images');

const TickRateMS = 500;
const BootTime = Date.now();

function onDisplayReady(){

  console.log('display connected: ' + Date.now());

  // kristina.startHearts();
}

//Init i2c buses
I2C1.setup({ scl: D32, sda: D33 });

//Initialize displays
const kristina = new Display(I2C1, 0x3C);
kristina.on('ready', onDisplayReady);
kristina.connect();



//Initialize clock & configure event probabilities
const events = new EventGenerator(TickRateMS);
events.on('tick', (event) => {

  // console.log(`Minutes since boot ${EventGenerator.DaysSinceBoot(BootTime)}`);

  switch(event){
    case events.TYPES.DAILY:
      kristina.write('Show daily message');
      break;
    case events.TYPES.RANDOM:
      kristina.write('Show random message');
      break;
    case events.TYPES.HEARTS:
      kristina.write('Show hearts');
      break;
    case events.TYPES.QR:
      kristina.write('Show QR');
      break;
  }
});