import mongoose from 'mongoose';

// 创建数据库连接
const db = mongoose.createConnection('mongodb://localhost:27017/RonIm', {});

db.on('error', console.error.bind(console, '连接错误:'));
db.once('open', () => {
    console.log('链接数据库RonIm成功！');
});

// 用户表
export interface IUser {
    _id: mongoose.Types.ObjectId;
    account: string;
    username: string;
    password: string;
    email: string;
    sex: number;
    birthday: Date;
    phone: number;
    school: string;
    explain: string;
    imgurl: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
    account: { type: String, unique: true }, // 唯一账号
    username: { type: String },  // 用户名
    password: { type: String }, // 密码
    email: { type: String, unique: true }, // 邮箱
    sex: { type: Number, default: 0 }, // 性别
    birthday: { type: Date }, // 生日
    phone: { type: Number }, // 电话
    school: { type: String },
    explain: { type: String, default: '用户很懒没有个性签名' }, // 介绍
    imgurl: { type: String, default: '/user/user.png' }, // 头像
}, { timestamps: true });

// 好友表
export interface IFriend {

    userID?: IUser;
    friendID?: IUser;
    state: string;
    markname: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const FriendSchema = new mongoose.Schema<IFriend>({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // 用户id
    friendID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // 好友id
    state: { type: String }, // 通过状态（数据无数据为非好友，1申请中，2已同意，3已拒绝,4已拉黑）
    markname: { type: String },
}, { timestamps: true });

// 一对一消息表
export interface IMessage {
    userID: mongoose.Types.ObjectId;
    friendID: mongoose.Types.ObjectId;
    message: string;
    types: string;
    time: Date;
    state: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const MessageSchema = new mongoose.Schema<IMessage>({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // 用户id
    friendID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // 好友id
    message: { type: String }, // 内容
    types: { type: String },      // 内容类型(0文字，1图片，2音频，3地图)
    time: { type: Date }, // 生成时间
    state: { type: Number }, // 接收状态
}, { timestamps: true });

// 群表
export interface IGroup {
    userID: mongoose.Types.ObjectId;
    name: string;
    imgurl: string;
    time: Date;
    notice: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const GroupSchema = new mongoose.Schema<IGroup>({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // 用户id
    name: { type: String }, // 群名称
    imgurl: { type: String, default: 'group.png' }, // 头像
    time: { type: Date }, // 群创建时间
    notice: { type: String }, // 群公告
}, { timestamps: true });

// 群成员表
export interface IGroupUser {
    groupID: mongoose.Types.ObjectId;
    userID: mongoose.Types.ObjectId;
    name: string;
    tip: number;
    shield: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const GroupUserSchema = new mongoose.Schema<IGroupUser>({
    groupID: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },  // 群id
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // 用户id
    name: { type: String }, // 群内名称
    tip: { type: Number, default: 0 }, // 未读消息数
    shield: { type: Number, default: 0 }, // 是否屏蔽群 0不屏蔽 1屏蔽
}, { timestamps: true });

// 群消息表
export interface IGroupMsg {
    GroupID: mongoose.Types.ObjectId;
    userID: mongoose.Types.ObjectId;
    message: string;
    types: string;
    state: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const GroupMsgSchema = new mongoose.Schema<IGroupMsg>({
    GroupID: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },  // 群id
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // 用户id
    message: { type: String }, // 内容
    types: { type: String },      // 内容类型(0文字，1图片，2音频，3地图)
    state: { type: Number }, // 接收状态
}, { timestamps: true });

// 创建模型
const User = db.model<IUser>('User', UserSchema);
const Friend = db.model<IFriend>('Friend', FriendSchema);
const Message = db.model<IMessage>('Message', MessageSchema);
const Group = db.model<IGroup>('Group', GroupSchema);
const GroupUser = db.model<IGroupUser>('GroupUser', GroupUserSchema);
const GroupMsg = db.model<IGroupMsg>('GroupMsg', GroupMsgSchema);

export { User, Friend, Message, Group, GroupUser, GroupMsg };
export default db;