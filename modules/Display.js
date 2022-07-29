const SH1106 = require('SH1106');
const I2CDevice = require('I2CDevice');

const images = require('images');


class Display extends I2CDevice {

    constructor(bus, address) {

        super(bus, address);
        
        this.ready = false;
        this.animatingHearts = false;
        this.heartInterval = null;
    }

    connect() {

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
            this.emit('ready', this.display);
        }, { address: this.conn.address, contrast: 255 });        
    }

    write(message) {

        //Make sure we exit heart animation
        //when drawing strings
        if(this.animatingHearts) {
            this.stopHearts();
        }
        
        this.display.clear();
        this.display.drawString(message);        
        this.display.flip();
    }

    draw(image) {

        //Make sure we exit heart animation
        //when drawing images
        if(this.animatingHearts) {
            this.stopHearts();
        }

        this.display.clear();
        this.display.drawImage(image, 
            this.mid.x - (image.width / 2), 
            this.mid.y - (image.height / 2));

        this.display.flip();
    }

    /**
     * Enter heart animation mode
     */
    startHearts() {

        //If already running just bail
        if(this.animatingHearts){
            return;
        }

        const updateMs = 500;
        this.heartInterval = setInterval(this.renderHearts.bind(this), updateMs);
        this.animatingHearts = true;
    }

    /**
     * Stops heart animation
     */
    stopHearts() {
        
        this.animatingHearts = false;
        clearInterval(this.heartInterval);
    }

    /**
     * Randomly render hearts bitmap on the screen
     */
    renderHearts() {

        //Bail out if we are no longer in animating mode
        if(!this.animatingHearts){
            return;
        }

        const image = images.hearts;

        //Calculate a scale to make things less boring but
        //we also have to use this value below when calculating
        //the drawable area. Lock range between 0.3 - 1.0
        const scale = 0.3 + ((1 - 0.3) * Math.random());

        this.display.clear();
        this.display.drawImage(image, 
            Math.random() * (this.display.getWidth() - (image.width * scale)), 
            Math.random() * (this.display.getHeight() - (image.height * scale)),
            { scale: scale });
        this.display.flip();        
    }
}


exports = Display;