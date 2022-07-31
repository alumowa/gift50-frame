const EventGenerator = require("EventGenerator");
const Display = require("Display");
const Storage = require("Storage");
const Network = require("Network");
const Util = require("Util");

class Core {
  constructor(tickRateMs) {
    this.bootTime = Date.now();
    this.weddingTime = 1664488800000; //Set to 30/9/2022
    this.displays = {};
    this.network;

    this.EVENT = {
      DAILY: 0,
      RANDOM: 1,
      HEARTS: 2,
      QR: 3,
    };

    E.setTimeZone(2); //Timezone set to CEET (+2)

    //Initialize event tick generator
    this.eventGenerator = new EventGenerator(tickRateMs);
    this.eventGenerator.on("tick", this.onTick.bind(this));

    //Wifi setup
    const credentials = Storage.readJSON("wifi_credentials.json");
    this.network = new Network(credentials.ssid, credentials.password);
  }

  //Configure pins for an i2c bus
  i2cSetup(i2cBus, scl, sda) {
    i2cBus.setup({ scl: scl, sda: sda });
  }

  //Associates a display to an i2c bus and sets address
  addDisplay(name, bus, address) {
    const display = new Display(bus, address);

    //This .connect call is async but we can go ahead with setup
    display.connect();
    this.displays[name] = display;
    return display;
  }

  //Connects to network to attempt a system time update and
  //starts the event generator
  start() {
    console.log("Core starting...");
    this.network.on("ready", () => {
      //Once network is connected, we can start our
      //event generator.
      this.eventGenerator.startTick();
    });
    this.network.start();
  }

  onTick(now) {
    // console.log(`Minutes since boot ${EventGenerator.DaysSinceBoot(BootTime)}`);
    const p = process.memory(false);
    console.log(`${now.toString()}: ${JSON.stringify(p)}`);

    const event = this.getRandomEvent();

    switch (event) {
      case this.EVENT.DAILY:
        this.renderDaily();
        break;

      case this.EVENT.RANDOM:
        this.renderRandom();
        break;

      case this.EVENT.HEARTS:
        this.renderHearts();
        break;

      case this.EVENT.QR:
        this.renderQr();
        break;
        qr;
    }
  }

  /**
   * Generate a random event used for display rendering
   * 45% chance to display daily text
   * 25% chance to display a random text pair
   * 15% chance to render hearts
   * 15% chance to render qr
   */
  getRandomEvent() {
    const rand = Math.random();
    const events = [
      { type: this.EVENT.DAILY, odds: 0.4 },
      { type: this.EVENT.RANDOM, odds: 0.2 },
      { type: this.EVENT.HEARTS, odds: 0.2 },
      { type: this.EVENT.QR, odds: 0.2 },
    ];

    const candidate = events.reduce(
      (acc, val) => {
        //If we already have a matched event, just return
        //the accumulator
        if (acc.event !== null) {
          return acc;
        }

        //Otherwise we check if rand falls in the odds range,
        //if so, attach event type to accumulator.
        if (rand <= acc.odds + val.odds) {
          acc.event = val.type;
        }

        //Accumulate total odds and return accumulator
        acc.odds += val.odds;
        return acc;
      },
      { odds: 0, event: null }
    );

    return candidate.event;
  }

  renderDaily() {
    //Calculate days to wedding and pull fetch matching data
    const daysUntil = Math.ceil(
      (this.weddingTime - Date.now()) / (86400 * 1000)
    );
    console.log("days until: " + daysUntil);
    let data;

    //Before Aug 11 show the first daily msg
    //Between aug 11 and Sept 30 do countdown.
    //Between Sept 30 and Oct 4 show final msg
    //After that, randomize daily messages.
    if (daysUntil >= 50) {
      //Display the first conversation any day up to
      //August 11
      data = Storage.readJSON("1.json");
    } else if (daysUntil < 50 && daysUntil >= 0) {
      //Matching countdown text
      data = Storage.readJSON(`${51 - daysUntil}.json`);
    } else if (daysUntil < 0 && daysUntil > -5) {
      //Final text
      data = Storage.readJSON("final.json");
    } else {
      //After Oct 4 just randomize
      Storage.readJSON(
        //Randomly load {1-51}.json
        `${Util.randomIndexInRange(1, 51)}.json`
      );
    }

    //Render to each character
    this.displays.kristina.write(data.k);
    this.displays.phillip.write(data.p);
  }

  renderRandom() {
    const randomText = Storage.readJSON(`random.json`);
    this.displays.kristina.write(
      randomText[Math.floor(Math.random() * randomText.length)]
    );
    this.displays.phillip.write(
      randomText[Math.floor(Math.random() * randomText.length)]
    );
  }

  /**
   * Render a QR on one display while the other
   * displays a random quip.
   */
  renderQr() {
    const staticMsg = "Hatten wir den schon?";
    const qrCount = 20;
    const qrImage = Storage.readJSON(
      `qr${Util.randomIndexInRange(1, qrCount)}.json`
    );
    if (Math.round(Math.random())) {
      this.displays.kristina.drawQr(qrImage.data);
      this.displays.phillip.write(staticMsg);
    } else {
      this.displays.phillip.drawQr(qrImage.data);
      this.displays.kristina.write(staticMsg);
    }
  }

  renderHearts() {
    this.displays.kristina.startHearts();
    this.displays.phillip.startHearts();
  }
}

exports = Core;
