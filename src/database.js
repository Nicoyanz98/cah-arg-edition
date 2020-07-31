const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

mongoose.connect(process.env.MONGODB_URL, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(db => console.log('DB is connected'))
    .catch(err => console.log(err));

module.exports = mongoose;