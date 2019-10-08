export default function selectionCommit(vm, range) {
	setTimeout(async () => {
		vm.socket.emit('QUILL_NEW_SELECT', {
			range: range,
			numBlock: vm.numBlock,
			numSubBlock: vm.numSubBlock,
			numSubSubBlock: vm.numSubSubBlock,
			cursorId: await vm.getUserName()
		});
	}, vm.timeout);
}
