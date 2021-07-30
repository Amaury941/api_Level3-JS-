const mongoose = require('mongoose');
class Core {
    constructor(){
        this.startDatabase();
    }
    startDatabase() {
        mongoose.connect('mongodb://localhost:27017/api_data', {useNewUrlParser: true, useUnifiedTopology: true});
    }
}

module.exports = Core; 