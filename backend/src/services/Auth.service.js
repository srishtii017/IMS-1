const httpStatus = require("http-status");
const { UserModel, ProfileModel } = require("../models");
const ApiError = require("../utils/ApiError");
const { generatoken } = require("../utils/Token.utils");
const axios = require("axios");
const jwt = require("jsonwebtoken")
const { PUBLIC_DATA } = require("../../constant")

class AuthService {
  static async RegisterUser(body) {
    // request
    console.log("body");
    
    const { email, password, name, token } = body;
    const checkExist = await UserModel.findOne({ email });

    if (checkExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User Alrady Regisrered");
      return;
    }

    const user = await UserModel.create({
      email,
      password,
      name,
    });

    const tokend = generatoken(user);
    const refresh_token = generatoken(user, "2d");

    await ProfileModel.create({
      user: user._id,
      refresh_token,
    });

    return {
      msg: "User Register Successflly",
      token: tokend,
    };
  }
  static async LoginUser(body) {
    const { email, password, name, token } = body;
    const checkExist = await UserModel.findOne({ email });
    if (!checkExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User Not Regisrered");
      return;
    }

    if (password !== checkExist.password) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Credentials");
      return;
    }

    const tokend = generatoken(checkExist);

    return {
      msg: "User Login Successflly",
      token: tokend,
    };
  }
  static async ProfileService(body) {
    const user = jwt.verify(body.token,PUBLIC_DATA.jwt_auth )
    console.log(user);
    
    const checkExist = await UserModel.findById(user.userid).select("name email");
    if (!checkExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User Not Regisrered");
      return;
    }

    return {
      msg: "Data fetched",
      user: checkExist,
    };
  }
}

module.exports = AuthService;
