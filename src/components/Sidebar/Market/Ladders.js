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
      data.atl = sortDes(ladder.atl);
    }

    return data;
  };

	const renderRunners = () => {
		var j = 1;

		return Object.keys(props.ladder).map(key => {
			console.log('j: ', j++);

			const {atb, atl, ltp} = getLadderData(
        props.ladder[key]
      );


			return (
				<tr>
					<td>{props.runners[key].runnerName}</td>
					<td>{atl[atl.length - 1][0]}</td>
					<td>{ltp}</td>
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