exports.numberFormat = (number) => {
  return new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "NGN",
  }).format(number);
};
