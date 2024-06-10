let express = require('express');
let path = require('path');

let applicationRouter = require('./routes/application');

let publicRouter = require('./routes/public');

let app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/application/', applicationRouter);
app.use('/', publicRouter);


const PORT  = process.env.PORT || 3050
app.listen(PORT,()=> console.info(`Server has started on ${PORT}`));

module.exports = app;