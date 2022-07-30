/**
 * Base I2C class to hold i2c
 * connection data
 */

class I2CDevice {
  constructor(bus, address) {
    this.conn = {
      bus: bus,
      address: address,
    };
  }
}

exports = I2CDevice;
