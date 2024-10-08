"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const cors_1 = __importDefault(require("cors"));
const cookieParser = require("cookie-parser");
const user_routes_1 = __importDefault(require("./routes/user-routes"));
const post_routes_1 = __importDefault(require("./routes/post-routes"));
const admin_routes_1 = __importDefault(require("./routes/admin-routes"));
const nocache = require("nocache");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 5000;
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ limit: "10mb", extended: true }));
app.use((0, cors_1.default)({
    origin: [
        "https://unifynet.jisonline.site", // Add your frontend domain
        "http://localhost:3000", // For local development
        "http://13.67.149.93:5000", // For testing purposes (adjust as necessary)
    ], // Adjust to your frontend URL
    credentials: true,
}));
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(nocache());
app.use(cookieParser());
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.use("/", user_routes_1.default);
app.use("/", post_routes_1.default);
app.use("/admin", admin_routes_1.default);
(0, database_1.default)();
// chatInitializeSocket();
// webRtcSocket();
// notificationSocket();
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
