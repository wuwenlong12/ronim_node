import  db, { IFriend }  from '../../model';
import {  Response } from 'express';
import { AuthenticatedRequest } from './type';

const Friend =db.model('Friend');
const User =db.model('User');

// 添加好友
export const addFriend = async (req: AuthenticatedRequest, res: Response) => {
    const uid = req.auth?.uid;
    const { fid } = req.body;
    // 检查用户是否存在
    const user = await User.findById(uid);
    const friend = await User.findById(fid);

    if (!user || !friend) {
        return res.send({
            code: 1,
            message: "Error: 用户不存在",
            data: {}
        });
    }

    // 检查是否已经是好友
    const existingFriendship = await Friend.findOne({
        $or: [
            { userID: uid, friendID: fid },
            { userID: fid, friendID: uid }
        ]
    });

    if (existingFriendship) {
        return res.send({
            code: 1,
            message: "Error: 已发送请求，请等待",
            data: {}
        });
    }

    // 发起请求
    const data = {
        userID: uid,
        friendID: fid,
        state: 1
    };
    const newFriendship = new Friend(data);

 
        await newFriendship.save();
        res.send({
            code: 0,
            message: "Success: 好友请求已发送",
            data: {}
        });

};

// 更新好友状态
export const updateFriendState = async (req: AuthenticatedRequest, res: Response, state: number) => {
    const uid = req.auth?.uid;
    const fid = req.body.fid;
    const wherestr = { $or: [{ 'userID': uid, 'friendID': fid }, { 'userID': fid, 'friendID': uid }] };

 
        await Friend.updateOne(wherestr, { 'state': state });
        res.send({
            code: 0,
            message: "Success: 更新成功",
            data: {}
        });

};

// 获取所有好友
export const getAllfriend = async (req: AuthenticatedRequest, res: Response) => {
    const uid = req.auth?.uid;
    const wherestr = {
        'userID': uid,
        'state': 2
    };


        const friends :IFriend[] | null= await Friend.find(wherestr).populate('friendID userID').exec();
        if (!friends) return
        const result = friends.map((item) => {
            if (item.userID?._id.toString() === uid) {
                // 删除 userID 字段
                 item.userID =undefined;
            } else {
                // 将 friendID 字段的值赋给 userID，并删除旧的 friendID 字段
                item.userID = item.friendID;
                item.friendID =undefined;
            }
            return item;
        });
        // TODO
        // const fileUrl = `${req.protocol}://${req.get('host')}${result?.imgurl}`; // 构建文件 URL
        // result.imgurl = fileUrl
        // res.send({
        //     code: 0,
        //     message: 'Success',
        //     data: result
        // });
   
};

// 判断是否为好友
export const isFriend = async (uid: string, fid: string, res: Response) => {
    const wherestr = {
        'userID': uid,
        'friendID': fid,
        'state': 2
    };

   
        const result = await Friend.findOne(wherestr).exec();
        res.send({
            code: 0,
            message: 'Success',
            data: { isFriend: !!result }
        });
  
};