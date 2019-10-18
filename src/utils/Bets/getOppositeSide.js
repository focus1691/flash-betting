const getOppositeSide = side => {
    switch (side) {
      case "BACK":
        return "LAY";
      case "LAY":
        return "BACK";
    }
  }

  export { getOppositeSide };