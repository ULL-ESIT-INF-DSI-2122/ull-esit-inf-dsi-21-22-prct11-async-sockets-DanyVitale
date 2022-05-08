import {EventEmitter} from "events";

/**
 * @class EventEmitterClient
 * @extends EventEmitter
 * @description EventEmitterClient class describes the client that will be used to emit events.
 */
export class EventEmitterClient extends EventEmitter {
    constructor(connect: EventEmitter) {
        super();
        let wholeMessage: string = '';
        connect.on('data', (data) => {
            wholeMessage += data.toString();
            let limit = wholeMessage.indexOf('\n');
            while (limit !== -1) {
                const message = wholeMessage.substring(0, limit);
                wholeMessage = wholeMessage.substring(limit + 1);
                this.emit('request', JSON.parse(message));
            }
        });
    }
}
