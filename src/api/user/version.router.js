
const router = require('express').Router({mergeParams: true});  

router.use('/v1', require('./v1/user.router'));
module.exports = router;