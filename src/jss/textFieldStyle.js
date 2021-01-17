const textFieldStyle = {
  '& > div': {
    '& input[type=number]': {
      color: '#c7c2c2',
      fontFamily: 'Roboto',
      fontWeight: '700',
    },
  },
  '& label': {
    color: '#c7c2c2',
    fontWeight: '300',
    fontFamily: 'Roboto',
  },
  '& .Mui-focused': {
    color: '#B7F5BA',
    fontWeight: '700',
  },
  '& .MuiInput-underline:after': {
    borderBottom: '2px solid #B7F5BA',
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    borderBottom: '1px solid #e6f2e6',
  },
};

export default textFieldStyle;
