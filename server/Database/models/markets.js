const mongoose = require('mongoose');

const marketsSchema = mongoose.Schema({
    id: String,
    name: String,
    sportId: String,
    type: String,
    filter: {
        type: Object,
        default: {}
    }
});

module.exports = mongoose.model('Markets', marketsSchema);