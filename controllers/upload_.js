const userModel = require("../models/user");

// Gets a filename extension.
function getExtension(filename) {
    return filename.split(".").pop();
}

// Test if a file is valid based on its extension and mime type.
function isFileValid(filename, mimetype) {
    var allowedExts = ["webm", "ogg", "mp4"];
    var allowedMimeTypes = ["video/,p4", "video/webm", "video/ogg"];

    // Get file extension.
    var extension = getExtension(filename);
    return allowedExts.indexOf(extension.toLowerCase()) != -1  &&
        allowedMimeTypes.indexOf(mimetype) != -1;
}

async function upload_(req, res) {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let video = req.files.video;

            if (!isFileValid(video.name, video.name.mimetype)) {
                res.send({
                    status: false,
                    message: 'file not allowed'
                });
            }
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            console.log('1')

            console.log('1')

            //Use the mv() method to place the file in upload_ directory (i.e. "uploads")
            video.mv('./uploads/' + video.name);

            const filter = {name: 'Jean-Luc Picard'};
            const update = {age: 59};

// `doc` is the document _before_ `update` was applied
//             let doc = await userModel.findOneAndUpdate(filter, update);
            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: video.name,
                    mimetype: video.mimetype,
                    size: video.size
                }
            });
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
}

module.exports = upload_;