const userChip = (theme) => ({
    background: '#D3D44F',
    color: '#121212',
    font: 'normal normal bold medium Roboto',
    padding: theme.spacing(1),
    filter: 'blur(4px)',
    '&:hover': {
      filter: 'blur(0px)',
    },
  });
  
  export default userChip;
  