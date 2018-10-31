const renameObjectProperty = (object, oldName, newName) => {
  if (!Object.prototype.hasOwnProperty.call(object, oldName)) return false;

  const newObject = object;

  newObject[newName] = object[oldName];
  delete newObject[oldName];

  return newObject;
};

module.exports = renameObjectProperty;
