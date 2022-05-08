import 'mocha';
import {expect} from 'chai';
import {Note} from '../src/Notes/note';
import {ManageNote} from '../src/Notes/mngNote';

describe('ManageNote class - tests', () => {
    const manager = new ManageNote();

    it('ManageNote should be an instance of ManageNote', () => {
        expect(manager).to.be.an.instanceof(ManageNote);
    });

    it('ManageNote should exists', () => {
        expect(ManageNote).to.exist;
    });

    it('ManageNote allows to add a note', () => {
        manager.addNote('user1', 'title1', 'body1', 'red');
        expect(manager.listNotes('user1')).to.have.lengthOf(2);
    });
    
    // ... more tests here
});