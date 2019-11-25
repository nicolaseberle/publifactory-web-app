export default async function cursorRemove(vm) {
	vm.socket.emit('REMOVE_QUILL_SELECT', {
		cursorId: await vm.getUserName(),
		numBlock: vm.numBlock,
		numSubBlock: vm.numSubBlock,
		numSubSubBlock: vm.numSubSubBlock
	});
}
