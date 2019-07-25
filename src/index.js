import React from 'react';
import ReactDOM from 'react-dom';
import Ladder from './Ladder';

const App = () => {
	return createLadder();
};

const createLadder = () => {
	return (
		<div>
		<Ladder/>
		<Ladder/>
		</div>
	);
};

ReactDOM.render(<App/>, document.querySelector('#root'));