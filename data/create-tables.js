const client = require('../lib/client.js');

client.connect()
    .then(() => {
        console.log('connected');
        return client.query(`
            CREATE TABLE lists (
                id SERIAL PRIMARY KEY NOT NULL,
                description VARCHAR(256) NOT NULL UNIQUE,
                done BOOLEAN NOT NULL DEFAULT FALSE
            );
        `);
    })
    .then(
        () => console.log('create tables complete'),
        err => console.log(err)
    )
    .then(() => {
        client.end();
    });
