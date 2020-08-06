const notValid = (updates, allowUpdates) => {
  for (let i in updates) {
    if (!allowUpdates.includes(updates[i])) {
      return true;
    }
  }
};

module.exports = notValid;
