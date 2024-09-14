"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
// Configuration
cloudinary_1.v2.config({
    cloud_name: 'dfspztrwe',
    api_key: '729991455571746',
    api_secret: 'Z7L8ZvTdtthwhOLsSaTD6oxJYYc' // Click 'View Credentials' below to copy your API secret
});
exports.default = cloudinary_1.v2;
