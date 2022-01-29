const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://ramy:7269Cyanide%23%23%40%40@cluster0.ng7uu.mongodb.net/Cluster0?retryWrites=true&w=majority',
  {
    useUnifiedTopology: true
  }
);
console.log('alo')
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
