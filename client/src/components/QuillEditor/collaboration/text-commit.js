export default async function textCommit(vm, delta) {
	// setTimeout(async () => { // bubling tick function (=>$emit)
	const cursor = { range: vm.editor.getSelection(), cursorId: await vm.getUserName() };
	await vm.$emit('edit', vm.editor, delta, cursor, vm.numBlock, vm.numSubBlock, vm.numSubSubBlock);
	// }, vm.timeout);
}
