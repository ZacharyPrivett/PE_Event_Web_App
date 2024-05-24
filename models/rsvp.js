const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const rsvpSchema = new Schema ({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    event: {type: Schema.Types.ObjectId, ref: 'Event'},
    status: {type: String, required: [true, 'status is rquired'],
            enum: ['YES', 'NO', 'MAYBE']}
}
);

//collection name is rsvp in the database
module.exports = mongoose.model('RSVP', rsvpSchema);