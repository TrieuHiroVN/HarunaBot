const { model, Schema } = require('mongoose');

module.exports = {
    user: model('user', new Schema({
        _id: String,
    }))
};