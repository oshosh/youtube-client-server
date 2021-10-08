const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId, // User 스키마의 정보를 다 긁어옴
        ref: "User",
    },
    title: {
        type: String,
        maxlength: 50,
    },
    description: {
        type: String,
    },
    privacy: {
        type: Number,
    },
    filePath: {
        type: String,
    },
    catogory: {
        type: String,
    },
    views: {
        type: Number,
        default: 0,
    },
    duration: {
        type: String,
    },
    thumbnail: {
        type: String,
    },
}, { timestamps: true });

const Video = mongoose.model("Video", videoSchema);

module.exports = { Video };
