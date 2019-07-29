import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import Login from './tpages/Login/Login';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:8000');
const App = () => {
	return (
		<div style={{justifyContent: 'center', display: "flex"}}>
			<Route path='/' component = {Login} />
		</div>
	)
};


ReactDOM.render((
	<BrowserRouter>
	  <App />
	</BrowserRouter>
), document.getElementById('root'));