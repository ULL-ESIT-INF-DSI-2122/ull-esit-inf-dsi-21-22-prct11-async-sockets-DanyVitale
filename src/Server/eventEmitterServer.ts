/**
 * Import the EventEmitter class from the events module
 */
import {EventEmitter} from "events";

/**
 * @class EventEmitterServer
 * @extends EventEmitter
 * @description EventEmitterServer class describes the server that will be used to emit events.
 */
export class EventEmitterServer extends EventEmitter {
    /**
     * Constructor describes the server that will be used to emit events.
     * @param connect - the connection object
     */
    constructor(connect: EventEmitter) {
        super();

        /**
         * wholeMessage - the message that is received from the client
         */
        let wholeMessage: string = '';
        
        connect.on('data', (data) => {
            wholeMessage += data.toString();

            let limit = wholeMessage.indexOf('\n');
            while (limit !== -1) {
                const message = wholeMessage.substring(0, limit);
                wholeMessage = wholeMessage.substring(limit + 1);
                
                limit = wholeMessage.indexOf('\n');
                this.emit('request', JSON.parse(message));
            }
        });
    }
}