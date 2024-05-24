const model = require('../models/user');
const Event = require('../models/event');
const responce = require('../models/rsvp');

exports.new = (req, res)=>{
    res.render('./user/new');
};

exports.create = (req, res, next)=>{
    let user = new model(req.body);
    user.save()
    .then(user => {
        req.flash('success', 'Registration Successful')
        res.redirect('/users/login')
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('/users/new');
        }
        if(err.code === 11000) {
            req.flash('error', 'Email has been used');  
            return res.redirect('/users/new');
        }
        next(err);
    }); 

};

exports.getUserLogin = (req, res, next) => {
    return res.render('./user/login');
}

exports.login = (req, res, next)=>{
    let email = req.body.email;
    let password = req.body.password;
    model.findOne({ email: email })
    .then(user => {
        if (!user) {
            //console.log('Invalid Email Address');
            req.flash('error', 'Invalid Email Address');  
            res.redirect('/users/login');
        } else {
            user.comparePassword(password)
            .then(result=>{
            if(result) {
                req.session.user = {
                    id: user._id,
                    firstName: user.firstName,
                };
                req.flash('success', 'You have successfully logged in');
                res.redirect('/users/profile');
            } else {
                req.flash('error', 'Wrong Password');      
                res.redirect('/users/login');
            }
            });     
        }     
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next)=>{
    let id = req.session.user.id;
    Promise.all([model.findById(id), Event.find({hostName: id}), responce.find({user: id}).populate('event', 'title')])
    .then(results => {
        const [user, events, rsvps] = results
        //console.log(rsvps);
        res.render('./user/profile', {user, events, rsvps});
    })
    .catch(err=>next(err));
};

exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) {
            return next(err);
        } else {
            res.redirect('/'); 
        }       
    }); 
 };