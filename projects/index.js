const Display = require('Display');
const images = require('images');


function onDisplayConnect(){

  console.log('display connected');

  // christina.write('Was zum Henker?! \nNur noch 50 Tage bis \nzur Hochzeit?');
  kristina.qr(images.hearts);
}

//Init i2c buses
I2C1.setup({ scl: D32 ,sda: D33 });
const kristina = new Display(I2C1, 0x3C);
kristina.connect(onDisplayConnect);