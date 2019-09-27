import React from "react";
import { connect } from "react-redux";
import { updateExcludedLadders } from "../../../actions/market";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  appBar: {
    background: "#303030",
    color: "orange",
    fontWeight: "900",
    border: "2px solid #fff"
  },
  title: {
    textAlign: "center",
    fontWeight: "bold"
  },
  group: {
    margin: theme.spacing(1, 0)
  }
}));

const Ladder = props => {
  const classes = useStyles();

  const getLadderData = ladder => {

    if (ladder === undefined) {
      return {}
    }

    const data = {
      ltp: ladder.ltp
    };

    data.atb = ladder.atb ? ladder.atb[0][0] : null;
    data.atl = ladder.atl ? ladder.atl[0][0] : null;

    return data;
  };

  const renderRunners = () => {
    // values of ladder order are the keys of props.ladder
    return Object.values(props.ladderOrder).map(value => {
      
      const { atb, atl, ltp } = getLadderData(props.ladder[value]);

      var color =
        ltp ? ltp[0] < ltp[1] ? "#0AFD03" : ltp[0] > ltp[1] ? "#FC0700" : "#FFFF00";
        
        console.log(`atl: ${atl}`);

      return (
        <tr>
          <td>{props.runners[value].runnerName}</td>
          <td>{atl}</td>
          <td style={{ background: color }}>{ltp[0]}</td>
          <td>{atb}</td>
          <td>
            <input 
              type="checkbox" 
              checked={props.excludedLadders.indexOf(value) === -1} // false automatically omits attribute
              onClick={() => {
                if (props.excludedLadders.indexOf(value) === -1) {
                  props.onChangeExcluded(props.excludedLadders.concat(value))
                } else {
                  props.onChangeExcluded(props.excludedLadders.filter(item => item !== value))
                }
              }} />
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
      {props.marketOpen ?
      <table id="menu-ladder">
        <tbody>{renderRunners()}</tbody>
      </table>
      : null}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    marketOpen: state.market.marketOpen,
    market: state.market.currentMarket,
    ladder: state.market.ladder,
    runners: state.market.runners,
    excludedLadders: state.market.excludedLadders,
    ladderOrder: state.market.ladderOrder,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeExcluded: excludedLadders => dispatch(updateExcludedLadders(excludedLadders))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Ladder);
