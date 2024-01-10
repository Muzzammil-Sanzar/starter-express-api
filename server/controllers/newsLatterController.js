
const NewsLatter = require('../models/newsLatter');

exports.createNewsLatter = async (req, res) => {
  try {
    const body = {
      name: req.body.name,
      email: req.body.email
    }
    const data = await NewsLatter.create(body);
    res.send({
      success: true,
      message: 'NewsLatter created successfully',
      data: data
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
      message: 'Request failed, an error occured, please try again.',
    });
  }
}

exports.getNewsLatter = async (req, res) => {
  try {
    const data = await NewsLatter.find().sort({ createdAt: -1 });
    res.send({
      success: true,
      message: 'NewsLatter fetched successfully',
      data: data
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
      message: 'Error fetching newslatter' + error.message,
    });
  }
}
