

const findIndex = (ladders, selectionId) => {
   return ladders.findIndex(ladder => ladder.id === selectionId);
};

const isLadderExists = (ladders, selectionId) => {
   let index = ladders.findIndex(ladder => ladder.id === selectionId);
   return index !== -1;
};

export { isLadderExists, findIndex };