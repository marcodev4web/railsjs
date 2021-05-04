require('dotenv').config();

const mongoose = require('./src/db/mongoose');
const User = require('./src/models/User');

(async function () {
    try {
        console.log("Initializing...")
        await mongoose.$connect();
        let user = await User.findOne({username: 'admin'});

        if(!user) {
            console.log("Installing...");
            user = new User({
                username: "admin",
                fullname: "Adminstrator",
                _password: "admin",
                role: "admin"
            });
    
            await user.save();
            console.log("App is Ready!");
        } else {
            console.log("App Already Installed!");
        }
        await mongoose.disconnect()
        process.exit();
    } catch (err) {
        console.log(err);
    }
})()