/**
 * Time/event generator
 */

class EventGenerator {
  constructor(tickRateMs) {
    //Remember boot time
    this.bootTime = Date.now();
    this.running = false;
    this.tickCount = 0;
    this.eventInterval;
    this.tickRateMs = tickRateMs;

    //Convert tickRateMs into time intervals
    //(hourly, daily) to generate those events as well.
    this.ticksPerHour = Math.ceil((1000 * 60 * 60) / tickRateMs);
    this.ticksPerDay = 24 * this.ticksPerHour;
  }

  /**
   * Starts event tick interval
   */
  startTick() {
    this.running = true;
    this.eventInterval = setInterval(this.onTick.bind(this), this.tickRateMs);

    //Kick off the first one
    this.onTick();
  }

  /**
   * Stops event tick interval
   */
  stopTick() {
    this.running = false;
    clearInterval(this.eventInterval);
  }

  /**
   * Called every tickRateMs
   */
  onTick() {
    if (!this.running) {
      return;
    }
    const now = new Date();
    this.tickCount++; //overflow not a real issue here

    //Emit tick evens
    this.emit("tick", now);

    //Emit hourly and daily ticks if necessary
    if (this.tickCount % this.ticksPerHour === 0) {
      this.emit("hour-tick", now);
    }

    if (this.tickCount % this.ticksPerHour === 0) {
      this.emit("day-tick", now);
    }
  }
}

exports = EventGenerator;
