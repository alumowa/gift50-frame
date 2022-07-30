/**
 * Time/event generator
 */

class EventGenerator {

    constructor(tickRateMs) {

        //Remember boot time
        this.bootTime = Date.now();
        this.tickCount = 0; 
        this.eventInterval = setInterval(this.onTick.bind(this), tickRateMs);

        this.TYPES = {
            DAILY: 0,
            RANDOM: 1,
            HEARTS: 2,
            QR: 3
        };

        //Convert tickRateMs into time intervals
        //(hourly, daily) to generate those events as well.        
        this.ticksPerHour = Math.ceil((1000 * 60 * 60) / tickRateMs);
        this.ticksPerDay = 24 * this.ticksPerHour;
    }

    /**
     * Called every tickRateMs
     */
    onTick() {

        const now = Date.now();
        this.tickCount++; //overflow not a real issue here

        //Get random event and emit tick event
        const event = this.randomEvent();
        this.emit('tick', event);

        //Emit hourly and daily ticks if necessary
        if((this.tickCount % this.ticksPerHour) === 0){
            this.emit('hour-tick', now);
        }

        if((this.tickCount % this.ticksPerHour) === 0){
            this.emit('day-tick', now);
        }        
    }

    /**
     * Generate a random event used for display rendering
     * 45% chance to display daily text
     * 25% chance to display a random text pair
     * 15% chance to render hearts
     * 15% chance to render qr
     */
    randomEvent() {

        const rand = Math.random();        
        const events = [
            { type: this.TYPES.DAILY, odds: 0.45 },
            { type: this.TYPES.RANDOM, odds: 0.25 },
            { type: this.TYPES.HEARTS, odds: 0.15 },
            { type: this.TYPES.QR, odds: 0.15 }
        ];


        const candidate = events.reduce((acc, val) => {

            //If we already have a matched event, just return
            //the accumulator
            if(acc.event !== null){
                return acc;
            }

            //Otherwise we check if rand falls in the odds range,
            //if so, attach event type to accumulator.
            if(rand <= (acc.odds + val.odds)){
                acc.event = val.type;
            }

            //Accumulate total odds and return accumulator
            acc.odds+= val.odds;
            return acc;
        }, { odds: 0, event: null });
        
        return candidate.event;        
    }
}

exports = EventGenerator;