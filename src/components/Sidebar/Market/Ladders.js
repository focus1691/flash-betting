import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  appBar: {
    background: "#303030",
    color: "orange",
    fontWeight: "900",
    border: "2px solid #fff",
  },
  title: {
  	textAlign: "center",
  	fontWeight: "bold",
  },
  group: {
    margin: theme.spacing(1, 0),
  }
}));

const Ladder = props => {
	const classes = useStyles();

  const sortAsc = arr => {
    if (arr.length <= 0) return [];

    arr = arr.sort(function(a, b) {
      return a[0] - b[0];
    });
    return arr;
  };

  const sortDes = arr => {
    if (arr.length <= 0) return [];

    arr = arr.sort(function(a, b) {
      return b[0] - a[0];
    });
    return arr;
	};
	
  const getLadderData = ladder => {
    const data = {
      ltp: ladder.ltp
    };

    if (ladder.atb) {
      data.atb = sortDes(ladder.atb);
    }
    if (ladder.atl) {
      data.atl = sortAsc(ladder.atl);
    }

    return data;
  };

	const renderRunners = () => {

		return Object.keys(props.ladder).map(key => {

			const {atb, atl, ltp} = getLadderData(
        props.ladder[key]
			);
			
			var color = ltp[0] < ltp[1] ? "#0AFD03" : ltp[0] > ltp[1] ? "#FC0700" : "#FFFF00"; 
			
			return (
				<tr>
					<td>{props.runners[key].runnerName}</td>
					<td>{atl[0][0]}</td>
					<td style={{background: color}}>{ltp[0]}</td>
					<td>{atb[0][0]}</td>
					<td>
						<input type="checkbox"/>
					</td>
				</tr>

			);
		});
	};

	return (
		<div>
			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
				Ladders
				</Typography>
			</AppBar>
			<table id="menu-ladder">
				<tbody>
					{renderRunners()}
				</tbody>
			</table>
		</div>
	);
};

const mapStateToProps = state => {
	return {
    marketOpen: state.market.marketOpen,
    market: state.market.currentMarket,
    ladder: state.market.ladder,
    runners: state.market.runners
	}
};

export default connect(mapStateToProps)(Ladder);