const dropdownRunnerStyle = theme => ({
  runnerList: {
    '& ul': {
      paddingTop: 0,
      paddingBottom: 0
    },
    '& li': {
      margin: 0
    }
  },
  runnerItem: {
    margin: 0,
    '& .Mui-selected': {
      margin: 0,
      padding: 0
    }
  }
});

export default dropdownRunnerStyle;