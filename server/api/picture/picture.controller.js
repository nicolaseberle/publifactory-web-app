'use strict';

const Picture = require('./picture.model')

function addPicture (req, res, next) {
  try {
    if (!req.file)
      throw { code: 422, message: 'Missing picture to upload' };
    if (req.body.name === undefined)
      throw { code: 422, message: 'Missing parameter in body field.' };
    const fields = {
      name: req.body.name,
      content: req.file.buffer,
      size: req.file.size,
      id_user: req.decoded._id,
    }
    if (req.body.legend !== undefined)
      fields.legend = req.body.legend;
    if (req.body.license !== undefined)
      fields.license = req.body.license;
    new Picture(fields).save()
    res.status(201).json({success: true})
  } catch (e) {
    next(e);
  }
}

async function getPictureById (req, res, next) {
  try {
    let response
    if (req.params.id)
      response = await Picture.findOne({ _id: req.params.id });
    else
      response = await Picture.find();
    res.json({success: true, picture: response})
  } catch (e) {
    next(e);
  }
}

async function removePicture (req, res, next) {
  try {
    const query = { _id: req.params.id }
    await Picture.findOneAndDelete(query).exec();
    res.status(204).json({success: true})
  } catch (e) {
    next(e);
  }
}

async function changeSource (req, res, next) {
  try {
    const query = { _id: req.params.id }
    const toReplace = { $set: { content: req.file.buffer, size: req.file.size } }
    await Picture.findOneAndUpdate(query, toReplace);
    res.json({ success: true })
  } catch (e) {
    next(e);
  }
}

module.exports = {
  addPicture: addPicture,
  getPictureById: getPictureById,
  removePicture: removePicture,
  changeSource: changeSource
}
