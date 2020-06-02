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
	if (!userInfo.name || !userInfo.bio) {
		res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' });
	} else {
		users.push(userInfo);
		if (users.includes(userInfo)) {
			res.status(201).json(users);
		} else {
			res.status(500).json({ errorMessage: 'There was an error while saving the user to the database' });
		}
	}
});

// When the client makes a `GET` request to `/api/users`:
server.get('/api/users', (req, res) => {
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
		res.status(500).json({ errorMessage: 'The users information could not be retrieved.' });
	} else if (user.length === 0) {
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
		res.status(404).json({ message: 'The user with the specified ID does not exist.' });
	}
});

// When the client makes a `PUT` request to `/api/users/:id`:
server.put('/api/users/:id', (req, res) => {
	const id = req.params.id;
	const filtered = users.filter((item) => item.id === id);
	const updateUser = req.body;

	if (filtered.length === 0) {
		res.status(404).json({ message: 'The user with the specified ID does not exist.' });
	} else if (!updateUser.name || !updateUser.bio) {
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
		res.status(200).json(users);
	} else {
		res.status(500).json({ errorMessage: 'The user information could not be modified.' });
	}
});
