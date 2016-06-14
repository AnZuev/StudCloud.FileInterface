'use strict';

let File = require("./library/models/File");
let DbError = require("@anzuev/studcloud.errors").DbError;

/**
 *
 * @constructor
 */
function FileInterface(){
	/**
	 * @params model - connection.model from connection object
	 */
	let model;

	/** Set model
	 *
	 * @param connection - mongoose connection
	 */
	this.setConnection = function(connection){
		model = connection.model("File", File);
	};
	/** Get model( File + db)
	 *
	 * @returns {model}
	 */
	this.get = function(){
		if(!model){
			throw new DbError(500, null, 'No connection was configured for FileInterface module');
		}else{
			return model;
		}
	}
}


module.FileInterface = FileInterface;

