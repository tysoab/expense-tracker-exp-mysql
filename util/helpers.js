exports.numberFormat = (number) => {
  return new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "NGN",
  }).format(number);
};

exports.convertToDeg = (obtained, allNumbers = []) => {
  const total = allNumbers.reduce((acc, curr) => acc + curr, 0);
  const percent = (obtained * 100) / total;
  const degree = Math.round((percent / 100) * 360);
  return degree;
};

exports.calAverage = (obtained, allNumbers = []) => {
  const total = allNumbers.reduce((acc, curr) => acc + curr, 0);
  const percent = Math.round((obtained * 100) / total);
  return percent;
};
