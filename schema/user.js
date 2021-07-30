const mongoose = require('mongoose');
Schema = mongoose.Schema;

grandparent = new Schema({ 
    name: String, 
    cpf: String, 
});

parent = new Schema({ 
    name: String, 
    cpf: String,
    parents:[grandparent], 
});

mySchema = new Schema({ 
    name: String, 
    cpf: String, 
    parents:[parent],
});

const User = mongoose.model('User',mySchema );
module.exports = User;