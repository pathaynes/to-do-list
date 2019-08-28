// Load Environment Variable from the .env file
require('dotenv').config();

//Application Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Database Client
const client = require('./lib/client');

// Auth
const ensureAuth = require('./lib/auth/ensure-auth');
const createAuthRoutes = require('./lib/auth/create-auth-routes');
const authRoutes = createAuthRoutes({
    selectUser(email) {
        return client.query(`
            SELECT id, email, hash, display_name as "displayName" 
            FROM users
            WHERE email = $1;
        `,
        [email]
        ).then(result => result.rows[0]);
    },
    insertUser(user, hash) {
        console.log('insert user', user);
        return client.query(`
            INSERT into users (email, hash, display_name)
            VALUES ($1, $2, $3)
            RETURNING id, email, display_name as "displayName";
        `,
        [user.email, hash, user.displayName]
        ).then(result => result.rows[0]);
    }
});

// Application Setup
const app = express();
const PORT = process.env.PORT;
app.use(morgan('dev')); // http logging
app.use(cors()); // enable CORS request
app.use(express.static('public')); // enable serving files from public
app.use(express.json()); // enable reading incoming json data

// setup authentication routes
app.use('/api/auth', authRoutes);


// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);


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
    console.log(req.body);
    const type = req.body;
    client.query(`
        INSERT INTO lists (description)
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

app.put('/api/types/:id', (req, res) => {
    const id = req.params.id;
    const type = req.body;
    client.query(`
        UPDATE lists
        SET   description = $2,
              done = $3
        WHERE id = $1
        RETURNING *;          
    `,
    [id, type.description, type.inactive]
    )
        .then(result => {
            res.json(result.rows[0]);
        })
        .catch(err => {
            if(err.code === '23505') {
                res.status(400).json({
                    error: `Type "${type.name}" already exists`
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
        DELETE FROM lists
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