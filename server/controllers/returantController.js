const Resturants = require('../models/resturants');
const nodemailer = require('nodemailer');

exports.createResturant = async (req, res) => {
  try {
    const body = {
      name: req.body.name,
      email: req.body.email,
      menuLink: req.body.menuLink,
      logo: req.body.logo
    }
    const data = await Resturants.create(body);
    res.send({
      success: true,
      message: 'Resturant created successfully',
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

exports.getAllResturants = async (req, res) => {
  try {
    const data = await Resturants.find();
    res.send({
      success: true,
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

exports.totalResturants = async (req, res) => {
  try {
    const data = await Resturants.estimatedDocumentCount();
    res.send({
      success: true,
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

exports.deleteResturant = async (req, res) => {
  try {

    const data = await Resturants.deleteOne({ _id: req.params.id });
    if (data.deletedCount > 0) {
      res.send({
        success: true,
        message: 'Resturant deleted successfully',
        data: data,
      });
    } else {
      res.send({
        success: true,
        message: 'Resturant Not Found!!!',
        data: data,
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

exports.updateResturant = async (req, res) => {
  try {
    const body = {
      name: req.body.name,
      email: req.body.email,
      menuLink: req.body.menuLink,
      logo: req.body.logo
    }
    const data = await Resturants.updateOne({ _id: req.body._id }, { $set: body }, { returnDocument: 'after' });
    if (data.acknowledged && data.modifiedCount > 0) {
      res.send({
        success: true,
        message: 'Resturant updated successfully',
        data: data
      });
    } else {
      res.send({
        success: false,
        message: 'Resturant data saved!s',
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

exports.sendOrder = async (req, res) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: 'apitesting123456789@outlook.com', // generated ethereal user
      pass: 'Api123456789', // generated ethereal password
    },
  });

  try {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Eat Time" <apitesting123456789@outlook.com>', // sender address
      to: `${req.body.email}`, // list of receivers
      subject: 'Eat Time | You Got New Order', // Subject line
      text: 'Order Information', // plain text body
      html: `
                <div
                style="max-width: 90%; margin: auto; padding-top: 20px"
                >
                <h1>Eat Time</h1>
                <p style="margin-bottom: 30px;">Your Order Information</p>
                <h1 style="font-size: 30px; letter-spacing: 2px; text-align:center;">User Name: ${req.body.firstName} ${req.body.lastName}</h1>
                <h1 style="font-size: 16px; letter-spacing: 2px; text-align:center;">User Phone No: ${req.body.phoneNo}</h1>
                <h1 style="font-size: 16px; letter-spacing: 2px; text-align:center;">No. of persons: ${req.body.people}</h1>
                <h1 style="font-size: 16px; letter-spacing: 2px; text-align:center;">Time: ${req.body.time}</h1>
                <h1 style="font-size: 16px; letter-spacing: 2px; text-align:center;">Table Order: ${req.body.tableOrder}</h1>
                </div>
            `, // html body
    });

    console.log('Message sent: %s', info);

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    res.send({
      success: true,
      message: 'Your Order is sent to the resturant!',
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
      message: 'Oops, an error occured, Please try again.',
    });
    console.log(error);
  }

  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}