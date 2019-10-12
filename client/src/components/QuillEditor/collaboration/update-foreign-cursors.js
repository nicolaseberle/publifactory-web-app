export default function updateForeignCursors(vm, delta) {
	const range = vm.editor.getSelection();
	updateRange(vm, getForwardCursors(vm, range.index), getIndexShif(delta));
}

/**
 * Return cursors when foreign cursor are after localSelection
 */
function getForwardCursors(vm, localIndex) {
	return vm.cursorModule.cursors().filter(cursor => {
		return localIndex < cursor.range.index;
	});
}

/**
 * Update range on forwardCursors
 */
function updateRange(vm, forwardCursors, indexShift) {
	forwardCursors.map(cursor => {
		vm.cursorModule.moveCursor(cursor.id, {
			...cursor.range,
			index: cursor.range.index + indexShift
		});
	});
	vm.cursorModule.update();
}

/**
 * Reducing the number of deletion or addition in the Delta
 */
function getIndexShif(delta) {
	const reducedDelta = delta.reduce((acc, currOp) => {
		if (!currOp.insert && !currOp.delete) {
			return acc;
		}
		acc += currOp.insert ? currOp.insert.length : -currOp.delete;
		return acc;
	}, 0);
	return reducedDelta;
}
