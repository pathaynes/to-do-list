const client = require('../lib/client');
const types = require('./priorities');
const lists = require('./Lists');

client.connect()
    .then(() => {
        // "Promise all" does a parallel excution of async tasks
        return Promise.all(
            types.map(type => {
                return client.query
            })
        )
    }