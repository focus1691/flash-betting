import { iconForEvent } from "../Market/EventIcons";

/**
 * This function is used to deconstruct the runner's data
 * @param {object} runner - Ladder information for a runner
 * @return {data} The deconstructed runner
 */
const DeconstructRunner = (runner, sportId) => {
  sportId = parseInt(sportId);
  const data = {
    name: runner.runnerName,
    number: runner.metadata.CLOTH_NUMBER
      ? runner.metadata.CLOTH_NUMBER + ". "
      : "",
    logo: 
     runner.metadata.COLOURS_FILENAME && sportId === 7
      ? `https://content-cache.cdnbf.net/feeds_images/Horses/SilkColours/${runner.metadata.COLOURS_FILENAME}`
      : iconForEvent(sportId),
    order: runner.order
  };
  return data;
};

export { DeconstructRunner };
