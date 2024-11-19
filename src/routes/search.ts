import express, { Router, Request, Response, NextFunction } from 'express';
import { searchFriends } from '../dao/search/search';

const router: Router = express.Router();

/* POST friends listing. */
router.post('/friends', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await searchFriends(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;