const express = require('express');
const router = express.Router();
const postDb = require('./postDb');

router.get("/", (req, res) => {
    postDb.get()
    .then(response => {
        res.status(200).json(response);
    })
    .catch(err => {
        res.json({ error: err, message: "The posts information could not be retrieved." })
    })
});

router.post("/", (req, res) => {
    const properties = req.body;
    if (properties.text && properties.user_id) {
        postDb.insert(properties)
        .then(response => {
            res.status(201).json(response);
        })
        .catch(err => {
            res.status(500).json({ error: err, message: "There was an error while saving the post to the database" })
        })
    } else {
        res.status(400).json({ errorMessage: "Please provide text and user_id for the post." })
    };
});

router.get("/:id", (req, res) => {
    const postId = req.params.id;
    postDb.getById(postId)
    .then(response => {
        if (response.length === 0) {
            res.status(404).json({ error: err, message: "The post with the specified ID does not exist." })
        } else {
            res.status(200).json(response);
        }
    })
    .catch(err => {
        res.status(500).json({ error: err, message: "The posts information could not be retrieved." })
    })
});

router.delete("/:id", (req, res) => {
    const postId = req.params.id;
    postDb.remove(postId)
    .then(response => {
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(err => {
        res.status(500).json({ error: err, message: "The post could not be removed" })
    })
});

router.put("/:id", (req, res) => {
    const postId = req.params.id;
    const properties = req.body;
    if (properties.text && properties.user_id) {
        postDb.update(postId, properties)
        .then(response => {
            if (response) {
                res.status(200).json(response);
            } else {
                res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ error: err, message: "The post information could not be modified." })
        })
    } else if (!properties.title || !properties.contents) {
        res.status(400).json({ errorMessage: "Please provide text and user_id for the post." })
    }
});

module.exports = router;