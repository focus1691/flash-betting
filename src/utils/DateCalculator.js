

const isPremiumActive = (now, end) => {
    if (!end) {
        return false;
    }

    end = new Date(end);

    const timeDiff  = end - now;
    const daysLeft      = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return daysLeft > 0;
};

const getDate30DaysAhead = () => {
    const now = new Date();

    if (now.getMonth() == 11) {
        return new Date(now.getFullYear() + 1, 0, 1);
    } else {
        return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    }
}

export { isPremiumActive, getDate30DaysAhead };