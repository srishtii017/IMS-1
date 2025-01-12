const { default: mongoose } = require("mongoose");
const { PUBLIC_DATA } = require("../../constant");

ConnectDB = async()=>{
    try {
        await mongoose.connect("mongodb://localhost:27017")
        console.log("database connected");
    } catch (error) {
        console.log(`database refused  ${error}`);
            mongoose.disconnect();
            process.exit(1)
    }
}
