const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
const {jwtValidator} = require("./users");
const userModel = require("../models/user");

// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: "credible-market-339715-36ad92f64c9f.json" });
const bucket = storage.bucket("video-bb");

// Gets a filename extension.
function getExtension(filename) {
    return filename.split(".").pop();
}

// Test if a file is valid based on its extension and mime type.
function isFileValid(filename, mimetype) {
    var allowedExts = ["webm", "ogg", "mp4"];
    var allowedMimeTypes = ["video/mp4", "video/webm", "video/ogg"];

    // Get file extension.
    var extension = getExtension(filename);
    return allowedExts.indexOf(extension.toLowerCase()) != -1  &&
        allowedMimeTypes.indexOf(mimetype) != -1;
}





const upload =  (req, res, next) => {

    user = jwtValidator(req, res);

    if (!req.file) {
        res.status(400).send('No file uploaded.');
        return;
    }

    if (!isFileValid(req.file.originalname, req.file.mimetype)){
        res.send({
            status: false,
            message: 'file not allowed'
        });
    }
    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', err => {
        next(err);
    });

    blobStream.on('finish', async () => {
        // The public URL can be used to directly access the file via HTTP.
        await blob.makePublic()

        const publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        console.log('user ', user);
        const users = await userModel.findOneAndUpdate({
            "email": user
        }, {url: publicUrl});
        res.status(200).send(publicUrl);
    });

    blobStream.end(req.file.buffer);
};
module.exports = upload;