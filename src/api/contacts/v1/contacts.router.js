const router = require('express').Router({mergeParams: true});
const contactController = require('./contacts.controller');
const validator = require('../../../validator/validator');
const { contactSchemas } = require('../../../validator/schemas');
/**
 * @swagger
 * /contacts/v1/get:
 *   post:
 *     summary: get contact API
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       default:
 *         description: default response
 */
router.post('/get', validator(contactSchemas.getContacts , 'body'),  contactController.getContacts);

/**
 * @swagger
 * /contacts/v1/add:
 *   post:
 *     summary: add contact API
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       default:
 *         description: default response
 */
router.post('/add', validator(contactSchemas.addContact , 'body'), contactController.addContact);


/**
 * @swagger
 * /contacts/v1/delete:
 *   post:
 *     summary: delete contact API
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       default:
 *         description: default response
 */

router.post('/delete', validator(contactSchemas.deleteContact , 'body'), contactController.deleteContact);

/**
 * @swagger
 * /contacts/v1/update:
 *   post:
 *     summary: update contact API
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       default:
 *         description: default response
 */

router.post('/update', validator(contactSchemas.updateContact , 'body'), contactController.updateContacts);

module.exports = router;