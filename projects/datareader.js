const Storage = require('Storage');
const Display = require('Display');

I2C1.setup({ scl: D32, sda: D33 });
I2C2.setup({ scl: D26, sda: D27 });

//Initialize displays
const kristina = new Display(I2C1, 0x3C);
kristina.connect();

const phillip = new Display(I2C2, 0x3C);
phillip.connect();

const max = 3;
let index = 1;

//Use a switch to increment iterating index
//GPIO pin setup
D12.mode('input');
function onPress(event) {

    index++;
    if(index > max) index = 1;

    console.log(index);
    const data = Storage.readJSON(`${index}.json`);

    kristina.write(data.k);
    phillip.write(data.p);
}

setWatch(onPress, D12, { repeat: true, edge: 'falling', debounce: 50 });
