import multer from "multer";


const storage = multer
.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'storage/CESTA_NATAL/')
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype != 'text/csv') {
            cb(null, false);
        } else {
            cb(null, true);
        }
    }
})
.single('file');

export default upload;