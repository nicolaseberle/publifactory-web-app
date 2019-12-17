function roleExist(role) {
	return (
		role === 'user' ||
		role === 'admin' ||
		role === 'associate_editor' ||
		role === 'editor'
	);
}

module.exports = roleExist;
