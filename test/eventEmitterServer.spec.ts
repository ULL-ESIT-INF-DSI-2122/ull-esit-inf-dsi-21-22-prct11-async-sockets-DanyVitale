import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
import {EventEmitterServer} from '../src/Server/eventEmitterServer';

describe('EventEmitterServer class - tests', () => {
    const socket = new EventEmitter();
    const server = new EventEmitterServer(socket);

    it('EventEmitterServer should be an instance of EventEmitterServer', () => {
        expect(server).to.be.an.instanceof(EventEmitterServer);
    });

    it('EventEmitterServer should exists', () => {
        expect(EventEmitterServer).to.exist;
    });

    it('EventEmitterServer should emit a message', (done) => {
        let message = '';
        server.on('request', (data) => {
            const message = {
                "type": "add",
                "user": "Daniele",
                "title": "titulo1",
                "body": "cuerpo",
                "color": "red"
            }
            expect(data).to.deep.equal(message);
            done();
        });
        socket.emit('data', '{"type": "add", "user": "Daniele"');
        socket.emit('data', ', "title": "titulo1", "body": "cuerpo"');
        socket.emit('data', ', "color": "red"}');
        socket.emit('data', '\n');
    });

    
});
