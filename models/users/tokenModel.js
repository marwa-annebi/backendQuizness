const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
	userId: {
		type: String,
		required: true,
		//unique: true,
	},
	token: { type: String, required: true },
	createdAt: { type: Date, default: Date.now},
    expiresAt :{type:Date}
});



		
module.exports = Token = mongoose.model("Token", tokenSchema);