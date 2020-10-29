import parse from 'html-react-parser';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

const Rules = ({ description }) => {
  const [rules, setRules] = useState(null);

  useEffect(() => {
    if (description) {
      setRules(description.rules);
    }
  }, [description]);

  return (
    <div>
      {rules ? parse(rules.toString()) : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  description: state.market.description,
});

export default connect(mapStateToProps)(Rules);
