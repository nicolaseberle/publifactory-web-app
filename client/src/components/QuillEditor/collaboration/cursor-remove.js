export default async function cursorRemove(vm) {
	console.log('sending remove quill select');
	vm.socket.emit('REMOVE_QUILL_SELECT', {
		cursorId: await vm.getUserName(),
		numBlock: vm.numBlock,
		numSubBlock: vm.numSubBlock,
		numSubSubBlock: vm.numSubSubBlock
	});
}
