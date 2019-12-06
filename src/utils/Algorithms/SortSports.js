const sortSports = sports => {
    return sports.sort((a, b) => {
        let nameA = a.eventType.name.toLowerCase(), nameB = b.eventType.name.toLowerCase();
        if (nameA < nameB) //sort string ascending
            return -1;
        if (nameA > nameB)
            return 1;
        return 0; //default return value (no sorting)
    });
};


export { sortSports };
