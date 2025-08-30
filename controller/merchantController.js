const prisma = require("../prismaconfig");
const catchAsync = require("../utils/catchAsync");
const { errorResponse, successResponse, validationErrorResponse } = require("../utils/ErrorHandling");

exports.createVendor = catchAsync(async (req, res) => {
    const user = req.user._id;
    console.log("usr", user)
    const {
        uuid,
        business_name,
        city,
        area,
        pincode,
        category,
        subcategory,
        business_register,
        pan_card,
        GST_no,
        address,
        lat,
        long,
        landmark,
        adhar_front,
        adhar_back,
        pan_card_image,
        gst_certificate,
        shop_license,
        business_logo,
        store_logo,
        opening_hours,
        weekly_off_day,
        bank_details,
        upi_id,
        UserId
    } = req.body;

    const vendor = await prisma.vendor.create({
        data: {
            uuid,
            business_name,
            city,
            area,
            pincode,
            category,
            subcategory,
            business_register,
            pan_card,
            GST_no,
            address,
            lat,
            long,
            landmark,
            adhar_front,
            adhar_back,
            pan_card_image,
            gst_certificate,
            shop_license,
            business_logo,
            store_logo,
            opening_hours,
            weekly_off_day,
            bank_details,
            upi_id,
            UserId
        }
    });

    return successResponse(res, "Vendor created successfully", 201, { vendor });
});

exports.getAllVendors = catchAsync(async (req, res) => {
    try {
        const vendors = await prisma.vendor.findMany({
            include: { user: true }
        });
        return successResponse(res, "Vendors fetched successfully", 200, vendors);
    } catch (error) {
        return errorResponse(res, error.message || "Internal Server Error", 500);

    }
});

// ================= GET SINGLE VENDOR =================
exports.getVendorById = catchAsync(async (req, res) => {
    try {
        const { id } = req.params;

        const vendor = await prisma.vendor.findUnique({
            where: { id: parseInt(id) },
            include: { user: true }
        });

        if (!vendor) return errorResponse(res, "Vendor not found", 404);

        return successResponse(res, "Vendor fetched successfully", 200, { vendor });
    } catch (error) {
        return errorResponse(res, error.message || "Internal Server Error", 500);

    }
});

// ================= UPDATE VENDOR =================
exports.updateVendor = catchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const vendor = await prisma.vendor.update({
            where: { id: parseInt(id) },
            data
        });

        return successResponse(res, "Vendor updated successfully", 200, { vendor });
    } catch (error) {
        return errorResponse(res, error.message || "Internal Server Error", 500);

    }
});

// ================= DELETE VENDOR =================
exports.deleteVendor = catchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.vendor.delete({
            where: { id: parseInt(id) }
        });

        return successResponse(res, "Vendor deleted successfully", 200);
    } catch (error) {
        return errorResponse(res, error.message || "Internal Server Error", 500);

    }
});
