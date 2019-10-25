

const isValidPrice = price => {
    if (typeof price === "number" && price >= 1.01 && price <= 1000) {
        return true;
    }
    return false;
}

export { isValidPrice };