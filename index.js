// import express
const express = require('express'); // similar to import express from 'express';
const shortid = require('shortid');

// create a server
const server = express();

// middleware - to teach express new tricks
server.use(express.json()); // how to parse JSON from the body

// listen for incoming requests
const port = 9001;
server.listen(port, () => console.log(`\n == API on port ${port} == \n`));

// array of users 
let users = [
	{
		id: 'a',
		name: 'Adam Driver',
		bio: 'He was Kylo Ren in Star Wars'
	},
	{
		id: 'b',
		name: 'Ryan Gosling',
		bio: 'He was the main character of Drive'
	}
];

// When the client makes a `POST` request to `/api/users`:
server.post('/api/users', (req, res) => {
	const userInfo = {
		...req.body,
		id: shortid.generate()
    };
    // If the request body is missing the `name` or `bio` property
    // respond with HTTP status code `400` (Bad Request).
	if (!userInfo.name || !userInfo.bio) {
		res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' });
	} else {
        users.push(userInfo);
        // If the information about the _user_ is valid
        // respond with HTTP status code `201` (Created).
		if (users.includes(userInfo)) {
            res.status(201).json(users);
            // If there's an error while saving the _user_:
            // respond with HTTP status code `500` (Server Error).
		} else {
			res.status(500).json({ errorMessage: 'There was an error while saving the user to the database' });
		}
	}
});

// When the client makes a `GET` request to `/api/users`:
server.get('/api/users', (req, res) => {
    // If there's an error in retrieving the _users_ from the database:
	if (users === null || users === undefined || users.length === 0) {
		res.status(500).json({ errorMessage: 'The users information could not be retrieved.' });
	} else {
		res.status(200).json(users);
	}
});

// When the client makes a `GET` request to `/api/users/:id`:
server.get('/api/users/:id', (req, res) => {
	const id = req.params.id;

	let user = users.filter((item) => item.id === id);

	if (user === null || user === undefined) {
        //If there's an error in retrieving the _user_ from the database:
		res.status(500).json({ errorMessage: 'The users information could not be retrieved.' });
	} else if (user.length === 0) {
        // If the _user_ with the specified `id` is not found:
		res.status(404).json({ message: 'The user with the specified ID does not exist.' });
	} else {
		res.status(200).json(user);
	}
});

// When the client makes a `DELETE` request to `/api/users/:id`:
server.delete('/api/users/:id', (req, res) => {
	const id = req.params.id;

	function findID(item) {
		if (item.id.toLowerCase() === id.toLowerCase()) {
			return item;
		}
	}
	const user = users.find(findID);

	if (user) {
		users = users.filter((item) => item !== user);
		res.status(200).json(users);
	} else {
        // If the _user_ with the specified `id` is not found:
        // respond with HTTP status code `404` (Not Found).
		res.status(404).json({ message: 'The user with the specified ID does not exist.' });
	}
});

// When the client makes a `PUT` request to `/api/users/:id`:
server.put('/api/users/:id', (req, res) => {
	const id = req.params.id;
	const filtered = users.filter((item) => item.id !== id);
	const updateUser = req.body;

	if (filtered.length === 0) {
       // If the _user_ with the specified `id` is not found:
		res.status(404).json({ message: 'The user with the specified ID does not exist.' });
	} else if (!updateUser.name || !updateUser.bio) {
        // If the request body is missing the `name` or `bio` property:
		res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' });
	} else if (updateUser.name && updateUser.bio) {
		const updated = users.map((item) => {
			if (item.id === id) {
				return {
					...item,
					name: updateUser.name,
					bio: updateUser.bio
				};
			} else {
				return item;
			}
		});
        users = updated;
        // If the user is found and the new information is valid:
		res.status(200).json(users);
	} else {
        // If there's an error when updating the _user_:
		res.status(500).json({ errorMessage: 'The user information could not be modified.' });
	}
});
