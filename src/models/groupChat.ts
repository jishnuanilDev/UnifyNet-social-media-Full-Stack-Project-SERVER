import mongoose from "mongoose";

interface IChatRoom{
    name:string;
    description:string;
    image:string;
    admin:mongoose.Types.ObjectId;
    members:mongoose.Types.ObjectId[];
    messages:mongoose.Types.ObjectId[];
}
const chatRoomSchema = new mongoose.Schema<IChatRoom>({
    name:String,
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    messages:[{type:mongoose.Schema.Types.ObjectId,ref:'chatMessage'}]

},{
    timestamps:true
})

const chatRoom = mongoose.model('chatRoom',chatRoomSchema);
export default chatRoom;