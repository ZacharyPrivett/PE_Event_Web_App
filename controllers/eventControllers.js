const model = require('../models/event');
const responce = require('../models/rsvp');
const { formatDate, editDate } = require('../middleware/dateTime');

exports.events = (req, res, next) => {
    model.find()
    .then(events => {
        model.find().distinct('category') 
        .then(categories => res.render('./event/events', {events, categories}))
        .catch(err => next(err));
    })
    .catch(err => next(err));
};

exports.newEvent = (req, res) => {
    res.render('./event/newEvent');
};

exports.create = (req, res, next) => {
    let event = new model(req.body);
    event.image = req.file.filename;
    event.hostName = req.session.user.id
    event.save()
    .then(event => {
        req.flash('success', 'Event creation successful');
        res.redirect('/events/all'); 
    })
    .catch(err=>{
        if(err.name === 'ValidationError') {
            err.status = 400
        }
        next(err);
    });  
};

exports.event = (req, res, next) => {
    let id = req.params.id;
    model.findById(id).populate('hostName', 'firstName lastName')
    .then(event => {
        if(event) {
            responce.count({status: 'YES', event: id})
            .then(result => {
                res.render('./event/event', {event, result, formatDate});
            })
            .catch(err => next(err));
        } else {
        let err = new Error('Cannot find a event with id ' + id);
        err.status = 404;
        next(err);
        } 
    })
    .catch(err => next(err)); 
};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    const categories = ['Study Group', 'Graduation Event', 'Company Event', 'Video Games', 'Sports'];
    model.findById(id)
    .then(event =>{
        if(event) {
            res.render('./event/edit', {event, editDate, categories});
        } else {
            let err = new Error('Cannot find an event with id ' + id);
            err.status = 404;
            next(err);
        }  
    })
    .catch(err => next(err));
};

exports.update = (req, res, next) => {
    let event = req.body;
    let id = req.params.id;
    if (req.file) {
        event.image = req.file.filename;
    }
    model.findByIdAndUpdate(id, event, {useFindAndModify: false, runValidators: true})
    .then(event => {
        if(event) {
            req.flash('success', 'Event update successful');
            res.redirect('/events/' + id);  
        } else {
            let err = new Error('Cannot find an event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => {
        if(err.name === 'ValidationError')
            err.status = 400;
        next(err)
    });
};

exports.delete = (req, res, next) => {
    let id = req.params.id;
    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(event => {
        if(event) {
            responce.deleteMany({event: id})
            .then(result => {
                req.flash('success', 'Event deleted')
                res.redirect('/events/all');
            })
            .catch(err => next(err));
        } else {
            let err = new Error('Cannot find an event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

exports.rsvp = (req, res, next) => {
    let rsvp = new responce(req.body);
    rsvp.user = req.session.user.id;
    rsvp.event = req.params.id;
    responce.findOne({user: req.session.user.id, event: req.params.id})
    .then(result => {
        if(result) {
        //console.log(result);
        responce.findOneAndUpdate({user: req.session.user.id, event: req.params.id}, {status: rsvp.status })
        .then(rsvp => {
            req.flash('success', 'RSVP update successful');
            return res.redirect('/users/profile');
        })
        .catch(err=>{
            if(err.name === 'ValidationError') {
                err.status = 400
            }
            next(err);
        });
        } else {
            rsvp.save()
            .then(rsvp => {
                req.flash('success', 'RSVP successful');
                return res.redirect('/users/profile');
            })
            .catch(err=>{
                if(err.name === 'ValidationError') {
                    err.status = 400
                }
                next(err);
            }); 
        }
    })
}