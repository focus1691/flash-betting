import React from "react";
import { connect } from "react-redux";

const MarketInfo = props => {

  const createData = (name, description) => {
    return { name, description };
  };

  const racerDetails = () => {
    const rows = [
      createData("Selection", props.selection.metadata.runnerId),
      createData("Silk", <img src={`https://content-cache.cdnbf.net/feeds_images/Horses/SilkColours/${props.selection.metadata.COLOURS_FILENAME}`} alt="" />),
      createData("Trainer Name", props.selection.metadata.TRAINER_NAME),
      createData("Age & Weight", `${props.selection.metadata.AGE} years / ${props.selection.metadata.WEIGHT_VALUE} ${props.selection.metadata.WEIGHT_UNITS}`),
      createData("Form", props.selection.metadata.FORM),
      createData("Days Since Last Run", props.selection.metadata.DAYS_SINCE_LAST_RUN),
      createData("Jockey's Claim", props.selection.metadata.JOCKEY_CLAIM),
      createData("Wearing Equipment", props.selection.metadata.COLOURS_DESCRIPTION),
      createData("Saddle Cloth Number", props.selection.metadata.CLOTH_NUMBER),
      createData("Stall Draw", props.selection.metadata.STALL_DRAW),
      createData("Owner Name", props.selection.metadata.OWNER_NAME),
      createData("Jockey Name", props.selection.metadata.JOCKEY_NAME),
      createData("Colour of Horse", props.selection.metadata.COLOUR_TYPE),
      createData("Gender", props.selection.metadata.SEX_TYPE),
      createData("Forecast Price", `${props.selection.metadata.FORECASTPRICE_NUMERATOR}/${props.selection.metadata.FORECASTPRICE_DENOMINATOR}`),
      createData("Official Rating", props.selection.metadata.OFFICIAL_RATING),
    ]
    return rows;
  };

  const renderRacerDetails = () => {
    return (
      <React.Fragment>
        <tr key={`market-info-${props.selection.metadata.CLOTH_NUMBER}.${props.selection.runnerName}`}>
          <td>{`${props.selection.metadata.CLOTH_NUMBER}.${props.selection.runnerName}`}</td>
        </tr>
        {racerDetails().map((row => {
          return (
            <>
              <tr key={`market-info-name-${props.selection.metadata.CLOTH_NUMBER}.${props.selection.runnerName}`}>
                <td>{row.name}</td>
              </tr>
              <tr key={`market-info-description-${props.selection.metadata.CLOTH_NUMBER}.${props.selection.runnerName}`}>
                <td>{row.description}</td>
              </tr>
            </>
          );
        }))}
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
