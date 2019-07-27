import React from 'react';
import ReactDOM from 'react-dom';
import Ladder from './Ladder';
var faker = require('faker');

const App = () => {
	return createLadder();
};

const createLadder = () => {
	var randomName = faker.name.findName();
	console.log(randomName);
	return (
		<div>
		<Ladder/>
		<Ladder/>
		</div>
	);
};

ReactDOM.render(<App/>, document.querySelector('#root'));