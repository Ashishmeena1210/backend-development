import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {

    // Get user details from frontend
    const { fullName, userName, email, password } = req.body;

    // Validate required fields
    if (
        [fullName, userName, email, password]
            .some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    });

    if (existedUser) {
        throw new ApiError(
            409,
            "User with email or username already exists"
        );
    }

    // Get uploaded files
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

console.log("FILES:", req.files);
console.log("AVATAR PATH:", avatarLocalPath);



    // Avatar is required
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    // Upload files to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("AVATAR CLOUDINARY RESPONSE:", avatar);

    const coverImage = coverImageLocalPath
        ? await uploadOnCloudinary(coverImageLocalPath)
        : null;

    // Check avatar upload
    if (!avatar) {
        throw new ApiError(500, "Avatar upload failed");
    }

    // Create user
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase(),
    });

    // Remove sensitive fields from response
    const createdUser = await User.findById(user._id)
        .select("-password -refreshToken -watchHistory");

    if (!createdUser) {
        throw new ApiError(500, "User creation failed");
    }

    // Send response
    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "User registered successfully"
        )
    );
});

export { registerUser };