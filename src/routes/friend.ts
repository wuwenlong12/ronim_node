import express, { Router, Request, Response, NextFunction } from 'express';
import { getAllfriend, addFriend, updateFriendState } from '../dao/friend/friend';

const router: Router = express.Router();

// 获取所有好友列表
router.get('/getallfriend', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await getAllfriend(req, res);
    } catch (error) {
        next(error);
    }
});

// 添加好友
router.post('/addfriend', async (req: Request, res: Response, next: NextFunction) => {
    console.log(111);
    try {
        await addFriend(req, res);
    } catch (error) {
        next(error);
    }
});

// 同意添加
router.post('/agree', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await updateFriendState(req, res, 2);
    } catch (error) {
        next(error);
    }
});

// 拒绝添加
router.post('/reject', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await updateFriendState(req, res, 3);
    } catch (error) {
        next(error);
    }
});

// 拉黑
router.post('/shield', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await updateFriendState(req, res, 4);
    } catch (error) {
        next(error);
    }
});

export default router;