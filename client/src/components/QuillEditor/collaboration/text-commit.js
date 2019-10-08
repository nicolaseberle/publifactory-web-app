export default function textCommit(vm, delta) {
	setTimeout(async () => {
		const cursor = { range: vm.editor.getSelection(), cursorId: await vm.getUserName() };
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
