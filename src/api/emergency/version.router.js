const router = require('express').Router();

router.use('/v1', require('./v1/emergency.router'));

module.exports = router;