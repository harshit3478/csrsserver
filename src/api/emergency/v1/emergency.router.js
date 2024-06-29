const router = require('express').Router();
const { EmergencySchemas } = require('../../../validator/schemas');
const validator = require('../../../validator/validator');
const emergencyController = require('./emergency.controller');
/**
 * @swagger
 * /emergency/v1/add:
 *   post:
 *     summary: create emergency API
 *     tags: [Emergency]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               latitude:
 *                 type: string
 *               longitude:
 *                 type: string
 *               landmark:
 *                 type: string              
 *     responses:
 *       default:
 *         description: default response
 */

router.post('/add', validator(EmergencySchemas.addEmergency, 'body'), emergencyController.createEmergency);

/**
 * @swagger
 * /emergency/v1/update/status:
 *   post:
 *     summary: Update emergency status API
 *     tags: [Emergency]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       default:
 *         description: Default response
 */


router.post('/update/status', validator(EmergencySchemas.updateStatus, 'body'),emergencyController.updateEmergency);

/**
 * @swagger
 * /emergency/v1/get:
 *   get:
 *     summary: Get emergency API
 *     tags: [Emergency]
 *     responses:
 *       default:
 *         description: Default response
 */


router.get('/get', emergencyController.getEmergencies);

/**
 * @swagger
 * /emergency/v1/get/{id}:
 *   get:
 *     summary: Get emergency by ID API
 *     tags: [Emergency]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       default:
 *         description: Default response
 */

router.get('/get/:id', emergencyController.getEmergencyById);

/**
 * @swagger
 * /emergency/v1/resolve:
 *   put:
 *     summary: Resolve emergency API
 *     tags: [Emergency]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               respondedBy:
 *                 type: string
 *               sensitivity:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       default:
 *         description: Default response
 */

router.put('/resolve', validator(EmergencySchemas.resolveEmergency , 'body') , emergencyController.resolveEmergency);




module.exports = router;