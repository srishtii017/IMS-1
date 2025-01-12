const httpStatus = require("http-status");
const AuthService = require("../services/Auth.service")
const CatchAsync = require("../utils/CatchAsync")

class AuthController{
        static RegisterUser = async(req,res)=>{
            const res_obj = await AuthService.RegisterUser(req.body);
            res.status(httpStatus.CREATED).send(res_obj)
        }
    static LoginUser = async(req,res)=>{
            const res_obj = await AuthService.LoginUser(req.body);
            res.status(httpStatus.OK).send(res_obj)
        }
          static ProfileController = async(req,res)=>{
            console.log(req.body);
            
            const res_obj = await AuthService.ProfileService(req.body);
            res.status(httpStatus.OK).send(res_obj)
        }
         
        
}

module.exports = AuthController