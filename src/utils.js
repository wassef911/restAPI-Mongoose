const Valid = (updates, allowUpdates) => {
  let check = true;
  for (let i in updates) if (!allowUpdates.includes(updates[i])) check = false;
  return check;
};

module.exports = Valid;
