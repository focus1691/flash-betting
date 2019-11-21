const getHorseRaceCountries = horseRaces => {
    if (!horseRaces) return [];
    return Object.keys(horseRaces).filter(ISO => horseRaces[ISO]);
};

export { getHorseRaceCountries };