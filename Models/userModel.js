const mongoose = require("mongoose");
const dbLink = process.env.DB_LINK || require("../KEYS/secrets").DB_LINK;
// connection
mongoose
    .connect(
        dbLink, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }
    )
    .then(function (db) {
        console.log("UserDB connected");
    })
    .catch(function (err) {
        console.log(err);
    });
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
        unique: true,
    },
    profileURL: {
        type: String,
        required: true,
    },
    photos: [{
        type: String,
        require: true,
    }],
    role: {
        type: String,
        enum: ["admin", "user", "owner"],
        default: "user",
    },
});

const userModel = mongoose.model("UserModel", userSchema);

module.exports = userModel;