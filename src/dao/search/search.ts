import { AuthenticatedRequest } from './type';
import  db  from '../../model';
import {  Response } from 'express';

const User = db.model('User');

// 搜索用户
export const searchFriends = async (req: AuthenticatedRequest, res: Response) => {
    const data = req.body.data;
    const currentUserId = req.auth?.uid; // 假设当前用户 ID 是从请求中获取的
    console.log(currentUserId);

    const wherestr = {
        $and: [
            {
                $or: [
                    { name: { $regex: data, $options: 'i' } }, // 使用 'i' 选项进行不区分大小写搜索
                    { email: { $regex: data, $options: 'i' } },
                    { account: { $regex: data, $options: 'i' } }
                ]
            },
            { _id: { $ne: currentUserId } } // 排除当前用户
        ]
    };

    const out = {
        username: 1,
        email: 1,
        imgurl: 1
    };

   
        const result = await User.find(wherestr, out).exec();
        res.send({
            code: 0,
            message: 'Success',
            data: result
        });

};