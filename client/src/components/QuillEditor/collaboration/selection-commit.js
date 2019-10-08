export default function selectionCommit(vm, range) {
	setTimeout(async () => {
		const selection = vm.editor.getSelection();
		if (!selection) return;
		vm.socket.emit('QUILL_NEW_SELECT', {
			range: range,
			numBlock: vm.numBlock,
			numSubBlock: vm.numSubBlock,
			numSubSubBlock: vm.numSubSubBlock,
			cursorId: await vm.getUserName()
		});
	}, vm.timeout);
}
