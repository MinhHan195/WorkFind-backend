const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary.config");
const multer = require("multer");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "work-find",
        resource_type: "raw", // bắt buộc khi upload file không phải image/video
        format: async (req, file) => "pdf", // hoặc bỏ nếu bạn không muốn ép định dạng
        public_id: (req, file) => file.originalname.split(".")[0], // tùy chọn: đặt tên file
    },
});

const upload = multer({ storage });

module.exports = upload;
