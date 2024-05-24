const express = require('express');
const controller = require('../controllers/eventControllers');
const {fileUpload} = require('../middleware/fileUpload');
const {isLoggedIn, isHost, rsvp} = require('../middleware/auth');
const {validateId, validateEvent, validateRSVP} = require('../middleware/validator');



const router = express.Router();

router.get('/all', controller.events);

router.get('/newEvent', isLoggedIn, controller.newEvent);

router.post('/all', isLoggedIn, validateEvent, fileUpload, controller.create);

router.get('/:id', validateId, controller.event);

router.get('/:id/edit',  validateId, isLoggedIn, isHost,  controller.edit);

router.put('/:id',  validateId, isLoggedIn, isHost, fileUpload, validateEvent, controller.update);

router.delete('/:id',  validateId, isLoggedIn, isHost, controller.delete);

router.post('/:id/rsvp', validateId, isLoggedIn, rsvp, controller.rsvp);

module.exports = router;