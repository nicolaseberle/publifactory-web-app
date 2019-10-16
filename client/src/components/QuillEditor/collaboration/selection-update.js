export default async function selectionUpdate(vm, data) {
	const cursorId = await vm.getUserName();
	if (vm.sameBlock(data)) {
		if (cursorId !== data.cursorId) {
			const cursor = vm.cursorModule.cursors().find(cursor => {
				return cursor.id === data.cursorId;
			});
			if (!cursor) {
				vm.cursorModule.createCursor(`${data.cursorId}`, data.cursorId, vm.chooseColors());
				vm.cursorModule.moveCursor(data.cursorId, data.range);
			} else {
				vm.cursorModule.moveCursor(cursor.id, data.range);
			}
		}
	}
}
