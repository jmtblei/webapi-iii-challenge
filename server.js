const express = require('express');

const postRouter = require('./data/helpers/post-router')
const userRouter = require('./data/helpers/user-router');

const server = express();

// const cors = require("cors");

server.use(express.json());

// server.use(cors());

server.get('/', (req, res) => {
    res.send('What are we in this world..?');
});

server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

module.exports = server;