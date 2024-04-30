require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connection to DB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("DB Connected"))
.catch((error) => console.log(error));

const PORT = process.env.PORT || 5000;

// Auth Routes
app.use("/auth", require("./routes/authRoutes"));

// Admin Routes
app.use("/admin", require("./routes/adminRoutes"));

// services routes
app.use("/services", require("./routes/servicesRoutes"));

app.listen(PORT, () => {
    console.log(`server is running at ${process.env.PORT}`)
});