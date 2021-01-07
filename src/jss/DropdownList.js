const dropdownRunnerStyle = () => ({
  runnerList: {
    '& ul': {
      paddingTop: 0,
      paddingBottom: 0,
    },
    '& li': {
      margin: 0,
    },
  },
  runnerItem: {
    margin: 0,
    '& .Mui-selected': {
      margin: 0,
      padding: 0,
    },
  },
  selectedRunner: {
    '& span': {
      color: '#c7c2c2',
      fontFamily: "'Roboto'",
      fontWeight: '400',
    },
    '& p': {
      color: '#c7c2c2',
      fontFamily: "'Roboto'",
      fontWeight: '700',
    },
  },
});

export default dropdownRunnerStyle;
