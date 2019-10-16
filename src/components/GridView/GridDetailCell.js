import React from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/market";
import { iconForEvent } from "../../utils/EventIcons";

const GridDetailCell = props => {
  return (
    <td
      className="grid-runner-details"
      onClick={e => {
        props.onSelectRunner(props.runner);
      }}
    >
      <img src={props.logo} onError={e => {
        e.target.onerror = null;
        e.target.src = iconForEvent(parseInt(props.sportId));
      }} />
      <span>{`${props.number}${props.name}`}</span>
      <span style={{ background: props.bg }}>{props.ltp[0] ? props.ltp[0] : ""}</span>
      <span style={{ color: props.PL.color }}>{props.PL.val}</span>
      <span>{props.tv[0] ? Math.floor(props.tv[0]).toLocaleString() : ""}</span>
    </td>
  );
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSelectRunner: runner => dispatch(actions.setRunner(runner))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GridDetailCell);
