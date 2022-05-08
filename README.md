# PRÁCTICA 11 - Cliente y servidor para una aplicación de procesamiento de notas de texto
### *ASIGNATURA:* Desarrollo de Sistemas Informáticos
 > **NOMBRE COMPLETO:** DANIELE VITALE  
 > ID ALU: ALU0101329017  
 > E-MAIL: alu0101329017@ull.edu.es  
 > CURSO: 3ro Ingeniería Informática  

[![Coveralls](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-DanyVitale/actions/workflows/coveralls.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-DanyVitale/actions/workflows/coveralls.yml)
[![Tests](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-DanyVitale/actions/workflows/test.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-DanyVitale/actions/workflows/test.js.yml)
[![Sonar-Cloud](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-DanyVitale/actions/workflows/sonarcloud.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-DanyVitale/actions/workflows/sonarcloud.yml)

## **ÍNDICE**   
1. [INTRODUCCIÓN](#id1)
2. [DESCRIPCIÓN](#id2)  
    2.1 [SERVER](#id2.1)  
    2.2 [CLIENT](#id2.2)
3. [CONCLUSIONES](#id3)

# INTRODUCCIÓN<a name="id1"></a>
La práctica consiste en, a partir de la implementación de la aplicación de procesamiento de notas de texto en la Práctica 9, desarrollar un servidor y un cliente haciendo uso de los sockets proporcionados por el módulo net de Node.js.

Las operaciones que podrá solicitar el cliente al servidor deberán ser:
- Añadir notas
- Modificar notas
- Eliminar notas
- Listar notas
- Leer notas  
Es importante decir que un usuario puede con el cliente de la aplicación, exclusivamente, a través de la línea de comandos.

Algunas tareas previas antes de proceder con el desarrollo de la aplicación:
- [x] Aceptar la [asignación de GitHub Classroom](https://classroom.github.com/a/GJHRHQX0) asociada a esta práctica.
- [x] Familiarizarse con el módulo net de [Node.js](https://nodejs.org/dist/latest-v18.x/docs/api/net.html).
- [x] Familiarícese con la clase EventEmitter del [módulo Events de Node.js](https://nodejs.org/dist/latest-v18.x/docs/api/events.html#events_class_eventemitter)
- [x] Utilizar los paquetes [yargs](https://www.npmjs.com/package/yargs) y [chalk](https://www.npmjs.com/package/chalk)

# DESCRIPCIÓN<a name="id2"></a>
Como se puede observar en el repositorio de GitHub, en la sección de desarrollo (./src) se encuentran las siguientes carpetas:
- [x] Cliente: contiene el código del cliente.
- [x] Server: contiene el código del servidor.
- [x] Interfaces: contiene las interfaces de los módulos que se utilizan en el cliente y en el servidor.
- [x] Notes: contiene los ficheros de la clase Notes y ManagerNotes.

Empezando por las interfaces implementadas:
- [x] Interface Notes: contiene la interfaz de la clase Notes.

```typescript
type NoteType = {
    user: string;
    title: string;
    body: string;
    color: string;
};
```

- [x] Interface Request: contiene la interfaz de la clase Request.

```typescript
type RequestType = {
    type: 'add' |'update' | 'delete' | 'read' | 'list';
    user?: string;
    title?: string;
    body?: string;
    color?: string;
};
```

- [x] Interface Response: contiene la interfaz de la clase Response.

```typescript
type ResponseType = {
    type: 'add' |'update' | 'delete' | 'read' | 'list' ;
    success: boolean;
    notes?: Note[];
};
```

Tratando el tema de las notas: hubieron correcciones en los ficheros de la clase Note y ManagerNotes. En la clase Note, solo se añadieron métodos que ayudasen con la obtención y modificación de datos de la nota.
Por otro lado en la clase ManageNote, se añadieron métodos que ayudaran con las operaciones para efectuar con las notas:

```typescript
export class ManageNote {
    
    constructor() {
        this.init();
    }
    
    private init() {
        this.createFolder();
    }
    
    private createFolder() {
        if (!fs.existsSync('./src/Users')) {
            fs.mkdirSync('./src/Users');
        }
    }
    
    private end() {
        if (fs.readdirSync('./src/Users')) {
            fs.rmdirSync('./src/Users');
        }
    }
    // more code here ...

}
```

El constructor de la clase ManageNote se encarga de crear la carpeta ./src/Users si no existe. Además, se implementa un método end() que elimina la carpeta ./src/Users si existe.

```typescript
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
```

El método addNote se encarga de crear una nota en la carpeta ./src/Users/user/title.json. Si la nota ya existe, se muestra un mensaje de error. Es importante decir que, para que se encaje bien con el resto de la aplicación devuelve un booleano. (Los siguientes métodos son iguales).

```typescript
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
```

El método listNotes se encarga de listar las notas de un usuario. Si el usuario no existe, se muestra un mensaje de error. Para ello, se comprueba si existe la carpeta ./src/Users/user. Si existe, se listan las notas que contiene. Obviamente, como se puede observar, se van metiendo todas las notas en un array.

```typescript
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
```

El método readNote se encarga de leer una nota. Si la nota existe, se muestra su contenido. A la hora de mostrar su contenido, tal y como se propone en el enunciado, el color de la letra se cambia dependiendo del color de la nota. Si la nota no existe, se muestra un mensaje de error.

```typescript
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
```

El método removeNote se encarga de eliminar una nota. Si la nota existe, se elimina. Si la nota no existe, se muestra un mensaje de error. Para ello, se comprueba si existe la carpeta ./src/Users/user. En caso de que sí, se comprueba si existe la nota ./src/Users/user/title.json. Si ésta última existe, se elimina.

```typescript
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
```

El método editNote se encarga de editar una nota. Se comprueba si existe la carpeta ./src/Users/user. En caso de que sí, se comprueba si existe la nota ./src/Users/user/title.json. Si ésta última existe, se edita. Para el desarrollo de este método se comprueba si la nota tiene todos los campos necesarios, y si es así, se editan color y cuerpo.

## SERVER<a name="id2.1"></a>
La carpeta relativa al servidor contiene dos ficheros importantes y vitales para el desarrollo del servidor:
- [x] server.ts: contiene el código del servidor.
- [x] eventEmitterServer.ts: contiene la clase EventEmitterServer.

Empezando por el código del servidor:

```typescript
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
            // code goes here ...
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
```

Para su desarrollo se hizo uso de la librería [net](https://nodejs.org/dist/latest-v18.x/docs/api/net.html) de Node.js. Creamos un servidor con la función ```createServer```. El parámetro de la función es una función que se ejecuta cuando se recibe una petición. A continuación se imprime un mensaje en el server para indicar que se ha recibido una petición. Llegados a este punto, creamos un objeto de la clase EventEmitterServer. 
Una vez hecho lo anterior se ejecuta la función ```on``` que recibe como parámetro el nombre del evento y una función que se ejecuta cuando se produce el evento, en este caso, es la función ```request```.
A seguir una serie de condiciones que se ejecutan cuando se recibe una determinada petición.
Tomando como ejemplo la petición de añadir una nota, se crea un objeto de la clase Response con el tipo de petición ```add```. Una vez realizado lo anterior se crea una constante de tipo ResponseType que contiene el objeto Response. Finalmente con la función write se envía el objeto Response al cliente. Se hace uso de JSON.stringify para convertir el objeto Response en una cadena de texto. Una vez terminada la ejecución de la función write, se cierra la conexión con el cliente. Además, para avisar el cliente que la petición ha terminado, se imprime un mensaje en el server.

El 'segundo' fichero de la carpeta server contiene la clase EventEmitterServer. La clase EventEmitterServer es una clase que hereda de la clase EventEmitter de Node.js:

    ```typescript
class EventEmitterServer extends EventEmitter {

    constructor(connect: EventEmitter) {
        super();

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
```

La clase contiene un constructor que recibe como parámetro un objeto de tipo EventEmitter. A continuación se hace uso de la función on para asignar una función a un evento. Se empieza sumando a wholeMessage el contenido de data. Luego se realiza una condición que comprueba si existe una nueva línea en el mensaje. Si existe, se crea una constante llamada message que contiene el mensaje hasta la nueva línea. Luego se realiza una condición que comprueba si el mensaje es un objeto JSON. Si es así, se emite el evento 'request' con el mensaje.


## CLIENT<a name="id2.2"></a>
La carpeta relativa al cliente contiene dos ficheros importantes y vitales para el desarrollo del cliente:
- [x] client.ts: contiene el código del cliente.
- [x] eventEmitterClient.ts: contiene la clase EventEmitterClient.

Empezando por el código del cliente:

```typescript
const socket = connect({port: 3000});
const client = new EventEmitterClient(socket);
```

Lo primero que se hace es crear dos constantes que contienen un objeto de tipo Socket(conectado al puerto 3000) y un objeto de tipo EventEmitterClient.

Haciendo uso de yargs se pudieron implementar los varios comandos solicitados.

```typescript
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
});
``` 

Para el comando 'add', se comprueban los parámetros de entrada. Si todos los parámetros son correctos, se crea un objeto de tipo RequestType que contiene el tipo de petición, el usuario, el título, el cuerpo y el color. Se envía el objeto RequestType al servidor.

El procedimiento descrito anteriormente se repite para los siguientes comandos (update, delete, list, read).

```typescript
yarga.command({
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

```

Finalmente con la función `parse()` se ejecuta el programa. 
Además de lo descrito en anterioridad, gracias a la constante ```client``` creada se usa la función ```on``` para imprimir notificaciones en base a la respuesta del servidor. Para ello se basará

```typescript
client.on('respond', (data) => {
    if (data.type === 'add') {
        if (data.success) {
            console.log(chalk.green('Note added'));
        } else {
            console.log(chalk.red('Error: '+data.message));
        }
    } else if (data.type === 'update') {
       // ...
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
```

Por otro lado, tenemos la clase EventEmitterClient que hereda de EventEmitter. 

```typescript
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
```

Consta de un constructor, que recibe un evento de conexión. En el constructor se crea una variable ```wholeMessage``` que se usará para guardar el mensaje completo que se recibe del servidor.

A continuación, se crea una función ```on``` que se encarga de imprimir los mensajes que se reciben del servidor. Para ello, se busca el caracter ```\n``` en el mensaje y se emite un evento ```request``` con el mensaje que se ha recibido.

# CONCLUSIONES<a name="id3"></a>
La realización de este proyecto ha sido muy interesante. Sobre todo, fue vital el uso de las librerías chalk para poder imprimir los mensajes de color, yargs para poder crear una interfaz de usuario y, el uso de socket para poder conectar con el servidor. Se intentó hacer uso de los principios SOLID, sobretodo en las clases desarrolladas.
