class Util {
  static DaysSinceBoot(bootTime) {
    //Returning minutes for now
    return Math.round((Date.now() - bootTime) / (60 * 1000));
  }

  /**
   * Returns random number from range, both sides
   * inclusive.
   */
  static randomIndexInRange(from, to) {
    const min = Math.ceil(from);
    const max = Math.floor(to);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

exports = Util;
