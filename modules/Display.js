const SH1106 = require('SH1106');
const I2CDevice = require('I2CDevice');


class Display extends I2CDevice {

    constructor(bus, address) {

        super(bus, address);        
    }

    connect(callback) {

        this.display = SH1106.connect(this.conn.bus, () => {
            
            //Do one time setup
            this.display.setFontVector(12);
            this.display.setColor(1, 1, 1);
            this.display.clear();
            this.display.flip();

            //Save off some vars
            this.mid = {
                x: this.display.getWidth() / 2,
                y: this.display.getHeight() / 2
            };

            this.ready = true;
            console.log('Display ready');

            callback(this.display);
        }, { address: this.conn.address });        
    }

    write(message) {

        this.display.clear();
        this.display.drawString(message);        
        this.display.flip();
    }

    qr(image) {

        this.display.clear();
        this.display.drawImage(image, 
            this.mid.x - (image.width / 2), 
            this.mid.y - (image.height / 2));
            
        this.display.flip();
    }
}


exports = Display;