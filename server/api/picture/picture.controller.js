'use strict';

const Picture = require("./picture.model"); // register your schema

/**
 * @function addPicture
 * @description This function is used to add a new picture to an article.
 * This function takes the picture's name in the body field and a file from multer
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
async function addPicture (req, res, next) {
  try {
    if (!req.file)
      throw { code: 422, message: 'Missing picture to upload' };
    if (req.body.name === undefined)
      throw { code: 422, message: 'Missing parameter in body field.' };
    const fields = {
      name: req.body.name,
      content: {
				data: req.file.buffer,
				contentType: 'image/jpeg'
			},
      size: req.file.size,
      id_user: req.decoded._id,
    };
    if (req.body.legend !== undefined)
      fields.legend = req.body.legend;
    if (req.body.license !== undefined)
      fields.license = req.body.license;
    const picture = new Picture(fields);
    const newPicture = await picture.save();
    res.status(201).json({success: true, picture: newPicture})
  } catch (e) {
    next(e);
  }
}

/**
 * @function getPictureById
 * @description This function retrieve the information about pictures.
 * If the id parameter is specified in the url, it will return the information
 * about a specific picture.
 * If nothing is specified, it will returns every pictures and their information
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
async function getPictureById (req, res, next) {
  try {
    let response;
    if (req.params.id){
      response = await Picture.findOne({ _id: req.params.id })
    }
    else
      response = await Picture.find();
    res.json({success: true, picture: response})
  } catch (e) {
    next(e);
  }
}

/**
 * @function removePicture
 * @description This function is used to remove a picture from the database.
 * It takes only the id of the picture in the url parameter.
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
async function removePicture (req, res, next) {
  try {
    const query = { _id: req.params.id };
    await Picture.findOneAndDelete(query).exec();
    res.status(204).json({success: true})
  } catch (e) {
    next(e);
  }
}

/**
 * @function updatePicture
 * @description This function is used to update the picture's information
 * This function takes two parameters :
 *  - name, which is the name to set on the picture
 *  - legend, which is the legend to set on the picture
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
async function updatePicture (req, res, next) {
  try {
    if (req.body.name === undefined || req.body.legend === undefined)
      throw { code: 422, message: 'Missing parameters.' };
    const query = { _id: req.params.id };
    const toReplace = { $set: { name: req.body.name, legend: req.body.legend } };
    await Picture.findOneAndUpdate(query, toReplace);
    res.json({ success: true })
  } catch (e) {
    next(e);
  }
}

/**
 *
 * @type {{addPicture: *, updatePicture: *, removePicture: *, getPictureById: *}}
 */
module.exports = {
  addPicture: addPicture,
  getPictureById: getPictureById,
  removePicture: removePicture,
  updatePicture: updatePicture
};
