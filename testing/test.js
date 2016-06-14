'use strict';

let FileInterface = require('../index');

let fileInterface = new FileInterface();

let connection = mongoose.createConnection(/* settings*/);
fileInterface.setConnection(connection);

let test = fileInterface.get();




