const router = require('express').Router();
const authRouter = require('./auth.routes');
const tokensRouter = require('./tokens.routes');
const userRouter = require('./users.routes');
const chatRouter = require('./chat.routes');

router.use('/auth', authRouter);
router.use('/tokens', tokensRouter);
router.use('/users', userRouter);
router.use('/chat', chatRouter);

module.exports = router;