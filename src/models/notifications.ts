import mongoose, { Schema, Document } from "mongoose";

// Interface for Notification
interface INotification extends Document {
  sender: mongoose.Schema.Types.ObjectId;
  receiver: mongoose.Schema.Types.ObjectId;
  type: string; // e.g., "like", "comment", "follow", etc.
  message: string;
  post: mongoose.Schema.Types.ObjectId;
  link: string; // Optional link to the resource (e.g., post, comment, profile)
  isRead: boolean;
  createdAt: Date;
  readAt?: Date; // Optional field for when the notification was read
}

// Notification Schema
const NotificationSchema: Schema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    post: { type: Schema.Types.ObjectId, ref: 'Post'},
    link: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

// Export Notification model
const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);

export default Notification;
