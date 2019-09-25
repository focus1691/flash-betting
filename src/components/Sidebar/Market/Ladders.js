import React from "react";
import { connect } from "react-redux";
import { updateExcludedLadders } from "../../../actions/market";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import { sortAsc, sortDes } from "../../../utils/Sort";

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
    const data = {
      ltp: ladder.ltp
    };

    data.atb = ladder.atb ? ladder.atb[0][0] : null;
    data.atl = ladder.atl ? ladder.atl[0][0] : null;

    return data;
  };

  const renderRunners = () => {
    return Object.keys(props.ladder).map(key => {
      
      const { atb, atl, ltp } = getLadderData(props.ladder[key]);

      var color =
        ltp[0] < ltp[1] ? "#0AFD03" : ltp[0] > ltp[1] ? "#FC0700" : "#FFFF00";
        
        console.log(`atl: ${atl}`);

      return (
        <tr>
          <td>{props.runners[key].runnerName}</td>
          <td>{atl}</td>
          <td style={{ background: color }}>{ltp[0]}</td>
          <td>{atb}</td>
          <td>
            <input 
              type="checkbox" 
              checked={props.excludedLadders.indexOf(key) === -1} // false automatically omits attribute
              onClick={() => {
                if (props.excludedLadders.indexOf(key) === -1) {
                  props.onChangeExcluded(props.excludedLadders.concat(key))
                } else {
                  props.onChangeExcluded(props.excludedLadders.filter(item => item !== key))
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
      <table id="menu-ladder">
        <tbody>{renderRunners()}</tbody>
      </table>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    marketOpen: state.market.marketOpen,
    market: state.market.currentMarket,
    ladder: state.market.ladder,
    runners: state.market.runners,
    excludedLadders: state.market.excludedLadders
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeExcluded: excludedLadders => dispatch(updateExcludedLadders(excludedLadders))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Ladder);
