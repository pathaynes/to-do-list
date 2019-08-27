const client = require('../lib/client');
const types = require('./Lists');

client.connect()
    .then(() => {
        // "Promise all" does a parallel excution of async tasks
        return Promise.all(
            types.map(listType => {
                return client.query(`
                    INSERT INTO lists (description)
                    VALUES ($1)
                    RETURNING *;
                `,
                [listType.description])
                    .then(result => result.rows[0]);
            })
        );
    })
    .then(
        () => console.log('seed data load complete'),
        err => console.log(err)
    )
    .then(() => {
        client.end();
    });
  
                