const mongoose = require("mongoose")

const DB = process.env.DATABASE;


mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log(`connection is successful`);
}).catch((err) => console.log(`no connections`));