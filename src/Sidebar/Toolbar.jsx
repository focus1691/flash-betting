import React from 'react';

const Toolbar = () => {
	return (
		<div id="toolbar">
			<button><img alt={"Graduated"} src={window.location.origin + '/icons/graduated.png'}/></button>
			<button><img alt={"Sort"} src={window.location.origin + '/icons/sort-up.png'}/></button>
			<button><img alt={"Home"} src={window.location.origin + '/icons/homepage.png'}/></button>
			<button><img alt={"Ladder"} src={window.location.origin + '/icons/menu-button-of-three-vertical-lines.png'}/></button>
			<button><img alt={"Grid"} src={window.location.origin + '/icons/menu-button-of-three-horizontal-lines.png'}/></button>
		</div>
	);
}

export default Toolbar;