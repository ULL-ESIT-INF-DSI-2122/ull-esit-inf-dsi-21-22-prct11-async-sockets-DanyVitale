import * as fs from 'fs';
import * as yargs from 'yargs';
import chalk from 'chalk';
import {Note} from './note';

export const TITLE = 'The title of the note';
export const BODY = 'The body of the note';
export const USER = 'The user of the note';
export const COLOR = 'The color of the note';
export const ERROR = 'Error: Invalid arguments';

/**
 * Write a note to the file system
 * @param user - the user input
 * @param title - the title of the note
 * @param body - the body of the note
 * @param color - the color of the note
 */
export function writeNote(user: string, title: string, body: string, color: string): void {
  if (!fs.existsSync(`./src/Notas/${user}`)) {
    fs.mkdirSync(`./src/Notas/${user}`);
  }
  fs.writeFile(`./src/Notas/${user}/${title}.json`, JSON.stringify(new Note(user, title, body, color)), (err) => {
    if (err) {
      throw err;
    }
    console.log(chalk.green('Note created successfully'));
  });
}

/**
 * Command line interface: add, remove, list, read
 */
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    user: {
      describe: USER,
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: TITLE,
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: BODY,
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: COLOR,
      demandOption: true,
      type: 'string',
    },
  },
  handler: (argv: any) => {
    if (typeof argv.color === 'string' && typeof argv.user === 'string' && typeof argv.title === 'string' && typeof argv.body === 'string') {
      writeNote(argv.user, argv.title, argv.body, argv.color);
    } else {
      console.log(chalk.red(ERROR));
    }
  },
}).command({
  command: 'list',
  describe: 'List all notes',
  builder: {
    user: {
      describe: USER,
      demandOption: true,
      type: 'string',
    },
  },
  handler: (argv: any) => {
    if (typeof argv.user === 'string') {
      if (!fs.existsSync(`./src/Notas/${argv.user}`)) {
        fs.mkdirSync(`./src/Notas/${argv.user}`);
      }
      fs.readdir(`./src/Notas/${argv.user}`, (err, files) => {
        if (err) {
          throw err;
        }
        console.log(chalk.blue('Listing notes for user: ' + argv.user));
        if (files.length === 0) {
          console.log(chalk.yellow('Empty list'));
        }
        files.forEach((file) => {
          fs.readFile(`./src/Notas/${argv.user}/${file}`, 'utf8', (err, data) => {
            if (err) {
              throw err;
            }
            const color = JSON.parse(data).color;
            switch (color) {
              case 'red':
                console.log(chalk.red(JSON.parse(data).title));
                break;
              case 'green':
                console.log(chalk.green(JSON.parse(data).title));
                break;
              case 'blue':
                console.log(chalk.blue(JSON.parse(data).title));
                break;
              case 'yellow':
                console.log(chalk.yellow(JSON.parse(data).title));
                break;
              default:
                console.log(chalk.white(JSON.parse(data).title));
                break;
            }
          });
        });
      });
    } else {
      console.log(chalk.red(ERROR));
    }
  },
}).command({
  command: 'read',
  describe: 'Read a note',
  builder: {
    user: {
      describe: USER,
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: TITLE,
      demandOption: true,
      type: 'string',
    },
  },
  handler: (argv: any) => {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      fs.readFile(`./src/Notas/${argv.user}/${argv.title}.json`, 'utf8', (err, data) => {
        if (err) {
          throw err;
        }
        const color = JSON.parse(data).color;
        switch (color) {
          case 'red':
            console.log(chalk.red(JSON.parse(data).body));
            break;
          case 'green':
            console.log(chalk.green(JSON.parse(data).body));
            break;
          case 'blue':
            console.log(chalk.blue(JSON.parse(data).body));
            break;
          case 'yellow':
            console.log(chalk.yellow(JSON.parse(data).body));
            break;
          default:
            console.log(chalk.white(JSON.parse(data).body));
            break;
        }
      });
    } else {
      console.log(chalk.red(ERROR));
    }
  },
}).command({
  command: 'delete',
  describe: 'Delete a note',
  builder: {
    user: {
      describe: USER,
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: TITLE,
      demandOption: true,
      type: 'string',
    },
  },
  handler: (argv: any) => {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      fs.unlink(`./src/Notas/${argv.user}/${argv.title}.json`, (err) => {
        if (err) {
          throw err;
        }
        console.log(chalk.green('Note deleted successfully'));
      });
    } else {
      console.log(chalk.red(ERROR));
    }
  },
}).command({
  command: 'update',
  describe: 'Edit a note',
  builder: {
    user: {
      describe: USER,
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: TITLE,
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: BODY,
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: COLOR,
      demandOption: true,
      type: 'string',
    },
  },
  handler: (argv: any) => {
    if (typeof argv.user === 'string' && typeof argv.title === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string') {
      fs.readFile(`./src/Notas/${argv.user}/${argv.title}.json`, 'utf8', (err, data) => {
        if (err) {
          throw err;
        }
        const note = JSON.parse(data);
        note.body = argv.body;
        note.color = argv.color;
        fs.writeFile(`./src/Notas/${argv.user}/${argv.title}.json`, JSON.stringify(note), (err) => {
          if (err) {
            throw err;
          }
          console.log(chalk.green('Note edited successfully'));
        });
      });
    } else {
      console.log(chalk.red(ERROR));
    }
  },
});

yargs.parse();