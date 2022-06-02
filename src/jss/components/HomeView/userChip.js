const userChip = (theme) => ({
    background: '#D3D44F',
    color: '#121212',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    padding: theme.spacing(1),
    '&:hover span': {
      textSecurity: 'none',
      '-webkit-text-security': 'none',
      '-moz-text-security': 'none',
    },
    [theme.breakpoints.down('sm')]: {
      width: '50%',
      padding: '0',
      margin: '0',
    },
  });
  
  export default userChip;
  