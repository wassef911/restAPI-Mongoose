const notValid = (reqBody, allowUpdates) => {
  const updates = Object.keys(reqBody); // returns an array of strings
  for (let i in updates) {
    if (!allowUpdates.includes(updates[i])) {
      return true;
    }
  }
};

module.exports = notValid;
