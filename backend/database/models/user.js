import mongoose, { Mongoose } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        minLength: [3, 'username must contain at least three characters'],
        maxLength: [40, 'username cannot exceed forty characters'],
    },
    password: {
        type: String,
        selected: false,
        minLength: [8, 'password must contain at least eight characters'],
        maxLength: [32, 'password cannot exceed thirty two characters'],
    },
    email: String,
    address: String,
    phoneNumber: {
        type: String,
        minLength: [10, 'password must contain exactly ten numbers'],
        maxLength: [10, 'password must contain exactly ten numbers'],
    },
    profileImage: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    paymentMethods: {
        bankTransfer: {
            bankAccountNumber: String,
            bankAccountName: String,
            bankName: String
        },
        phonePe: {
            phonePeNumber: Number
        }
    },
    role: {
        type: String,
        enum: ['Auctioneer', 'Bidder', 'Super Admin']
    },
    unpaidCommission: {
        type: Number,
        default: 0
    },
    auctionsWon: {
        type: Number,
        default: 0
    },
    moneySpent: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

export const User = mongoose.model("User", userSchema)