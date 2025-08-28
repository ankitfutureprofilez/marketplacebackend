const primsa = require("../prismaconfig");
const catchAsync = require("../utils/catchAsync");
const { errorResponse, successResponse, validationErrorResponse } = require("../utils/ErrorHandling");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


exports.UserAdd = catchAsync(async (req, res) => {
    try {
        console.log("req.body", req.body)
        const { name, email, password, avatar } = req.body;
        if (!name || !email || !password) {
            return validationErrorResponse(res, "All fields are required", 401);
        }
        const user = await primsa.user.findUnique({
            where: { email }
        });
        if (user) {
            return errorResponse(res, "User Already Exist!!", 401);
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        req.body.password = hashedPassword;
        const record = await primsa.user.create({
            data: { name, email, password: hashedPassword, avatar }
        });
        console.log("record", record)
        return successResponse(res, "User Create ", 200);
    } catch (error) {
        console.error(error);
        return errorResponse(res, "Something went wrong", 500);
    }
});

exports.login = catchAsync(async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return errorResponse(res, "All fields are required", 400);
        }
        const user = await primsa.user.findUnique({
            where: { email }
        });
        if (!user) {
            return errorResponse(res, "User not found", 404);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return errorResponse(res, "Invalid credentials", 401);
        }
        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
        );
        return successResponse(res, "Login successful", 200, {
            email: user.email,
            token: token,
        });
    } catch (error) {
        console.log("Login error:", error);
        return errorResponse(res, error.message || "Internal Server Error", 500);
    }
});

exports.GetUser = catchAsync(async (req,res)=>{
    try {
        const user =  await primsa.user.findMany();

        if(
            !
            
            user
        ){}
        
    } catch (error) {
        console.log("error",error)
        return errorResponse(res, error.message || "Internal Server Error", 500);
    }
})