export default function updateForeignCursors(vm, delta) {
	const range = vm.editor.getSelection();

	updateRange(vm, vm.lastRange, range, getForwardCursors(vm, vm.lastRange), getIndexShift(delta));
	vm.lastRange = range;
}

/**
 * Return cursors when foreign cursor are after localSelection
 */
function getForwardCursors(vm, localRange) {
	return vm.cursorModule.cursors().filter(cursor => {
		// console.log(JSON.stringify(localRange.index), JSON.stringify(cursor.range));
		// console.log('FOREIGN IS IN INTERVAL=>', isInInterval(localRange.index, cursor.range));
		// console.log('Foreign is surround=>', isSurrounded(localRange, cursor.range));
		return (
			localRange.index <= cursor.range.index ||
			isInInterval(localRange.index, cursor.range) ||
			isSurrounded(localRange, cursor.range)
		);
	});
}

function isSurrounded(localRange, range) {
	return (
		localRange.length !== 0 && localRange.index <= range.index && localRange.length >= range.length
	);
}

function isInInterval(localIndex, range) {
	return (
		localIndex >= range.index && range.length + range.index >= localIndex && range.length !== 0
	);
}

/**
 * Update range on forwardCursors
 */
function updateRange(vm, lastRange, localRange, forwardCursors, indexShift) {
	forwardCursors.map(cursor => {
		if (isSurrounded(lastRange, cursor.range)) {
			vm.cursorModule.moveCursor(cursor.id, {
				length: 0,
				index: localRange.index
			});
		} else if (isInInterval(lastRange.index, cursor.range) && cursor.range.length !== 0) {
			vm.cursorModule.moveCursor(cursor.id, {
				...cursor.range,
				length: cursor.range.length + indexShift
			});
		} else {
			vm.cursorModule.moveCursor(cursor.id, {
				...cursor.range,
				index: cursor.range.index + indexShift
			});
		}
	});
	vm.cursorModule.update();
}

/**
 * Reducing the number of deletion or addition in the Delta
 */
function getIndexShift(delta) {
	const reducedDelta = delta.reduce((acc, currOp) => {
		if (!currOp.insert && !currOp.delete) {
			return acc;
		}
		acc += currOp.insert ? currOp.insert.length : -currOp.delete;
		return acc;
	}, 0);
	return reducedDelta;
}
