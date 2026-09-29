import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({message: 'Yey! Maja aa gyaaaa'});

    //user regestration logic will be implemented here
    //get user deatail from frontend
    //validate user detail
    //check if user already exists: username, enail
    //check for images, avatar, cover image
    //upload images to cloudinary, avatar
    //user object creation- create entry in the database
    //remove password and refresh token from the response
    //check user creation success and send response to frontend

    const{fullName, userName, email, password} = req.body;
    
    if(
        [fullName, userName, email, password].some((field)=> field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }
    
    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }


    //upload on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverIamge = await uploadOnCloudinary(coverImageLocalPath);

     if(!avatar){
        throw new ApiError(500, "Avatar file is required");
     }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverIamge: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase(),
     })

     const createdUser = await User.findById(user._id).select("-password -refreshToken -watchHistory ");

     if(!createdUser){
        throw new ApiError(500, "User creation failed");
     }

     return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
})

export {registerUser};