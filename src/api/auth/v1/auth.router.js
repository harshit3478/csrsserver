const router = require('express').Router({ mergeParams: true });
const { authSchemas } = require('../../../validator/schemas');
const authController = require('./auth.controller');
const validator = require('../../../validator/validator');

/**
 * @swagger
 * /auth/v1/signup:
 *   post:
 *     summary: Signup API
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               phone:
 *                 type: string
 *               rollNo:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               deviceToken:
 *                 type: string
 *                
 *     responses:
 *       default:
 *         description: default response
 */

router.post('/signup', validator(authSchemas.User, 'body'), authController.signUp);

/**
 * @swagger
 * /auth/v1/signup/email:
 *   post:
 *     summary: Send OTP to email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user
 *             required:
 *               - email
 *     responses:
 *       default:
 *         description: default response
 */
router.post('/signup/email', validator(authSchemas.SignUpWithEmail , 'body'), authController.signUpWithEmail);

/**
 * @swagger
 * /auth/v1/signup/phone:
 *   post:
 *     summary: Send OTP to phone
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: phone of the user
 *             required:
 *               - phone
 *     responses:
 *       default:
 *         description: default response
 */

router.post('/signup/phone', validator(authSchemas.SignUpWithPhone , 'body'), authController.signUpWithPhone);


/**
 * @swagger
 * /auth/v1/verify:
 *   post:
 *     summary: Send OTP to phone
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailOrPhone:
 *                 type: string
 *                 description: phone of the user
 *               otp:
 *                 type: string
 *                 description: OTP of the user
 *             required:
 *               - emailOrPhone
 *               - otp
 *     responses:
 *       default:
 *         description: default response
 */

router.post('/verify' , validator(authSchemas.Verify , 'body'), authController.verifyOtp);

/**
 * @swagger
 * /auth/v1/login:
 *   post:
 *     summary: login API
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: phone of the user
 *               otp:
 *                 type: string
 *                 description: OTP of the user
 *             required:
 *               - email
 *               - otp
 *     responses:
 *       default:
 *         description: default response
 */

router.post('/login' , validator(authSchemas.Login , 'body'), authController.login);

/**
 * @swagger
 * /auth/v1/login/email:
 *   post:
 *     summary: Send OTP to email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user
 *             required:
 *               - email
 *     responses:
 *       default:
 *         description: default response
 */

router.post('/login/email', validator(authSchemas.SignUpWithEmail , 'body'), authController.loginWithEmail);


module.exports = router;