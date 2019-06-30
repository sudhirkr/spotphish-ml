let express = require("express");
let app = express();

app.use(function(req, res, next) {
    console.log(`${new Date()} - ${req.method} request for ${req.url}`);
    next();
});

app.use(express.static("public"));
const port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log(`Starting server at ${port}`)
});
