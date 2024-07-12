const bcrypt = require("bcrypt");

const saltRounds = 10;

const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hash) => {
  const result = await bcrypt.compare(password, hash);
  return result;
};

module.exports = { hashPassword, comparePassword };
