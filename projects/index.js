const Core = require("Core");

const TICK_RATE_MS = 5 * 60 * 1000;
const core = new Core(TICK_RATE_MS);

//Init i2c buses
core.i2cSetup(I2C1, D32, D33);
core.i2cSetup(I2C2, D26, D27);

//Initialize displays
core.addDisplay("kristina", I2C1, 0x3c);
core.addDisplay("phillip", I2C2, 0x3c);

core.start();
