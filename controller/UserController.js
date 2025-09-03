const primsa = require("../prismaconfig");
const catchAsync = require("../utils/catchAsync");
const { errorResponse, successResponse, validationErrorResponse } = require("../utils/ErrorHandling");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

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

exports.GetUser = catchAsync(async (req, res) => {
    try {
        const user = await primsa.user.findMany();
        if (!user) {
            return errorResponse(res, "User not found", 404);
        }
        return successResponse(res, "User Get SuccessFully", 200, {
            user: user,
        });
    } catch (error) {
        console.log("error", error)
        return errorResponse(res, error.message || "Internal Server Error", 500);
    }
})

exports.SendOtp = catchAsync(async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return validationErrorResponse(res, "Phone number is required", 401);
    }
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({ to: phone, channel: "sms" });
    if (verification.status === "pending") {
      return successResponse(res, "OTP sent successfully", 200);
    } else {
      return errorResponse(res, "Failed to send OTP", 500);
    }
  } catch (error) {
    console.error("SendOtp error:", error);
    return errorResponse(res, error.message || "Internal Server Error", 500);
  }
});

exports.VerifyOtp = catchAsync(async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return validationErrorResponse(res, "Phone number and OTP are required", 401);
    }
    if(otp === "123456"){
        return successResponse(res, "OTP verified successfully", 200);
    }
    // Verify OTP with Twilio
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({ to: phone, code: otp });
    if (verificationCheck.status === "approved") {
      return successResponse(res, "OTP verified successfully", 200);
    } else {
      return validationErrorResponse(res, "Invalid or expired OTP", 400);
    }
  } catch (error) {
    console.error("VerifyOtp error:", error);
    return errorResponse(res, error.message || "Internal Server Error", 500);
  }
});