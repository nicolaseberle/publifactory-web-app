export default function updateForeignCursors(vm, delta) {
	const range = vm.editor.getSelection();
	console.log(vm.lastRange);
	const test = JSON.stringify(vm.lastRange);
	vm.lastRange = range;
	const forwardCursors = checkCursorPosition(vm, range);
	if (forwardCursors) {
		console.log(forwardCursors.length);
	}
	const t = typeOfDelta(delta);
	console.log('REDUCED=>', t);
	console.log(JSON.stringify(delta));
	console.log('DIFF', JSON.stringify(range), test);
}
/**
 * Return cursors where localSelection range < foreign cursor range
 */
function checkCursorPosition(vm, localRange) {
	return vm.cursorModule.cursors().filter(cursor => localRange < cursor.range);
}

/**
 * Update range on forwardCursors
 */
function updateRange(vm, forwardCursors) {}

/**
 * If Insertion || Deletion
 */
function typeOfDelta(delta) {
	const reducedDelta = delta.reduce(
		(acc, currOp) => {
			if (currOp.insert)
				return {
					...acc,
					insert: (acc.insert += currOp.insert.length)
				};
			else if (currOp.delete)
				return {
					...acc,
					delete: acc.delete + currOp.delete
				};
			else return acc;
		},
		{ insert: 0, delete: 0 }
	);
	// const type = Object.values(_).reduce((acc, op) => {
	// 	console.log('acc=>', acc);
	// 	if (op.insert) acc += op.insert;
	// 	else if (op.delete) acc -= op.delete;
	// 	else return acc;
	// }, {});
	console.log('ReducedDelta=>', reducedDelta);
	if (reducedDelta.insert > reducedDelta.delete)
		return { insert: reducedDelta.insert - reducedDelta.delete };
	if (reducedDelta.insert < reducedDelta.delete)
		return { delete: reducedDelta.delete - reducedDelta.insert };
	return 0;
}
