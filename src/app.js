const express = require('express');

const app = express();

app.use("/test",(req, res) => {
    res.send("hello from the server")
})

app.listen(7000, () => {
    console.log("Searver is Successfully lisitening on port 7000");
})