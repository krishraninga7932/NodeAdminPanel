const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    cname : {
        type : String,
        required : true
    },
    status : {
        type : String,
        default : 'Active'
    }
}, {
    timestamps : true
});

const Category = mongoose.model('Category',CategorySchema);

module.exports = Category;