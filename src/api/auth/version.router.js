const router = require('express').Router({mergeParams: true});  

router.use('/v1', require('./v1/auth.router'));
router.use('/v2', require('./v2/auth.router'));

module.exports = router;