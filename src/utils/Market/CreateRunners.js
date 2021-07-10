export const CreateRunners = (data) => {
  const runners = {};
  for (let i = 0; i < data.length; i += 1) {
    const { selectionId } = data[i];
    runners[selectionId] = data[i];

    if (runners[selectionId].metadata.CLOTH_NUMBER) {
      // Sometimes the runner name can contain the horse number with the name (U.S races) so strip the number
      runners[selectionId].runnerName = runners[selectionId].runnerName.replace(/[0-9.]*[.,\s]/g, ' ').trim();
    }

    // The Stake/Liability buttons for the GridView
    runners[selectionId].order = {
      visible: false,
      side: 'BACK',
      stakeLiability: 0,
      stake: 2,
      customStake: '',
      price: 0,
    };
  }
  return runners;
};
