const multer = require("multer");
const fs = require("fs-extra");
const uuidv4 = require("uuid/v4");
const User = require("../../api/user/user.model");

async function generatePath(userId, type) {
	const user = await User.findById(userId);
	if (!user) throw { code: 400, message: "USER_NOT_FOUND" };
	const path = `./server/contents/${type}/${userId}`;
	return path;
}

function fileFilter(match) {
	return (req, file, callback) => {
		if (!file.originalname.toLowerCase().match(match)) {
			callback(new Error("AVATAR_INVALID_TYPE"));
		}
		callback(null, true);
	};
}

function upload(type, filter) {
	const multerUpload = multer({
		fileFilter: filter,
		limits: {
			fieldSize: 10 * 1024 * 1024
		},
		storage: multer.diskStorage({
			destination: async (req, file, callback) => {
				const path = await generatePath(req.params.userId, type);
				req.filePath = path;
				fs.mkdirsSync(path);
				callback(null, path);
			},
			filename: (req, file, callback) => {
				const fileName = `${uuidv4()}.${
					file.originalname.split(".").reverse()[0]
				}`;
				req.urlPath = `${req.filePath.substring(1)}/${fileName}`;
				callback(null, fileName);
			}
		})
	});
	return multerUpload.single("file");
}

module.exports.upload = upload;
module.exports.fileFilter = fileFilter;
