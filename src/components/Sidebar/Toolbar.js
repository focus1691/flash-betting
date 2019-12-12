import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/settings';

const Toolbar = props => {
	
	const handleClick = view => e => {
		props.onViewChange(view);
	};

	const toggleFullScreen = view => e => {
		props.onToggleFullscreen(!props.fullscreen);
	};

	return (
		<div id="toolbar">
			<button onClick={handleClick("TrainingView")} style={props.view === 'TrainingView' ? {background: '#389C41'} : {}}>
				<img alt={"Training"} src={window.location.origin + '/icons/graduated.png'}/>
			</button>
			<button onClick={toggleFullScreen()} style={props.fullscreen ? {background: '#389C41'} : {} }>
				<img alt={"Hide"} src={window.location.origin + '/icons/sort-up.png'}/>
			</button>
			<button onClick={handleClick("HomeView")} style={props.view === 'HomeView' ? {background: '#389C41'} : {}}>
				<img alt={"Home"} src={window.location.origin + '/icons/homepage.png'}/>
			</button>
			<button onClick={props.premiumMember ? handleClick("LadderView") : props.openPremiumDialog(true) } style={props.view === 'LadderView' ? {background: '#389C41'} : {}}>
				<img alt={"Ladder"} src={window.location.origin + '/icons/menu-button-of-three-vertical-lines.png'}/>
			</button>
			<button onClick={handleClick("GridView")} style={props.view === 'GridView' ? {background: '#389C41'} : {}}>
				<img alt={"Grid"} src={window.location.origin + '/icons/menu-button-of-three-horizontal-lines.png'}/>
			</button>
		</div>
	);
}

const mapStateToProps = state => {
	return {
		view: state.settings.view,
		fullscreen: state.settings.fullscreen,
		premiumMember: state.settings.premiumMember
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onViewChange: view => dispatch(actions.setActiveView(view)),
		onToggleFullscreen: fullscreenSelected => dispatch(actions.setFullscreen(fullscreenSelected)),
		openPremiumDialog: open => e => dispatch(actions.openPremiumDialog(open))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);