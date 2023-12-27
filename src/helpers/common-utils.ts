const isNullorUndefined = (x: any) => {
  if (x === null || x === "undefined" || x === undefined) {
    return true;
  }
  return false;
};

const isDefined = (x: any) => {
  return !isNullorUndefined(x);
};

const isEmptyObject = (o: any): boolean => {
  return !!o && Object.keys(o).length === 0 && o.constructor === Object;
};

function getSecondsSinceEpoch() {
  let date = new Date();
  let utcDate = new Date(date.toUTCString());
  return Math.floor(utcDate.getTime() / 1000);
}

export const CommonUtils = {
  isNullorUndefined,
  isDefined,
  isEmptyObject,
  getSecondsSinceEpoch,
};
