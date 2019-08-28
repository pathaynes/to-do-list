// Load Environment Variable from the .env file
require('dotenv').config();

//Application Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const client = require('./lib/client');

// Database Client
client.connect();

// Application Setup
const app = express();
const PORT = process.env.PORT;
app.use(morgan('dev')); // http logging
app.use(cors()); // enable CORS request
app.use(express.static('public')); // enable serving files from public
app.use(express.json()); // enable reading incoming json data

app.get('/api/types', (req, res) => {
    const showAll = (req.query.show && req.query.show.toLowerCase() === 'all');
    const where = showAll ? '' : 'WHERE done = FALSE';
    console.log('I hit the get route');
    client.query(`
        SELECT
              id,
              description
        FROM  lists
        ${where}
        ORDER BY description;
    `)
        .then(result => {
            console.log(result);
            res.json(result.rows);
        })
        .catch(err => {
            res.status(500).json({
                error: err.message || err
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err.message || err
            });
        });
});

app.post('/api/types', (req, res) => {
    const type = req.body;
    client.query(`
        INSERT INTO types (name)
        VALUES ($1)
        RETURNING *;
    `,
    [type.description]
    )
        .then(result => {
            res.json(result.rows[0]);
        })
        .catch(err => {
            if(err.code === '23505') {
                res.status(400).json({
                    error: `Type "${type.description}" already exists`
                });
            }
            res.status(500).json({
                error: err.message || err
            });
        }); 
});

app.delete('/api/types/:id', (req, res) => {
    const id = req.params.id;

    client.query(`
        DELETE FROM types
        WHERE  id = $1
        RETURNING *;
    `,
    [id]
    )
        .then(result => {
            res.json(result.rows[0]);
        })
        .catch(err => {
            if(err.code === '23503') {
                res.status(400).json({
                    error: `Could not remove, type is in use. Make inactive or delete all cats with that type first.`
                });
            }
            res.status(500).json({
                error: err.message || err
            });
        }); 
});

app.listen(PORT, () => {
    console.log('server running on PORT', PORT);
});