const Core = require("Core");

// const TICK_RATE_MS = 5 * 60 * 1000;
const TICK_RATE_MS = 1 * 1000;
const core = new Core(TICK_RATE_MS);

//Init i2c buses
core.i2cSetup(I2C1, D32, D33);
core.i2cSetup(I2C2, D26, D27);

//Initialize displays
core.addDisplay("kristina", I2C1, 0x3c);
core.addDisplay("phillip", I2C2, 0x3c);

setInterval(() => {
  //Update time, add day
  const tomorrow = Date.now() / 1000 + 86400;
  setTime(tomorrow);
  console.log("Changing time to " + new Date().toString());

  //Call render daily
  core.renderDaily();
}, 1 * 1000);
