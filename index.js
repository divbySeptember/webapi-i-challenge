// implement your API here
const express = require('express');

const db = require('./data/db.js');

const server = express();

server.use(express.json()); 

server.post('/users', (req, res) => {
	const userInfo = req.body;
	if (!userInfo.name || !userInfo.bio) {
		return res.status(404).json({errorMessage: "Please provide name and bio for user"})
	}
	db
		.insert(userInfo)
		.then((user) => {
			res.status(201).json(user)
		})
		.catch((err) => {
			res.status(500).json({ error: "There was an error while saving the user to the database" });
		});
});

server.get('/users', (req, res) => {
	db
		.find()
		.then((users) => {
			res.status(200).json(users);
		})
		.catch((error) => {
			res.status(500).json({ error: 'The users information could not be retrieved.' });
		});
});

server.get('/users/:id', (req, res) => {
	const id = req.params.id;
	db
		.findById(id)
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((error) => {
			res.status(500).json({ message: 'The user with the specified ID does not exist.' });
		});
});

server.delete('/api/users/:id', (req, res) => {
	const userId = req.params.id;
	db
		.findById(userId)
		.then((response) => {
			db
				.remove(userId)
				.then(() => res.status(200).json(response))
				.catch(() => res.status(500).json({ error: 'The user could not be removed' }));
		})
		.catch((error) => res.status(404).json({ message: 'The user with the specified ID does not exist' }));
});

server.put('/users/:id', (req, res) => {
	const { id } = req.params;
	const user = req.body;
	console.log(id)

	if (!id){
		return res.status(404).json( { message: "The user with the specified ID does not exist."})
	}
	else if (!user.name || !user.bio) {
		return res.status(400).json({errorMessage: "Please provide name and bio for user"})
	}
	
	db
	.update(id, user)
	.then(updated => {
        
            res.status(200).json(updated)
	})
	.catch(error=> {
		res.status(500).json({ error: "The user information could not be modified." })
	})
		
});

server.listen(4000, () => {
	console.log('\n** API up and running on port 4k **');
});