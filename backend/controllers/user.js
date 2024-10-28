import { User } from "../database/models/user.js"
import ErrorHandler from "../middlewares/error.js"
import {v2 as cloudinary} from 'cloudinary'

export const register = async(req, res, next)=> {
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler('Profile Image Required', 400))
    }

    const {profileImage} = req.files
    const allowedFormats = ['image/png', 'image/jpg', 'image/webp']
    if(!allowedFormats.includes(profileImage.mimetype)) {
        return next(new ErrorHandler('File format not supported', 400))
    }

    const {name, email, password, phoneNumber, address, role, bankAccountNumber, bankAccountName, bankName, phonePeNumber} = req.body

    if(!name || !email || !phoneNumber || !password || !address || !role) {
        return next(new ErrorHandler('please fill all details', 400))
    }

    if(role === 'Auctioneer') {
        if(!bankAccountName || !bankAccountNumber || !bankName) {
            return next(new ErrorHandler('please provide your full bank details', 400))
        }
        if(!phonePeNumber) {
            return next(new ErrorHandler('please provide your phonePe number', 400))
        }
    }

    const isRegistered = await User.findOne({email})
    if(isRegistered) {
        return next(new ErrorHandler('User already Registered', 400))
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(profileImage.tempFilePath, 
        {
            folder: 'MERN_AUCTION_PLATFORM'
        }
    )
    if(!cloudinaryResponse || cloudinaryResponse.error) {
        console.log('cloudinary error', cloudinaryResponse.error || 'unknown cloudinary error')
        return next(new ErrorHandler('Failed to upload profile image to cloudinary', 500))
    }
    const user = await User.create({
        userName,
        email,
        password,
        phone,
        address,
        role,
        profileImage: {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        },
        paymentMethods: {
          bankTransfer: {
            bankAccountNumber,
            bankAccountName,
            bankName,
          },
          phonePe: {
            phonePeNumber,
          }
        },
      });
    return res.status(201).json({
        success: true,
        message: 'User Registered successfully'
    })
}