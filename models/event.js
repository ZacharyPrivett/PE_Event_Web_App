const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const eventSchema = new Schema ({
    category: {type: String,  required: [true, 'Category is required'],
                enum: ['Study Group', 'Graduation Event', 'Company Event', 'Video Games', 'Sports']},
    title: {type: String, required: [true, 'Title is required']},
    hostName: {type: Schema.Types.ObjectId, ref: 'User'},
    startDate: {type: Date, required: [true, 'Start date is required']},
    endDate: {type: Date, required: [true, 'End date is required']},
    location: {type: String, required: [true, 'Location is required']},
    details: {type: String, required: [true, 'Deatails are required'], minLength: [10, 'the content should have at least 10 characters']},
    image: {type: String, required: [true, 'image is required']}   
},
{timestamps: true}
);

//collection name is events in the database
module.exports = mongoose.model('Event', eventSchema);

