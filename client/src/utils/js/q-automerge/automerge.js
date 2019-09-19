export const Automerge = require('automerge')
window.Automerge = Automerge

export const {
  Text,
  Counter,
  Table,
  init,
  from,
  merge,
  change,
  emptyChange,
  applyChanges,
  diff,
  equals,
  getActorId,
  getChanges,
  getConflicts,
  getHistory,
  getMissingDeps,
  getObjectById,
  getObjectId,
  load,
  save,
  canRedo,
  canUndo,
  redo,
  undo
} = window.Automerge
