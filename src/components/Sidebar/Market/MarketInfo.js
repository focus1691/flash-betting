import React, { useEffect } from "react";
import { connect } from "react-redux";

const MarketInfo = props => {

  const getRacerDetails = () => {
    const details = {
      selectionId: props.selection.runnerId,
      colours: props.selection.COLOURS_DESCRIPTION,
      colorsFileName: props.selection.COLOURS_FILENAME,
      trainer: props.selection.TRAINER_NAME,
      ageWeight: `${props.selection.AGE} years / ${props.selection.WEIGHT_VALUE} ${props.selection.WEIGHT_UNITS}`,
      form: props.selection.form,
      lastRun: props.selection.DAYS_SINCE_LAST_RUN,
      jockeysClaim: props.selection.JOCKEY_CLAIM,
      clothNumber: props.selection.CLOTH_NUMBER
    };
    return details;
  };

  const renderRacerDetails = () => {
      const {
        selectionId,
        colours,
        colorsFileName,
        trainer,
        ageWeight,
        form,
        lastRun,
        jockeysClaim,
        clothNumber
      } = getRacerDetails();

      return (
        <React.Fragment>
          <tr>
            <td>{"Horse name here"}</td>
          </tr>
          <tr>
            <td>{"Selection"}</td>
          </tr>
          <tr>
            <td>{selectionId}</td>
          </tr>
          <tr>
            <td>{"Silk"}</td>
          </tr>
          <tr>
            <td>{colours}</td>
          </tr>
          <tr>
            <td>{"Trainer name"}</td>
          </tr>
          <tr>
            <td>{trainer}</td>
          </tr>
          <tr>
            <td>{"Age & Weight"}</td>
          </tr>
          <tr>
            <td>{ageWeight}</td>
          </tr>
          <tr>
            <td>{"Form"}</td>
          </tr>
          <tr>
            <td>{form}</td>
          </tr>
          <tr>
            <td>{"Days since last run"}</td>
          </tr>
          <tr>
            <td>{lastRun}</td>
          </tr>
          <tr>
            <td>{"Jockey's claim"}</td>
          </tr>
          <tr>
            <td>{jockeysClaim}</td>
          </tr>
          <tr>
            <td>{"Wearing Equipment"}</td>
          </tr>
          <tr>
            <td>{colours}</td>
          </tr>
          <tr>
            <td>{"Saddle cloth number"}</td>
          </tr>
          <tr>
            <td>{clothNumber}</td>
          </tr>
        </React.Fragment>
      );
  };

  return (
    <table id="menu-market-info">
      <tbody>
        {props.marketOpen &&
        props.market.eventType &&
        props.market.eventType.id === "7"
          ? renderRacerDetails()
          : null}
      </tbody>
    </table>
  );
};

const mapStateToProps = state => {
  return {
    market: state.market.currentMarket,
    marketOpen: state.market.marketOpen,
    selection: state.market.runnerSelection
  };
};

export default connect(mapStateToProps)(MarketInfo);
