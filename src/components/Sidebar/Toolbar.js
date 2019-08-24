import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/settings';

const Toolbar = props => {

	const handleClick = (view) => {
		props.onViewChange(view);
	};

	return (
		<div id="toolbar">
			<button onClick={e => handleClick("HomeView")}><img alt={"Training"} src={window.location.origin + '/icons/graduated.png'}/></button>
			<button onClick={e => handleClick("HomeView")}><img alt={"Sort"} src={window.location.origin + '/icons/sort-up.png'}/></button>
			<button onClick={e => handleClick("HomeView")}><img alt={"Home"} src={window.location.origin + '/icons/homepage.png'}/></button>
			<button onClick={e => handleClick("LadderView")}><img alt={"Ladder"} src={window.location.origin + '/icons/menu-button-of-three-vertical-lines.png'}/></button>
			<button onClick={e => handleClick("GridView")}><img alt={"Grid"} src={window.location.origin + '/icons/menu-button-of-three-horizontal-lines.png'}/></button>
		</div>
	);
}

const mapStateToProps = state => {
	return {
		view: state.settings.view
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onViewChange: view => dispatch(actions.setActiveView(view))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);