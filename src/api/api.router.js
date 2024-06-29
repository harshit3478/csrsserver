const router = require("express").Router({ mergeParams: true });

router.use("/auth", require("./auth/version.router"));
router.use("/user", require("./user/version.router"));
router.use("/contacts", require("./contacts/version.router"));
router.use("/emergency", require("./emergency/version.router"));
router.use('/admin' , require('./admin/version.router'))

module.exports = router;