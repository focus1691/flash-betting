import React from 'react';
import { connect } from 'react-redux';
import useStyles from '../../../jss/components/Sidebar/market/marketInfoStyle';

const createData = (name, description) => ({ name, description });

const MarketInfo = ({ marketOpen, eventType, selection }) => {
  const classes = useStyles();

  const extractRacerDetails = () => {
    const rows = [
      createData('Selection', selection.metadata.runnerId || ''),
      createData('Silk', <img src={selection.metadata.COLOURS_FILENAME ? `https://content-cache.cdnbf.net/feeds_images/Horses/SilkColours/${selection.metadata.COLOURS_FILENAME}` : ''} alt="" />),
      createData('Trainer Name', selection.metadata.TRAINER_NAME || ''),
      createData('Age & Weight', `${selection.metadata.AGE || ''} years / ${selection.metadata.WEIGHT_VALUE || ''} ${selection.metadata.WEIGHT_UNITS || ''}`),
      createData('Form', selection.metadata.FORM || ''),
      createData('Days Since Last Run', selection.metadata.DAYS_SINCE_LAST_RUN || ''),
      createData("Jockey's Claim", selection.metadata.JOCKEY_CLAIM || ''),
      createData('Wearing Equipment', selection.metadata.COLOURS_DESCRIPTION || ''),
      createData('Saddle Cloth Number', selection.metadata.CLOTH_NUMBER || ''),
      createData('Stall Draw', selection.metadata.STALL_DRAW || ''),
      createData('Owner Name', selection.metadata.OWNER_NAME || ''),
      createData('Jockey Name', selection.metadata.JOCKEY_NAME || ''),
      createData('Colour of Horse', selection.metadata.COLOUR_TYPE || ''),
      createData('Gender', selection.metadata.SEX_TYPE || ''),
      createData('Forecast Price', `${selection.metadata.FORECASTPRICE_NUMERATOR || ''}/${selection.metadata.FORECASTPRICE_DENOMINATOR || ''}`),
      createData('Official Rating', selection.metadata.OFFICIAL_RATING || ''),
    ];
    return rows;
  };

  const renderRacerDetails = () => (
    <>
      <tr key={`market-info-${selection.metadata.CLOTH_NUMBER}.${selection.runnerName}`}>
        <td>{`${selection.metadata.CLOTH_NUMBER ? `${selection.metadata.CLOTH_NUMBER}.` : ''}${selection.runnerName}`}</td>
      </tr>
      {extractRacerDetails().map((({ name, description }) => (
        <React.Fragment key={`runner-info-${name}`}>
          <tr key={`market-info-name-${selection.metadata.CLOTH_NUMBER}.${selection.runnerName}`}>
            <td>{name}</td>
          </tr>
          <tr key={`market-info-description-${selection.metadata.CLOTH_NUMBER}.${selection.runnerName}`}>
            <td>{description}</td>
          </tr>
        </React.Fragment>
      )))}
    </>
  );

  return (
    <div className={classes.marketInfo}>
      <table className={classes.table}>
        <tbody>
          {marketOpen
            && eventType
            && eventType.id === '7'
            ? renderRacerDetails()
            : null}
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = (state) => ({
  marketOpen: state.market.marketOpen,
  eventType: state.market.eventType,
  selection: state.market.runnerSelection,
});

export default connect(mapStateToProps)(MarketInfo);
