const adminController = require('./admin.controller');
const router = require('express').Router();
const validator = require('../../../validator/validator');
const { adminSchemas } = require('../../../validator/schemas');


/**
 * @swagger
 * /admin/v1/login:
 *   post:
 *     summary: Admin login api
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       default:
 *         description: default response
 */
router.post('/login', validator(adminSchemas.login, 'body'), adminController.login);

/**
 * @swagger
 * /admin/v1/get/{token}:
 *   get:
 *     summary: Retrieve current logged-in user in admin context
 *     tags: [Admin]
 *     parameters:
 *         - in: path
 *           name: token
 *           required: true
 *           schema:
 *             type: string
 *     responses:
 *      default:
 *       description: default response
 */
router.get('/get/:token', adminController.getAdmin);

module.exports = router;