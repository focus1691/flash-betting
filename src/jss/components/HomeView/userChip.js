const userChip = (theme) => ({
    background: '#D3D44F',
    color: '#121212',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    padding: theme.spacing(1),
    filter: 'blur(4px)',
    '&:hover': {
      filter: 'blur(0px)',
    },
    [theme.breakpoints.down('sm')]: {
      width: '50%',
      padding: '0',
      margin: '0',
    },
  });
  
  export default userChip;
  