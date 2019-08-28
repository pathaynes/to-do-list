const client = require('../lib/client');
const types = require('./Lists');

        // "Promise all" does a parallel excution of async tasks
Promise.all(
    types.map(listType => {
        return client.query(`
                    INSERT INTO lists (description)
                    VALUES ($1)
                    RETURNING *;
                `,
        [listType.description])
            .then(result => {
                console.log(result.rows);
                return result.rows[0];
            });
    })
)
    .then(
        () => console.log('seed data load complete'),
        err => console.log(err)
    )
    .then(() => {
        client.end();
    });
  
                