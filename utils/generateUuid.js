const { uuidv7 } = require("uuidv7");
const uuid = uuidv7();

const generateUuid = () => {
  return uuid;
};

module.exports = generateUuid;
