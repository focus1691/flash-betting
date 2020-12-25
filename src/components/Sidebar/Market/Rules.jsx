import parse from 'html-react-parser';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
//* JSS
import useStyles from '../../../jss/components/Sidebar/market/rulesStyle';

const Rules = ({ description }) => {
  const classes = useStyles();
  const [rules, setRules] = useState(null);

  useEffect(() => {
    if (description) {
      setRules(description.rules);
    }
  }, [description]);

  return (
    <div className={classes.rules}>
      {rules ? parse(rules.toString()) : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  description: state.market.description,
});

export default connect(mapStateToProps)(Rules);
