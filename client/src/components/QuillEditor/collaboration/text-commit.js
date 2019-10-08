export default async function textCommit(vm, delta) {
	const cursor = { range: vm.editor.getSelection(), cursorId: await vm.getUserName() };
	setTimeout(async () => {
		await vm.$emit(
			'edit',
			vm.editor,
			delta,
			cursor,
			vm.numBlock,
			vm.numSubBlock,
			vm.numSubSubBlock
		);
	}, vm.timeout);
}
