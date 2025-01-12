const dotenv = require("dotenv")
const { PUBLIC_DATA } = require("./constant");
const app = require("./src/app");
const mongoose = require("mongoose");

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173' })); // Allow only requests from frontend port


const URI = `mongodb://localhost:27017/inventry`
const connectDb = async () => {
    try {
        await mongoose.connect(URI)
        console.log("database connected");
    } catch (error) {
        console.log(error);
    }
}
connectDb()




app.listen(PUBLIC_DATA.port, () => {
    console.log(`the app is listen at http://localhost:${PUBLIC_DATA.port}`);
})


// --views