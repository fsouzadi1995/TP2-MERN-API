const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const { initClientDbConnection } = require('./infrastructure/db-util');
const QuickResponseManager = require('./modules/qr/QuickResponseManager');

const indexRouter = require('./routes/index');
const usuariosRouter = require('./routes/usuarios');
const licenciasRouter = require('./routes/licencias');
const asistenciasRouter = require('./routes/asistencias');
const institucionesRouter = require('./routes/instituciones');
const historicoQRRouter = require('./routes/historicoQR');
const tokenRouter = require('./routes/token');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/licencias', licenciasRouter);
app.use('/api/asistencias', asistenciasRouter);
app.use('/api/instituciones', institucionesRouter);
app.use('/api/historico', historicoQRRouter);
app.use('/api/token', tokenRouter);

global.clientConnection = initClientDbConnection();

QuickResponseManager.Initialize();

// app.listen(appConfig.port, () => {
//   console.log(`listening on port ${appConfig.port}`);
// });

module.exports = app;
