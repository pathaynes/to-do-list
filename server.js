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

app.get('/api/lists', (req, res) => {
    const id = req.params.id;
console.log('I hit the get route');
    client.query(`
        SELECT
              l.*,
              l.description
        FROM  lists c
        ON    l.list_id = l.id
        WHERE l.id = $1
    `,
    [id]
    )
        .then(result => {
            const list = result.rows[0];
            if(!list) {
                res.status(404).json({
                    error: `List id ${id} does not exist`
                });
            }
            else {
                res.json(result.rows[0]);
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err.message || err
            });
        });
});

// app.post('/api/lists', (req, res) => {
//     const type = req.body;
//     client.query(`
//         INSERT INTO lists (descrition)
//         VALUES ($1)
//         RETURNING *;
//     `,
//     [type.name]
//     )
//         .then(result => {
//             res.json(result.rows[0]);
//         })
//         .catch(err => {
//             if(err.code === '23505') {
//                 res.status(400).json({
//                     error: `Type "${type.name}" already exists`
//                 });
//             }
//             res.status(500).json({
//                 error: err.message || err
//             });
//         }); 
// });





// app.get('/api/cats', (req, res) => {
//     client.query(`
//         SELECT
//             c.id,
//             c.name,
//             c.type_id,
//             t.name as type,
//             c.url,
//             c.year
//         FROM cats c
//         JOIN types t
//         ON   c.type_id = t.id
//         ORDER BY c.year;
//     `)
//         .then(result => {
//             res.json(result.rows);
//         })
//         .catch(err => {
//             res.status(500).json({
//                 error: err.message || err
//             });
//         });
// });

// app.get('/api/cats/:id', (req, res) => {
//     const id = req.params.id;

//     client.query(`
//         SELECT
//               c.*,
//               t.name as type
//         FROM  cats c
//         JOIN  types t
//         ON    c.type_id = t.id
//         WHERE c.id = $1
//     `,
//     [id]
//     )
//         .then(result => {
//             const cat = result.rows[0];
//             if(!cat) {
//                 res.status(404).json({
//                     error: `Cat id ${id} does not exist`
//                 });
//             }
//             else {
//                 res.json(result.rows[0]);
//             }
//         })
//         .catch(err => {
//             res.status(500).json({
//                 error: err.message || err
//             });
//         });
// });

// app.post('/api/cats', (req, res) => {
//     const cat = req.body;
//     client.query(`
//         INSERT INTO cats (name, type_id, url, year, lives, is_sidekick)
//         VALUES ($1, $2, $3, $4, $5, $6)
//         RETURNING *;
//     `,
//     [cat.name, cat.typeId, cat.url, cat.year, cat.lives, cat.isSidekick]
//     )
//         .then(result => {
//             res.json(result.rows[0]);
//         })
//         .catch(err => {
//             res.status(500).json({
//                 error: err.message || err
//             });
//         }); 
// });

// app.get('/api/types', (req, res) => {
//     const showAll = (req.query.show && req.query.show.toLowerCase() === 'all');
//     const where = showAll ? '' : 'WHERE inactive = FALSE';
    
//     client.query(`
//         SELECT
//             id,
//             name,
//             inactive
//         FROM types
//         ${where}
//         ORDER BY name;
//     `)
//         .then(result => {
//             res.json(result.rows);
//         })
//         .catch(err => {
//             res.status(500).json({
//                 error: err.message || err
//             });
//         });   
// });

// app.post('/api/types', (req, res) => {
//     const type = req.body;
//     client.query(`
//         INSERT INTO types (name)
//         VALUES ($1)
//         RETURNING *;
//     `,
//     [type.name]
//     )
//         .then(result => {
//             res.json(result.rows[0]);
//         })
//         .catch(err => {
//             if(err.code === '23505') {
//                 res.status(400).json({
//                     error: `Type "${type.name}" already exists`
//                 });
//             }
//             res.status(500).json({
//                 error: err.message || err
//             });
//         }); 
// });

// app.put('/api/types/:id', (req, res) => {
//     const id = req.params.id;
//     const type = req.body;

//     client.query(`
//         UPDATE types
//         SET    name = $2,
//                inactive = $3
//         WHERE  id = $1
//         RETURNING *;
//     `,
//     [id, type.name, type.inactive]
//     )
//         .then(result => {
//             res.json(result.rows[0]);
//         })
//         .catch(err => {
//             if(err.code === '23505') {
//                 res.status(400).json({
//                     error: `Type "${type.name}" already exists`
//                 });
//             }
//             res.status(500).json({
//                 error: err.message || err
//             });
//         }); 
// });

// app.delete('/api/types/:id', (req, res) => {
//     const id = req.params.id;

//     client.query(`
//         DELETE FROM types
//         WHERE  id = $1
//         RETURNING *;
//     `,
//     [id]
//     )
//         .then(result => {
//             res.json(result.rows[0]);
//         })
//         .catch(err => {
//             if(err.code === '23503') {
//                 res.status(400).json({
//                     error: `Could not remove, type is in use. Make inactive or delete all cats with that type first.`
//                 });
//             }
//             res.status(500).json({
//                 error: err.message || err
//             });
//         }); 
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log('server running on PORT', PORT);
// });