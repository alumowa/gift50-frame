/**
 * Time/event generator
 */

class EventGenerator {

    constructor(tickRateMs) {

        //Remember boot time
        this.bootTime = Date.now();        
        this.eventInterval = setInterval(this.onEvent.bind(this), tickRateMs);

        this.TYPES = {
            DAILY: 0,
            RANDOM: 1,
            HEARTS: 2,
            QR: 3
        };
    }


    onEvent() {

        const now = Date.now();
        const rand = Math.random();
        
        /**
         * 45% chance to display daily text
         * 25% chance to display a random text pair
         * 15% chance to render hearts
         * 15% chance to render qr
         */
        const events = [
            { type: this.TYPES.DAILY, odds: 0.45 },
            { type: this.TYPES.RANDOM, odds: 0.25 },
            { type: this.TYPES.HEARTS, odds: 0.15 },
            { type: this.TYPES.QR, odds: 0.15 }
        ];
        const event = events.reduce((acc, val) => {

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

            //Accumulate total odds
            acc.odds+= val.odds;

            return acc;
        }, { odds: 0, event: null });
        
        //Emit event candidate
        this.emit('tick', event.event);
    }
}

exports = EventGenerator;