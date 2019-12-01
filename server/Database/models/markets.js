const mongoose = require('mongoose');

const marketsSchema = mongoose.Schema({
    id: String,
    name: String,
    type: String,
    children: Array
});

module.exports = mongoose.model('Markets', marketsSchema);