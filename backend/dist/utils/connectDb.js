"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = connectDb;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDb(uri) {
    if (!uri)
        throw new Error("MONGO_URI not provided");
    await mongoose_1.default.connect(uri, {
    // options handled by mongoose 7+
    });
    console.log("MongoDB connected");
}
