const express = require("express");
const multer = require("multer");
const router = express.Router();
const { Video } = require("../models/Video");
const { auth } = require("../middleware/auth");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "uploads/");
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        if (ext !== ".mp4") {
            return callback(res.status(400).end("only mp4 is allowed"), false);
        }
        callback(null, true);
    },
});

const upload = multer({ storage }).single("file");

//https://github.com/expressjs/multer/blob/master/doc/README-ko.md
router.post("/uploadfiles", (req, res) => {
    //비디오를 서버에 저장
    upload(req, res, (err) => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.json({
            success: true,
            filePath: res.req.file.path,
            fileName: res.req.file.filename,
        });
    });
});

router.post('/uploadVideo', (req, res) => {
    //비디오 정보를 저장함
    const video = new Video(req.body)
    video.save((err, doc) => {
        if (err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    })
})

router.post("/thumbnail", (req, res) => {
    // 썸네일 생성하고 비디오 러닝타임도 가져오기

    let thumbsFilePath = ''
    let fileDuration = ''

    //비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.filePath, (err, metadata) => {
        console.dir(metadata);
        console.log(metadata.format.duration)

        fileDuration = metadata.format.duration
    })

    // 썸네일 생성 및 오류
    ffmpeg(req.body.filePath)
        .on("filenames", (filenames) => {
            console.log("Will generate " + filenames.join(", "));
            thumbsFilePath = "uploads/thumbnails/" + filenames[0];
        })
        .on("end", () => {
            console.log("Screenshots taken");
            return res.json({
                success: true,
                thumbsFilePath,
                fileDuration,
            });
        })
        .on('error', (err) => {
            console.error(err);
            return res.json({ success: false, err })
        })
        .screenshots({
            // Will take screens at 20%, 40%, 60% and 80% of the video
            count: 3,
            folder: "uploads/thumbnails",
            size: "320x240",
            // %b input basename ( filename w/o extension )
            filename: "thumbnail-%b.png",
        });
});

module.exports = router;
