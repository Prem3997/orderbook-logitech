export const numberWithCommas = (x) => {
  x = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
  return x;
};

export const formatAsks = (asks) => {
  return (
    asks &&
    Object.keys(asks)
      .slice(0, 21)
      .reduce((acc, k, i) => {
        const total = Object.keys(asks)
          .slice(0, i + 1)
          .reduce((t, i) => {
            t = t + asks[i].amount;
            return t;
          }, 0);
        const item = asks[k];
        acc[k] = { ...item, total };
        return acc;
      }, {})
  );
};

export const getMaximumAsksTotal = (_asks) => {
  return Object.keys(_asks).reduce((t, i) => {
    if (t < _asks[i].total) {
      return _asks[i].total;
    } else {
      return t;
    }
  }, 0);
};

export const formatBids = (bids) => {
  return (
    bids &&
    Object.keys(bids)
      .slice(0, 21)
      .reduce((acc, k, i) => {
        const total = Object.keys(bids)
          .slice(0, i + 1)
          .reduce((t, i) => {
            t = t + bids[i].amount;
            return t;
          }, 0);
        const item = bids[k];
        acc[k] = { ...item, total };
        return acc;
      }, {})
  );
};

export const getMaximumBidsTotal = (_bids) => {
  return Object.keys(_bids).reduce((t, i) => {
    if (t < _bids[i].total) {
      return _bids[i].total;
    } else {
      return t;
    }
  }, 0);
};
