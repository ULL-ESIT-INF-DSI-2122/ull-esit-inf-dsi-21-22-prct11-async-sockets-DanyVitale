import * as net from 'net';
import chalk from 'chalk';
import {EventEmitterServer} from './eventEmitterServer';
import {Note} from '../Notes/note';
import {ResponseType} from '../Interfaces/response';
import { ManageNote } from '../Notes/mngNote';

net.createServer((connect) => {
    console.log(chalk.white('Request received'));
    const eventEmitterServer = new EventEmitterServer(connect);
    
    eventEmitterServer.on('request', (data) => {
        if (data.type === 'add') {
            const response: ResponseType = {
                type: 'add',
                success: new ManageNote().addNote(data.user, data.title, data.body, data.color),
            };
            connect.write(JSON.stringify(response));
        } else if (data.type === 'delete') {
            const response: ResponseType = {
                type: 'delete',
                success: new ManageNote().removeNote(data.user, data.title),
            };
            connect.write(JSON.stringify(response));

        } else if (data.type === 'update') {
            const response: ResponseType = {
                type: 'update',
                success: new ManageNote().editNote(data.user, data.title, data.body, data.color),
            };
            connect.write(JSON.stringify(response));

        } else if (data.type === 'read') {
            const userNotes: Note | undefined = new ManageNote().readNote(data.user, data.title);
            let response: ResponseType;
            if (userNotes) {
                response = {
                    type: 'read',
                    success: true,
                    notes: [userNotes],
                };
            } else {
                response = {
                    type: 'read',
                    success: false,
                };
            }
            connect.write(JSON.stringify(response));

        } else if (data.type === 'list') {
            const response: ResponseType = {
                type: 'list',
                success: true,
                notes: new ManageNote().listNotes(data.user),
            };
            connect.write(JSON.stringify(response));
        } else {
            console.log(chalk.red('Invalid request'));
        }

        connect.end();
        connect.on('end', () => {
            console.log(chalk.white('Request ended'));
            console.log(chalk.yellow('-------------------------------'));
        });
        connect.on('error', (err) => {
            console.log(chalk.red('Error: '+err.message));
        });
    });
}).listen(3000, () => {
    console.log('Server status: '+chalk.green('online'));
    console.log(chalk.yellow('-------------------------------'));
});