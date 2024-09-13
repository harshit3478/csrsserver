const router = require('express').Router();
const authController = require('./auth.controller');
const validator = require('../../../validator/validator');
const { authSchemasV2 } = require('../../../validator/schemas');

/**  
 * @swagger  
 * /auth/v2/signup:  
 *   post:  
 *     summary: Signup API  
 *     tags: [Auth V2]  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         application/json:  
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
 *               password:  
 *                 type: string  
 *               deviceToken:  
 *                 type: string  
 *     responses:  
 *       200:  
 *         description: User signed up successfully  
 *       400:  
 *         description: Bad request  
 *       500:  
 *         description: Internal server error  
 */  
router.post('/signup', validator(authSchemasV2.signup, 'signup'), authController.signUpWithPassword);  

/**  
 * @swagger  
 * /auth/v2/login/password:  
 *   post:  
 *     summary: Login with password  
 *     tags: [Auth V2]  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         application/json:  
 *           schema:  
 *             type: object  
 *             properties:  
 *               email:  
 *                 type: string  
 *               password:  
 *                 type: string  
 *     responses:  
 *       200:  
 *         description: User logged in successfully  
 *       401:  
 *         description: Unauthorized  
 *       500:  
 *         description: Internal server error  
 */  
router.post('/login/password', validator(authSchemasV2.loginWithPassword, 'login with password'), authController.loginWithPassword);  

/**  
 * @swagger  
 * /auth/v2/login/google:  
 *   post:  
 *     summary: Login with Google  
 *     tags: [Auth V2]  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         application/json:  
 *           schema:  
 *             type: object  
 *             properties:  
 *               idToken:  
 *                 type: string  
 *     responses:  
 *       200:  
 *         description: User logged in successfully  
 *       401:  
 *         description: Unauthorized  
 *       500:  
 *         description: Internal server error  
 */  
router.post('/login/google', validator(authSchemasV2.loginWithGoogle, 'login with google'), authController.loginWithGoogle);  

/**  
 * @swagger  
 * /auth/v2/update/password:  
 *   post:  
 *     summary: Update password  
 *     tags: [Auth V2]  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         application/json:  
 *           schema:  
 *             type: object  
 *             properties:  
 *               email:  
 *                 type: string  
 *               password:  
 *                 type: string  
 *     responses:  
 *       200:  
 *         description: Password updated successfully  
 *       400:  
 *         description: Bad request  
 *       500:  
 *         description: Internal server error  
 */  
router.post('/update/password', validator(authSchemasV2.updatePassword, 'body'), authController.updatePassword);

module.exports = router;
