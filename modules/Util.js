class Util {
  static DaysSinceBoot(bootTime) {
    //Returning minutes for now
    return Math.round((Date.now() - bootTime) / (60 * 1000));
  }
}

exports = Util;
