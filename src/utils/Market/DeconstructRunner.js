import { iconForEvent } from './EventIcons';

/**
 * This function is used to deconstruct the runner's data
 * @param {object} runner - Ladder information for a runner
 * @return {data} The deconstructed runner
 */
export const DeconstructRunner = (runner, sportId) => {
  if (!runner) {
    return {
      name: '',
      number: '',
      logo: '',
      order: {},
    };
  }

  const data = {
    name: runner.runnerName,
    number: runner.metadata.CLOTH_NUMBER
      ? `${runner.metadata.CLOTH_NUMBER}. `
      : '',
    logo:
      runner.metadata.COLOURS_FILENAME && sportId == 7
        ? `https://content-cache.cdnbf.net/feeds_images/Horses/SilkColours/${runner.metadata.COLOURS_FILENAME}`
        : iconForEvent(sportId),
    order: runner.order,
  };
  return data;
};

export const getTrainerAndJockey = (runner) => {
  if (runner && runner.metadata && runner.metadata.TRAINER_NAME && runner.metadata.JOCKEY_NAME) {
    const { TRAINER_NAME, JOCKEY_NAME } = runner.metadata;
    return `${TRAINER_NAME}, ${JOCKEY_NAME}`;
  }
  return null;
};
