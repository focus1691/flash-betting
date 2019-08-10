import React from 'react';

const Toolbar = () => {
	return (
		<div id="toolbar">
			<button><img src={window.location.origin + '/icons/graduated.png'}/></button>
			<button><img src={window.location.origin + '/icons/sort-up.png'}/></button>
			<button><img src={window.location.origin + '/icons/homepage.png'}/></button>
			<button><img src={window.location.origin + '/icons/menu-button-of-three-vertical-lines.png'}/></button>
			<button><img src={window.location.origin + '/icons/menu-button-of-three-horizontal-lines.png'}/></button>
		</div>
	);
}

export default Toolbar;