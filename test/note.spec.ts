import 'mocha';
import {expect} from 'chai';
import {Note} from '../src/Notes/note';

describe('Note class - tests', () => {
    it('should create a note', () => {
        const note1 = new Note('user1', 'title1', 'body1', 'red');
        expect(note1.getUser()).to.equal('user1');
        expect(note1.getTitle()).to.equal('title1');
        expect(note1.getBody()).to.equal('body1');
        expect(note1.getColor()).to.equal('red');
    });

    it('should set the title', () => {
        const note1 = new Note('user1', 'title1', 'body1', 'red');
        note1.setTitle('title2');
        expect(note1.getTitle()).to.equal('title2');
    });

    it('should set the body', () => {
        const note1 = new Note('user1', 'title1', 'body1', 'red');
        note1.setBody('body2');
        expect(note1.getBody()).to.equal('body2');
    });

    it('should set the color', () => {
        const note1 = new Note('user1', 'title1', 'body1', 'red');
        note1.setColor('blue');
        expect(note1.getColor()).to.equal('blue');
    });
});