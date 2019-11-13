const getTrainerAndJockey = data => {
    if (data && data.TRAINER_NAME && data.JOCKEY_NAME) {
        return `${data.TRAINER_NAME}, ${data.JOCKEY_NAME}`;
    }
    return null;
};

export { getTrainerAndJockey };