import React from 'react';
import ReactDOM from 'react-dom';
import Ladder from './Ladder';
import Faker from 'faker';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:8000');

const App = () => {
	return createLadder();
};

const createLadder = () => {
	var randomName = Faker.name.findName();
	console.log(randomName);
	return (
		<div>
		<UserItem name="josh" balance="224"/>
		<Ladder/>
		<Ladder/>
		</div>
	);
};

ReactDOM.render(<App/>, document.querySelector('#root'));