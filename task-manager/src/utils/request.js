const InvalidParameterError = require('../errors/InvalidParameter');

const checkPermit = (body, allowed) => {
  const updates = Object.keys(body);
  const isValidOperation = updates.every((update) => allowed.includes(update));

  if (!isValidOperation) {
    throw new InvalidParameterError();
  }
};

const updateData = (prev, curr) => {
  const updates = Object.keys(curr);

  updates.forEach((update) => (prev[update] = curr[update]));
};

module.exports = {
  checkPermit,
  updateData,
};
