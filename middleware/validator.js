const {body} = require('express-validator');
const {validationResult} = require('express-validator');

exports.validateId = (req, res, next) => {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 400;
        return next(err);
    } else {
        next();
    }  
};

exports.validateSignup = [
    body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
    body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
    body('email', 'Email must be a valid email address.').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be betwen 8 and 64 characters.').isLength({min: 8, max: 64})];

exports.validateLogin = [
    body('email', 'Email must be a valid email address.').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be betwen 8 and 64 characters.').isLength({min: 8, max: 64})];

exports.validateEvent = [
    body('category', 'Invalid category selection').notEmpty().trim().escape().isIn(['Study Group', 'Graduation Event', 
                                                        'Company Event', 'Video Games', 'Sports']),
    body('title', 'Title cannot be empty').notEmpty().trim().escape(),
    body('startDate', 'Invalid date').notEmpty().isISO8601().isAfter(Date.now().toLocaleString(), Date.toLocaleString('startDate')),
    body('endDate', 'Invalid date').notEmpty().isISO8601(),
    body('location', 'Location cannot be empty').notEmpty().trim().escape(),
    body('details', 'Details must be at least 10 characters').isLength({min: 10}).trim().escape()];

exports.validateRSVP = [
    body('rsvp', 'Invalid selection').notEmpty().trim().escape().isIn(['YES', 'NO', 'MAYBE'])];

exports.validateResult = (req, res, next)=>{
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
}