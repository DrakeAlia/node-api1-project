// import express
const express = require('express'); // similar to import express from 'express';

// create a server
const server = express();

// middleware - to teach express new tricks
server.use(express.json()); // how to parse JSON from the body 

// listen for incoming requests
const port = 9000;

server.listen(port, () => console.log(`\n == API on port ${port} == \n`));

// const shortid = require('shortid');


let users = [
	{
		id: 1,
		name: "Adam Driver",
		bio: "He was Kylo Ren in Star Wars"
    },
    {
		id: 2,
		name: "Ryan Gosling",
		bio: "He was the main character of Drive"
	},
];

server.get("/", (req, res) => {
    res.json("Hello there!");
});

server.post("/api/users", (req, res) => {
    const userInfo = req.body;

    userInfo.id = shortid.generate();

    users.push(userInfo);

    // if(!users) {
    //     res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    // } else {
    //     res.statusMessage(500).json({ errorMessage: "There was an error while saving the user to the database" });
    // }

    res.status(201).json(userInfo);
});

server.get("/api/users", (req, res) => {
    res.status.json(users);
});

server.delete("/api/users/:id", (req, res) => {
    const {id} = req.params;
    const changes = req.body;

    let 
})

