import yargs from "yargs";
import chalk from "chalk";
import {connect} from 'net';
import { EventEmitterClient } from "./eventEmitterClient";
import {RequestType} from '../Interfaces/request';
import {NoteType} from '../Interfaces/noteType';
import {Note} from '../Notes/note';

const socket = connect({port: 3000});
const client = new EventEmitterClient(socket);

yargs.command({
  command: 'add',
  describe: 'Add a note',
  builder: {
    user: {
        describe: 'Username',
        demandOption: true,
        type: 'string',
    },
    title: {
        describe: 'Title of the note',
        demandOption: true,
        type: 'string',
    },
    body: {
        describe: 'Body of the note',
        demandOption: true,
        type: 'string',
    },
    color: {
        describe: 'Color of the note',
        demandOption: true,
        type: 'string',
    },
},
handler: (argv) => {
    if (typeof argv.user === 'string' && typeof argv.title === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string') {
        if (argv.color === 'red' || argv.color === 'blue' || argv.color === 'green' || argv.color === 'yellow') {
            const request: RequestType = {
                type: 'add',
                user: argv.user,
                title: argv.title,
                body: argv.body,
                color: argv.color,
            };
            socket.write(JSON.stringify(request)+'\n');
        } else {
            console.log(chalk.red('Color must be red, blue, green or yellow'));
        }
    } else {
        console.log(chalk.red('Invalid input'));
    }
},
}).command({
    command: 'update',
    describe: 'Update a note',
    builder: {
        user: {
            describe: 'Username',
            demandOption: true,
            type: 'string',
        },
        title: {
            describe: 'Title of the note',
            demandOption: true,
            type: 'string',
        },
        body: {
            describe: 'Body of the note',
            demandOption: true,
            type: 'string',
        },
        color: {
            describe: 'Color of the note',
            demandOption: true,
            type: 'string',
        },
    },
    handler: (argv) => {
        if (typeof argv.user === 'string' && typeof argv.title === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string') {
            if (argv.color === 'red' || argv.color === 'blue' || argv.color === 'green' || argv.color === 'yellow') {
                const request: RequestType = {
                    type: 'update',
                    user: argv.user,
                    title: argv.title,
                    body: argv.body,
                    color: argv.color,
                };
                socket.write(JSON.stringify(request)+'\n');
            } else {
                console.log(chalk.red('Color must be red, blue, green or yellow'));
            }
        } else {
            console.log(chalk.red('Invalid input'));
        }
    },
}).command({
    command: 'delete',
    describe: 'Delete a note',
    builder: {
        user: {
            describe: 'Username',
            demandOption: true,
            type: 'string',
        },
        title: {
            describe: 'Title of the note',
            demandOption: true,
            type: 'string',
        },
    },
    handler: (argv) => {
        if (typeof argv.user === 'string' && typeof argv.title === 'string') {
            const request: RequestType = {
                type: 'delete',
                user: argv.user,
                title: argv.title,
            };
            socket.write(JSON.stringify(request)+'\n');
        } else {
            console.log(chalk.red('Invalid input'));
        }
    },
}).command({
    command: 'read',
    describe: 'Read a note',
    builder: {
        user: {
            describe: 'Username',
            demandOption: true,
            type: 'string',
        },
        title: {
            describe: 'Title of the note',
            demandOption: true,
            type: 'string',
        },
    },
    handler: (argv) => {
        if (typeof argv.user === 'string' && typeof argv.title === 'string') {
            const request: RequestType = {
                type: 'read',
                user: argv.user,
                title: argv.title,
            };
            socket.write(JSON.stringify(request)+'\n');
        } else {
            console.log(chalk.red('Invalid input'));
        }
    },
}).command({
    command: 'list',
    describe: 'List all notes',
    builder: {
        user: {
            describe: 'Username',
            demandOption: true,
            type: 'string',
        },
    },
    handler: (argv) => {
        if (typeof argv.user === 'string') {
            const request: RequestType = {
                type: 'list',
                user: argv.user,
            };
            socket.write(JSON.stringify(request)+'\n');
        } else {
            console.log(chalk.red('Invalid input'));
        }
    },
}).parse();

/**
 * Responses
 */
client.on('respond', (data) => {
    if (data.type === 'add') {
        if (data.success) {
            console.log(chalk.green('Note added'));
        } else {
            console.log(chalk.red('Error: '+data.message));
        }
    } else if (data.type === 'update') {
        if (data.success) {
            console.log(chalk.green('Note updated'));
        } else {
            console.log(chalk.red('Error: '+data.message));
        }
    } else if (data.type === 'delete') {
        if (data.success) {
            console.log(chalk.green('Note deleted'));
        } else {
            console.log(chalk.red('Error: '+data.message));
        }
    } else if (data.type === 'read') {
        if (data.success) {
            console.log(chalk.green('Note read'));
        } else {
            console.log(chalk.red('Error: '+data.message));
        }
    } else if (data.type === 'list') {
        if (data.success) {
            console.log(chalk.green('List of notes'));
            data.notes.forEach((note: NoteType) => {
                console.log(chalk.green(note.title));
                console.log(chalk.green(note.body));
                console.log(chalk.green(note.color));
                console.log(chalk.green('-------------------------------'));
            });
        } else {
            console.log(chalk.red('Error: '+data.message));
        }
    } else {
        console.log(chalk.red('Invalid response'));
    }
});