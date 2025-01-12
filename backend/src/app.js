const express = require("express")


const app = express()
const cors = require("cors")
const morgan = require("morgan")
const ApiError = require("./utils/ApiError")
const ErrorHandling = require("./middlewares/ErrorHandler")
app.use(cors())
app.use(morgan("dev"))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: false }))

app.use("/api/user", require("./routes/Auth.route"))
app.use("/api/consumer", require("./routes/Consumer.route"))
app.use("/api/orders", require("./routes/Order.route"))

app.use("*", (req, res) => {
    throw new ApiError(404, "page not found")
})

app.use(ErrorHandling)
module.exports = app