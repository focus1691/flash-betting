const CreateRunners = data => {
    const runners = {};
    for (let i = 0; i < data.length; i++) {
      let selectionId = data[i].selectionId;
      runners[selectionId] = data[i];

      if (runners[selectionId].metadata.CLOTH_NUMBER) {
        runners[selectionId].runnerName = runners[selectionId].runnerName.replace(/[0-9.]*[.,\s]/g, ' ').trim();
      }

      // The Stake/Liability buttons for the GridView
      runners[selectionId].order = {
        visible: false,
        backLay: 0,
        stakeLiability: 0,
        stake: 2,
        price: 0
      };
    }
    return runners;
  };
  
  export { CreateRunners };