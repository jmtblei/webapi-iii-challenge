const express = require('express');
const router = express.Router();
const userDb = require('./userDb');

function uppercaseName(req, res, next) {
    const name = req.body.name;
    if( name[0] !== name[0].toUpperCase()) {
        return res.status(400).json({
            errorMessage: 'First letter of name must be uppercase.'
        })
    } else {
        next();
    }
};

router.get('/', (req, res) => {
    userDb.get()
    .then(response => {
        res.status(200).json(response);
    })
    .catch(err => {
        res.json({ error: err, message: "The users information could not be retrieved."})
    })
})

router.post('/', uppercaseName, (req, res) => {
    const user = req.body;
    if (user.name) {
        userDb.insert(user)
        .then(response => {
            res.status(201).json(response);
        })
        .catch(err => {
            res.status(500).json({ error: err, message: "There was an error while saving the user to the database" })
        })
    } else {
        res.status(400).json({ errorMessage: "Please provide name for the user." });
    };
})

router.get('/:id', (req, res) => {    
    const userId = req.params.id;
    userDb.getById(userId)
    .then(response => {
        if (response.length === 0) {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        } else {
            res.status(200).json(response);
        }
    })
    .catch(err => {
        res.status(500).json({ error: err, message: "The user information could not be retrieved." })
    })
})

router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    userDb.remove(userId)
    .then(response => {
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
    })
    .catch(err => {
        res.status(500).json({ error: err, message: "The user could not be removed" })
    })
})

router.put('/:id', uppercaseName, (req, res) => {
    const userId = req.params.id;
    const changes = req.body;
    if (changes.name) {
        userDb.update(userId, changes)
        .then(response => {
            if (response) {
                res.status(200).json({ response, message: "The user's name has been updated!" });
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ error: err, message: "The user information could not be modified." })
        })
    } else if (!changes.name || !changes.bio) {
        res.status(400).json({ errorMessage:"Please provide new name for the user." })
    }
    
})

router.get('/:id/posts', (req, res) => {
    const userId = req.params.id;
    userDb.getUserPosts(userId)
    .then(response => {
        res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json({ error: err, message: "The users posts could not be accessed." })
    })
})

module.exports = router;