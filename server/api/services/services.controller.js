'use strict';
const axios = require('axios');
var Evaluation = require('./services.model');

/**
 * getArticles - Returns an array of articles requested with a page offset and limit,
 * so that results are paginated
 *
 * @function getJournals
 * @memberof module:controllers/articles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

exports.searchReviewers = async (req, res, next) => {
  axios.get('http://35.241.170.253:5000/api/request_reviewer?abstract=' + this.formPost.abstract + '&keywords=' + this.formPost.keywords + '&title=' + this.formPost.title)
}
exports.getInfoFile =  async (req, res, next) => {
  await axios.post('http://35.241.170.253:5000/api/extract_infos_pdf', { headers: { 'Content-Type': 'multipart/form-data' } })

}
exports.getEvaluation =  async (req, res, next) => {
  try{
    let pipeline = [];
    pipeline.push(
      {$group:
        { _id: "$fields",
          positive: { $sum: "$evaluationPositive" },
          negative: { $sum: "$evaluationNegative" },
          unknown: { $sum: "$evaluationUnknown" }
        }
      }
    )

    //pipeline.push(...paginate(page, count));
    const list = await Evaluation.aggregate(pipeline);

    console.log(list)


    res.status(201).json(list);
  }
  catch (err) {
    next(err);
  }
}
exports.sendEvaluation =  async (req, res, next) => {
  try {
    const fields = req.body.fields;
    const subfields = req.body.subfields;
    const evaluationPositive = req.body.evaluationPositive;
    const evaluationNegative = req.body.evaluationNegative;
    const evaluationUnknown = req.body.evaluationUnknown;
    const newEvaluation = new Evaluation({ fields , subfields, evaluationPositive,evaluationNegative,evaluationUnknown});
    const newEvaluation_ = await newEvaluation.save();
    res.status(201).json(newEvaluation_);
  }
  catch (err) {
    next(err);
  }
}
