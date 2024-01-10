const User = require('../models/user');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

/**
 * GET /
 * USER
 */

exports.user = async (req, res) => {
  const newUser = new User({
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNo: req.body.phoneNo,
    zipCode: req.body.zipCode,
    image: req.body.image,
  });
  // console.log(req.body)
  try {
    const body = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };
    const result = await User.findOne(body, { password: 0 });
    if (result === null) {
      // console.log('this is result', result)
      const userCreated = await User.create(newUser);
      const token = jwt.sign(
        { user_id: userCreated._id },
        process.env.TOKEN_KEY
        // {
        //     expiresIn: "24h",
        // }
      );
      res.send({
        success: true,
        message: 'User created successfully',
        data: userCreated,
        token,
      });
    } else {
      res.send({ success: true, message: 'User already exists', data: result });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
      message: 'Request failed, an error occured, please try again.',
    });
    console.log(error);
  }
};

exports.emailVerification = async (req, res) => {
  const otp = Math.floor(Math.random() * (999999 - 111111 + 1) + 111111);

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
      from: '"Villa" <apitesting123456789@outlook.com>', // sender address
      to: `${req.body.email}`, // list of receivers
      subject: 'Villa | Email verification', // Subject line
      text: 'email verification', // plain text body
      html: `
                <div
                style="max-width: 90%; margin: auto; padding-top: 20px"
                >
                <h1>Villa</h1>
                <p style="margin-bottom: 30px;">Please enter the sign up OTP to get started</p>
                <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otp}</h1>
                </div>
            `, // html body
    });

    console.log('Message sent: %s', info);

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    res.send({
      success: true,
      otp: otp,
      message: 'Otp sent to you by email. Please check your email',
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
};

exports.login = async (req, res) => {
  try {
    const body = {
      email: req.body.email,
    };

    const getPassword = await User.findOne(body);
    if (getPassword) {
      const comparePassword = await bcrypt.compare(
        req.body.password,
        getPassword.password
      );
      if (comparePassword) {
        const data = await User.findOne(body, { password: 0 });
        const token = jwt.sign(
          { user_id: data._id, },
          process.env.TOKEN_KEY,
          {
            expiresIn: '15m',
          }
        );

        const refreshToken = jwt.sign(
          { user_id: data._id, },
          process.env.TOKEN_REFRESH_KEY,
          {
            expiresIn: '7d',
          }
        );



        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.send({ success: true, data, message: 'Successful', token: token });
      } else {
        res.send({
          success: false,
          message: 'Wrong credentials, data not found. Please try again',
        });
      }
    } else {
      res.send({ success: false, message: 'No data found', data: getPassword });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
      message: 'Oops, an error occured, please try again.',
    });
    console.log(error.message);
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const body = {
      email: req.body.email,
      password: req.body.password,
    };
    const salt = await bcrypt.genSalt();
    hashPassword = await bcrypt.hash(req.body.password, salt);
    const data = await User.updateOne(
      { email: req.body.email },
      { $set: { password: hashPassword } }
    );
    // console.log(data)
    if (data.acknowledged && data.modifiedCount > 0) {
      res.send({
        success: true,
        message: 'Password updated successfully',
        data: data,
      });
    } else {
      res.send({ success: false, message: "Account doesn't exist." });
    }
  } catch (error) {
    res.send({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const data = await User.findOne({ _id: req.user_id }, { password: 0 });
    res.send({ success: true, data: data });
    // res.send(req.headers.authorization)
  } catch (error) {
    res.send({ error: error.message });
  }
};

exports.testUser = async (req, res) => {
  try {
    res.send({ success: true, data: 'working' });
    // res.send(req.headers.authorization)
  } catch (error) {
    res.send({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const body = {
      image: req.body.image,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNo: req.body.phoneNo,
      dob: req.body.dob,
      gender: req.body.gender,
      pronoun: req.body.pronoun,
      zipCode: req.body.zipCode,
    };
    const data = await User.updateOne({ _id: req.user_id }, body, {
      returnNewDocument: true,
    });
    if (data.matchedCount === 1 && data.modifiedCount === 1) {
      res.send({ success: true, data: data, message: 'Updated!' });
    } else {
      res.send({ success: true, data: data, message: 'Data already exists!' });
    }
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};

// // UPDATE USER COMPLETE MODEL
// exports.updateUserModel = async (req, res) => {

//     const body = {
//         chronicHealthConditions: hCond,
//         allergies: all
//     }
//     try {
//         const data = await User.updateOne({ email: req.body.email }, body, { returnNewDocument: true })
//         if (data.matchedCount === 1 && data.modifiedCount === 1) {
//             res.send({ success: true, data: data, message: "Updated!" })
//         } else {
//             res.send({ success: true, data: data, message: "Data already exists!" })
//         }
//     } catch (error) {
//         res.send({ success: false, message: error.message })
//     }
// }


// ******************************* ADMIN ROUTE *******************************

exports.getActiveUsers = async (req, res) => {
  try {
    const searchResult = await User.find({ isActive: true });
    if (searchResult.length == 0) {
      res.send({
        success: 'false',
        message: 'No Users in Collection !',
        data: searchResult,
      });
    } else {
      res.send({
        success: true,
        message: 'Users in Collection !',
        data: searchResult,
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
      message: 'Request failed, an error occured, please try again.',
    });
    console.log(error);
  }
};

exports.getArchivedUsers = async (req, res) => {
  try {
    const searchResult = await User.find({ isActive: false });
    if (searchResult.length == 0) {
      res.send({
        success: 'false',
        message: 'No Users in Collection !',
        data: searchResult,
      });
    } else {
      res.send({
        success: true,
        message: 'Users in Collection !',
        data: searchResult,
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
      message: 'Request failed, an error occured, please try again.',
    });
    console.log(error);
  }
};

exports.archiveUser = async (req, res) => {
  user_id = req.params.id;
  try {
    let user = await User.findOne({ _id: user_id });
    if (user.isActive) {
      user = await User.findOneAndUpdate(
        { _id: user_id },
        { isActive: false },
        { returnOriginal: false }
      );
      await user.save();
      res.send({
        success: true,
        message: 'User is Archived !',
        data: user,
      });
    } else {
      res.send({
        success: true,
        message: 'User already archived !',
        data: user,
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
      message: 'Request failed, an error occured, please try again.',
    });
    console.log(error);
  }
};

exports.activateUser = async (req, res) => {
  user_id = req.params.id;
  try {
    let user = await User.findOne({ _id: user_id });
    if (user.isActive) {
      res.send({
        success: true,
        message: 'User already active !',
        data: user,
      });
    } else {
      user = await User.findOneAndUpdate(
        { _id: user_id },
        { isActive: true },
        { returnOriginal: false }
      );
      await user.save();
      res.send({
        success: true,
        message: 'User Status Updated !',
        data: user,
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
      message: 'Request failed, an error occured, please try again.',
    });
    console.log(error);
  }
};
