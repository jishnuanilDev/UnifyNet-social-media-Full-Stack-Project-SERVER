import mongoose, {Document, Types } from 'mongoose';

interface IChatRoom extends Document{
    name:string;
    description:string;
    image:string;
    admin:mongoose.Types.ObjectId;
    participants:mongoose.Types.ObjectId[];
    messages:mongoose.Types.ObjectId[];
    lastMessage: Types.ObjectId;
    updatedAt: Date;
}
const communitySchema = new mongoose.Schema<IChatRoom>({
    name:{ type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    participants:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    messages:[{type:mongoose.Schema.Types.ObjectId,ref:'CommunityMessage'}],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityMessage' },
    updatedAt: { type: Date, default: Date.now },
},{
    timestamps:true
})

const Community = mongoose.model('Community',communitySchema);
export default Community;