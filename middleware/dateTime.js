const {DateTime} = require('luxon');

exports.formatDate = function (date) {
    return DateTime.fromJSDate(date).toFormat('DDDD t');
}

exports.editDate = function (date) {
    return DateTime.fromJSDate(date).toISO({suppressMilliseconds: true, includeOffset: false});
}