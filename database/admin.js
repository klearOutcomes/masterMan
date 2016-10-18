var mongoose = require('mongoose');
var passport = require('passport-local-mongoose');

var adminSchema = new mongoose.Schema({
    admin: {
        type: Boolean,
        default: false
    }
})

adminSchema.plugin(passport);

module.exports = mongoose.model('Admin', adminSchema);
