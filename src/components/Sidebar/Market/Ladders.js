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

  const deconstructLadder = ladder => {

    if (ladder === undefined) {
      return {}
    }

    const data = {
      ltp: null,
      color: "#FFFFFF"
    };

    if (ladder.ltp && ladder.ltp[0]) {
      data.ltp = ladder.ltp[0];
      data.color = ladder.ltp[0] < ladder.ltp[1] ? "#0AFD03" : ladder.ltp[0] > ladder.ltp[1] ? "#FC0700" : "#FFFF00";
    }

    data.atb = ladder.atb && ladder.atb[0] ? ladder.atb[0][0] : null;
    data.atl = ladder.atl && ladder.atl[0] ? ladder.atl[0][0] : null;

    return data;
  };

  const renderRunners = () => {
    return props.sortedLadder.map(selectionId => {
      const { atb, atl, ltp, color } = deconstructLadder(props.ladder[selectionId]);
      return (
        <tr>
          <td>{props.runners[selectionId].runnerName}</td>
          <td>{atl}</td>
          <td style={{ background: color }}>{ltp}</td>
          <td>{atb}</td>
          <td>
            <input
              type="checkbox"
              checked={props.excludedLadders.indexOf(selectionId) === -1} // false automatically omits attribute
              onClick={() => {
                if (props.excludedLadders.indexOf(selectionId) === -1) {
                  props.onChangeExcluded(props.excludedLadders.concat(selectionId))
                } else {
                  props.onChangeExcluded(props.excludedLadders.filter(item => item !== selectionId))
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
    sortedLadder: state.market.sortedLadder,
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
