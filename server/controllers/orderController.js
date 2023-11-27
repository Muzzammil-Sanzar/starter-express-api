const Order = require('../models/order');

exports.createOrder = async (req, res) => {
  try {
    const body = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNo: req.body.phoneNo,
      people: req.body.people,
      time: req.body.time,
      tableOrder: req.body.tableOrder,
      resturantId: req.body.resturantId
    }
    const data = await Order.create(body);
    res.send({
      success: true,
      message: 'Order created successfully',
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

exports.getAllOrders = async (req, res) => {
  try {
    const data = await Order.find().populate('resturantId').sort({ createdAt: -1 });
    res.send({
      success: true,
      message: 'Order created successfully',
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

exports.deleteOrder = async (req, res) => {
  try {
    const data = await Order.deleteOne({ _id: req.params.id });
    if (data.acknowledged && data.deletedCount > 0) {

      res.send({
        success: true,
        message: 'Order deleted successfully',
        data: data
      });
    } else {
      res.send({
        success: true,
        message: "can't find order!",
        data: data
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
      message: 'Request failed, an error occured, please try again.',
    });
  }
}
