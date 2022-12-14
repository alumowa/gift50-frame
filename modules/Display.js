const SH1106 = require("SH1106");
const I2CDevice = require("I2CDevice");

const images = require("images");

class Display extends I2CDevice {
  constructor(bus, address) {
    super(bus, address);

    this.ready = false;
    this.animatingHearts = false;
    this.heartInterval = null;

    //hearts.bmp data
    this.bmp_hearts = {
      width: 64,
      height: 64,
      bpp: 1,
      buffer: atob(
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAQAAAAAAf8Af8AAAAAH/4H/4AAAAA//w//wAAAAD//j//gAAAAf//f/+AAAAB//9//8AAAAH/////wAAAAf/////AAAAB/////8AAAAH/////wAAAAf/////AAAAB/////8AAAAH/////gAAAAP////+AAAAA/////4AAAAB/////AAAAAH////4AAAAAP////gAAAAAf///8AAAAAB////gAAAAAD///+AAAAAAH///wAAAAAAP//+AAAAAAA///wAAAAAAB///A/AfgAAD//4H/D/gAAH//A/+f+AAAf/4H/7/8AAA//gf///wAAB/8B////AAAH/gH///8AAAP+Af///wAAAfwB////AAAB/AH///8AAAD4AP///gAAAPgA///+AAAAcAB///wAAABwAD///AAAAGAAH//4AAAAIAAf//AAAAAAAA//4AAAAAAAB//gAAAAAAAD/8AAAAAAAAP/gAAAAAAAAf8AAAAAAAAA/wAAAAAAAAD+AAAAAAAAAH4AAAAAAAAAfAAAAAAAAAA4AAAAAAAAADgAAAAAAAAAGAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
      ),
    };
  }

  connect() {
    this.display = SH1106.connect(
      this.conn.bus,
      () => {
        //Do one time setup
        this.display.setFontVector(12);
        this.display.setColor(1, 1, 1);
        this.display.clear();
        this.display.flip();

        //Save off some vars
        this.mid = {
          x: this.display.getWidth() / 2,
          y: this.display.getHeight() / 2,
        };

        this.ready = true;
        this.emit("ready", this.display);
      },
      { address: this.conn.address, contrast: 255 }
    );
  }

  write(message) {
    //Make sure we exit heart animation
    //when drawing strings
    if (this.animatingHearts) {
      this.stopHearts();
    }

    this.display.clear();

    //Use wrapString call to break up long text
    this.display.drawString(
      this.display.wrapString(message, this.display.getWidth()).join("\n")
    );
    this.display.flip();
  }

  drawQr(imageData) {
    //Make sure we exit heart animation
    //when drawing images
    if (this.animatingHearts) {
      this.stopHearts();
    }

    this.display.clear();

    const image = {
      width: 64,
      height: 64,
      bpp: 1,
      buffer: atob(imageData),
    };

    this.display.drawImage(
      image,
      this.mid.x - image.width / 2,
      this.mid.y - image.height / 2
    );

    this.display.flip();
  }

  /**
   * Enter heart animation mode
   */
  startHearts() {
    //If already running just bail
    if (this.animatingHearts) {
      return;
    }

    const updateMs = 250;
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
    if (!this.animatingHearts) {
      return;
    }

    //Calculate a scale to make things less boring but
    //we also have to use this value below when calculating
    //the drawable area. Lock range between min = 0.3 - 1.0
    const min = 0.3;
    const scale = min + (1 - min) * Math.random();
    const image = this.bmp_hearts;

    this.display.clear();
    this.display.drawImage(
      image,
      Math.random() * (this.display.getWidth() - image.width * scale),
      Math.random() * (this.display.getHeight() - image.height * scale),
      { scale: scale }
    );
    this.display.flip();
  }
}

exports = Display;
