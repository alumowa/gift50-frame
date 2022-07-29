const Display = require('Display');
const images = require('images');


function onDisplayReady(){

  console.log('display connected');

  kristina.startHearts();
}

//Init i2c buses
I2C1.setup({ scl: D32, sda: D33 });

//Initialize displays
const kristina = new Display(I2C1, 0x3C)
kristina.on('ready', onDisplayReady);
kristina.connect();