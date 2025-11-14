"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
}, { timestamps: true });
userSchema.method("toClient", function thisToClient() {
    return {
        id: String(this._id),
        name: this.name,
        email: this.email,
        role: this.role,
    };
});
exports.default = (0, mongoose_1.model)("User", userSchema);
