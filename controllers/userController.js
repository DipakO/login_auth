import UserModel from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/emailConfig.js";

class UserController {
  static userRegistration = async (req, res) => {
    const { name, email, password, password_confirmation, tc } = req.body;
    // req.body means send the data from froentend
    const user = await UserModel.findOne({ email: email });
    if (user) {
      res.send({ "status ": "failed", message: "Email alredy exists" });
    } else {
      if (name && email && password && password_confirmation && tc) {
        if (password === password_confirmation) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const doc = new UserModel({
              name: name,
              email: email,
              password: hashPassword,
              tc: tc,
            });
            await doc.save();
            const saved_user = await UserModel.findOne({ email: email });
            // Generate JWT token
            const token = jwt.sign(
              { userID: saved_user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );
            res.status(201).send({
              "status ": "success",
              message: "Registration Success",
              token: token,
            });
          } catch (error) {
            console.log(error);
            res.send({ "status ": "failed", message: "Unable to register" });
          }
        } else {
          res.send({
            "status ": "failed",
            message: "Password and confirm password doesnt match",
          });
        }
      } else {
        res.send({ "status ": "failed", message: "All feilds are required" });
      }
    }
  };
  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await UserModel.findOne({ email: email });
        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (user.email === email && isMatch) {
            // Generate JWT Token
            const token = jwt.sign(
              { userID: user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );
            res.send({
              "status ": "success",
              message: "Login Success",
              token: token,
            });
          } else {
            res.send({
              "status ": "failed",
              message: "Email or password not valid",
            });
          }
        } else {
          res.send({
            "status ": "failed",
            message: "Yor are not a registered User",
          });
        }
      } else {
        res.send({ "status ": "failed", message: "All feilds are required" });
      }
    } catch (error) {
      console.log(error);
      res.send({ "status ": "failed", message: "Unable to login" });
    }
  };

  static changeUserPassword = async (req, res) => {
    const { password, password_confirmation } = req.body;
    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        res.send({
          "status ": "failed",
          message: "Password and confirm password are not equal",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password, salt);
        // console.log(req.user);
        await UserModel.findByIdAndUpdate(req.user._id, {
          $set: {
            password: newHashPassword,
          },
        });
        res.send({
          "status ": "success",
          message: "Password change succsfully",
        });
      }
    } else {
      res.send({ "status ": "failed", message: "All feilds are required" });
    }
  };
  static loggedUser = async (req, res) => {
    res.send({ user: req.user });
  };

  static sendUserPasswordResetEmail = async (req, res) => {
    const { email } = req.body;
    if (email) {
      const user = await UserModel.findOne({ email: email });
      if (user) {
        const secret = user._id + process.env.JWT_SECRET_KEY;

        const token = jwt.sign(
          {
            userID: user._id,
          },
          secret,
          { expiresIn: "15m" }
        );
        const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`;
        console.log(link);

        //Send Email Code
        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: "Login Password Resets Links",
          html: `<a href = ${link}>Click here </a> to reset your password`,
        });

        res.send({
          "status ": "success",
          message: "Password Reset Email Send.... Please Check Your Email",
          info: info,
        });
      } else {
        res.send({ "status ": "failed", message: "Email does not exits" });
      }
    } else {
      res.send({ "status ": "failed", message: "Email is required" });
    }
  };

  static userPasswordReset = async (req, res) => {
    const { password, password_confirmation } = req.body;
    const { id, token } = req.params;
    const user = await UserModel.findById(id);
    const new_Secret = user._id + process.env.JWT_SECRET_KEY;
    try {
      jwt.verify(token, new_Secret);
      if (password && password_confirmation) {
        if (password !== password_confirmation) {
          res.send({
            "status ": "failed",
            message: "New password and confirm password not equal",
          });
        } else {
          const salt = await bcrypt.genSalt(10);
          const newHashPassword = await bcrypt.hash(password, salt);
          await UserModel.findByIdAndUpdate(user._id, {
            $set: {
              password: newHashPassword,
            },
          });
          res.send({
            "status ": "success",
            message: "Password Reset succsfully",
          });
        }
      } else {
        res.send({ "status ": "failed", message: "All feilds are required" });
      }
    } catch (error) {
      console.log(error);
      res.send({ "status ": "failed", message: "Invalid Token" });
    }
  };
}

export default UserController;
