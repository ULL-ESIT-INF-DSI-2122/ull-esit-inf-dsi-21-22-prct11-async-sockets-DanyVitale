import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
import {EventEmitterClient} from '../src/Client/eventEmitterClient';

describe('EventEmitterClient class - tests', () => {
    const socket = new EventEmitter();
    const client = new EventEmitterClient(socket);

    it('EventEmitterClient should be an instance of EventEmitterClient', () => {
        expect(client).to.be.an.instanceof(EventEmitterClient);
    });

    it('EventEmitterClient should exists', () => {
        expect(EventEmitterClient).to.exist;
    });

    it('EventEmitterClient should emit a message', (done) => {
        client.on('request', (data) => {
            expect(data).to.deep.equal({
                "type": "add",
                "success": true,

            });
            done();
        });
        const message = {
            "type": "add",
            "success": true,
        }
        socket.emit('data', JSON.stringify(message)+'\n');
        socket.emit('data', '\n');
    });
});