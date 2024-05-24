const Event = require('../models/event');

//check if user is guest
exports.isGuest = (req, res, next) => {
    if(!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }  
};

//check if user is authenticated
exports.isLoggedIn = (req, res, next) => {
    if(req.session.user) {
        return next();
    } else {
        req.flash('error', 'You need to log in first');
        return res.redirect('/users/login');
    }  
};

//check if user is the host of the event
exports.isHost = (req, res, next) => {
    let id = req.params.id;
    Event.findById(id)
    .then(event => {
        if(event) {
            if(event.hostName == req.session.user.id) {
                return next()
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401
                return next(err);
            }
        } else {
            let err = new Error('Cannot find an event with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err))
};

//check if user is host of the event if so they cannot rsvp to there own event
exports.rsvp = (req, res, next) => {
    let id = req.params.id;
    Event.findById(id)
    .then(event => {
        if(event) {
            // console.log(event.hostName);
            // console.log(req.session.user.id);
            // console.log(event.hostName == req.session.user.id);
            if(event.hostName == req.session.user.id) {
                req.flash('error', 'Cannot RSVP to an event you are hosting')
                return res.redirect('/users/profile');
            } else {
                return next()
            }
        } else {
            let err = new Error('Cannot find an event with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err))
};