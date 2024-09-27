const router = require('express').Router();
const userController = require('./user.controller');
const validator = require('../../../validator/validator');
const { userSchemasV2 } = require('../../../validator/schemas');
const uploadImage = require('../../../middlewares/helpers/uploadImage');
const AuthToken = require('../../../middlewares/guards/auth');

/**
 * @swagger
 * /user/v2/update/profile:
 *   post:
 *     summary: Update user profile
 *     tags: [User V2]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               name:
 *                 type: string
 *               rollNo:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.post(
  '/update/profile',
  AuthToken,
  uploadImage.single('image'),

  validator(userSchemasV2.updateProfile, 'updateProfile'),
  userController.updateProfile
);

/**
 * @swagger
 * /user/v2/send/notification:
 *   post:
 *     summary: send push notification
 *     tags: [User V2]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               lat:
 *                 type: string
 *               long: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.post(
  '/send/notification',
  userController.notificationAPI);

module.exports = router;