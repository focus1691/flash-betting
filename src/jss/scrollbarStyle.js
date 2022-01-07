export default {
  '&::-webkit-scrollbar': {
    width: '10px',
    height: '10px',
  },
  '&::-webkit-scrollbar-track': {
    borderRadius: '12px',
    background: 'linear-gradient(left, #212121, #323232)',
    boxShadow: '0 0 1px 1px #111',
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: '10px',
    background: 'linear-gradient(left, #4A4A4A, #404040)',
    boxShadow: 'inset 0 0 1px 1px #191919',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: 'linear-gradient(left, #555555, #4e4e4e)',
  },
};