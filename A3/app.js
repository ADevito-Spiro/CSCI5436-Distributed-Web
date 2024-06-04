const express = require('express');
const path = require('path');

const applicationRouter = require('./routes/application');
const publicRouter = require('./routes/public');

const app = express();
app.use(express.urlencoded({extended:true}));

app.use('/application/', applicationRouter);
app.use('/', publicRouter);

const PORT  = process.env.PORT || 3050
app.listen(PORT,()=> console.info(`Server has started on ${PORT}`));

module.exports = app;