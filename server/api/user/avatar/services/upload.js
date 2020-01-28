const User = require("../../user.model");
const fs = require("fs");
const uuidv4 = require("uuid/v4");

async function createPath(filePath) {
	return new Promise((resolve, reject) => {
		fs.mkdir(filePath, { recursive: true }, err => {
			if (err) {
				return reject(err);
			}
			return resolve(filePath);
		});
	});
}

async function upload({ userId, avatar }) {
	const user = await User.findById(userId);
	if (!user) throw { code: 400, message: "USER_NOT_FOUND" };
	if (user.avatar) {
		try {
			if (!user.avatar.startsWith("/static")) fs.unlinkSync(`.${user.avatar}`);
		} catch (error) {
			console.log(error);
		}
	}
	const fileName = `${uuidv4()}.png`;
	const filePath = `./server/contents/avatars/${userId}`;
	const urlPath = `${filePath.substring(1)}/${fileName}`;
	await createPath(filePath);
	const rawImage = avatar.split(";base64,").pop();
	fs.writeFileSync(`${filePath}/${fileName}`, rawImage, {
		encoding: "base64"
	});
	user.avatar = urlPath;
	await user.save();
	return user.avatar;
}

module.exports = upload;
