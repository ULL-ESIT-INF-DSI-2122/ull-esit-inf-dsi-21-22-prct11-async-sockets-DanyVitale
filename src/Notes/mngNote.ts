import * as fs from 'fs';
import {Note} from './note';
import chalk from 'chalk';

/**
 * ManageNote Class - represents note operations
 */
export class ManageNote {
    /**
     * Constructor - creates a new manage note
     */
    constructor() {
        this.init();
    }
    /**
     * init - initializes the manage note
     */
    private init() {
        this.createFolder();
    }
    /**
     * createFolder - creates the folder
     */
    private createFolder() {
        if (!fs.existsSync('./src/Users')) {
            fs.mkdirSync('./src/Users');
        }
    }
    /**
     * end - ends the manage note
     */
    private end() {
        if (fs.readdirSync('./src/Users')) {
            fs.rmdirSync('./src/Users');
        }
    }
    /**
     * AddNote - adds a note
     * @param user - the user
     * @param title - the title
     * @param body - the body
     * @param color - the color
     */
    public addNote(user: string, title: string, body: string, color: string): boolean {
        this.init();
        if (!fs.existsSync(`./src/Users/${user}`)) {
            fs.mkdirSync(`./src/Users/${user}`);
        }

        if (fs.existsSync(`./src/Users/${user}/${title}.json`)) {
            console.log(chalk.red('Note already exists'));
            return false
        } else {
            fs.writeFile(`./src/Users/${user}/${title}.json`, JSON.stringify(new Note(user, title, body, color)), (err) => {
                if (err) {
                    throw err.message;
                }
                console.log(chalk.green('Note created successfully'));
                return true;
            });
        }
        return true;
    }

    /**
     * listNotes - lists all user's notes
     * @param user - the user
     */
    public listNotes(user: string): Note[] | undefined {
        if (!fs.existsSync(`./src/Users/${user}`)) {
            console.log(chalk.red('User does not exist'));
            return undefined;
        } else {
            const arrNotes: Note[] = []
            fs.readdirSync(`./src/Users/${user}`).forEach(file => {
                const noteObj: Note | undefined = this.readNote(user, file.slice(0, -5));
                if (noteObj) arrNotes.push(noteObj);
            });
            if (arrNotes.length === 0) {
                console.log(chalk.red('User has no notes'));
            }
            return arrNotes;
        }
    }

    /**
     * readNote - reads a note
     * @param user - the user
     * @param title - the title
     */
    public readNote(user: string, title: string): Note | undefined {
        if (fs.existsSync(`./src/Users/${user}/${title}.json`)) {
            const note = JSON.parse(fs.readFileSync(`./src/Users/${user}/${title}.json`, 'utf8'));
            if (note.user && note.title && note.body && note.color) {
                console.log(chalk.white(`Owner: ${note.user}`));
                console.log(chalk.white(`Title: ${note.title}`));
                switch (note.color) {
                    case 'red':
                        console.log(chalk.red(`Body: ${note.body}`));
                        break;
                    case 'green':
                        console.log(chalk.green(`Body: ${note.body}`));
                        break;
                    case 'blue':
                        console.log(chalk.blue(`Body: ${note.body}`));
                        break;
                    case 'yellow':
                        console.log(chalk.yellow(`Body: ${note.body}`));
                        break;
                    default:
                        console.log(chalk.white(`Body: ${note.body}`));
                        break;
                }
                console.log(chalk.white(`Color: ${note.color}`));
                console.log(chalk.green('Note read successfully'));
                return note;
            } else {
                console.log(chalk.red('Note does not exist'));
                return undefined;
            }
        } else {
            console.log(chalk.red('Note does not exist'));
            return undefined;
        }
    }

    /**
     * removeNote - removes a note
     * @param user - the user
     * @param title - the title
     */
    public removeNote(user: string, title: string): boolean {
        if (fs.existsSync(`./src/Users/${user}/${title}.json`)) {
            fs.rm(`./src/Users/${user}/${title}.json`, (err) => {
                if (err) {
                    throw err.message;
                } else {
                    console.log(chalk.green('Note removed successfully'));
                    if (!fs.readdirSync(`./src/Users/${user}`).length) {
                        fs.rmdirSync(`./src/Users/${user}`);
                    }
                    return true;
                }
            });
        } else {
            console.log(chalk.red('Note does not exist'));
            return false;
        }
        return true;
    }

    /**
     * editNote - edits a note
     * @param user - the user
     * @param title - the title
     * @param body - the body
     * @param color - the color
     */
    public editNote(user: string, title: string, body: string, color: string): boolean {
        if (fs.existsSync(`./src/Users/${user}/${title}.json`)) {
            const note = JSON.parse(fs.readFileSync(`./src/Users/${user}/${title}.json`, 'utf8'));
            if (note.user && note.title && note.body && note.color) {
                note.color = color;
                note.body = body;
                fs.writeFile(`./src/Users/${user}/${title}.json`, JSON.stringify(note), (err) => {
                    if (err) {
                        throw err.message;
                    } else {
                        console.log(chalk.green('Note edited successfully'));
                        return true;
                    }
                });
            } else {
                console.log(chalk.red('Note does not exist'));
                return false;
            }
        } else {
            console.log(chalk.red('Note does not exist'));
            return false;
        }
        return true;
    }
}

