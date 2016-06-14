'use strict';

let Q = require('q'),
	Util = require('util'),
	DbError = require("@anzuev/studcloud.errors").DbError,
	File = require("@anzuev/studcloud.datamodels").File;



/** Добавление нового файла в коллекцию
 *
 * @param url {string} - ссылка для скачивания
 * @param publicAccess {boolean} - публичный доступ?
 * @param accessItem {object} - объект с проперти type и value
 * @param path {string} - физический путь к файлу на сервере
 * @param title {string} - заголовок файла
 * @param uploader {string} - ObjectId of user
 * @returns {object} - promise to return file or error
 */
File.statics.add = function(url, publicAccess, accessItem, path, title, uploader){
	var file = new this({
		uploader: uploader,
		access: {
			publicAccess: publicAccess
		},
		title: title,
		url: url,
		path: path
	});

	if(!publicAccess) {
		switch (accessItem.type){
			case "conversation":
				file.access.cType = "conversation";
				file.access.value = accessItem.convId;
				break;
			case "group":
				file.access.cType = 'group';
				break;
			default:
				file.access.publicAccess = true;
		}
	}
	let defer = Q.defer();

	file
		.saveFile()
		.then(function(file){
			defer.resolve(file);
		}).catch(function(err){
			defer.reject(new DbError(err, 500, Util.format("Can't save file")));
	});
	return defer.promise;

};



/** Получение файла по url
 *
 * @param url {string} - ссылка для скачивания
 * @returns {object} - promise to return file or error
 */
File.statics.getFileByUrl = function(url){
	let defer = Q.defer();
	var promise = this.find(
		{
			url: url
		}
	).exec();

	promise.then(function(file){
		if(file) defer.resolve(file);
		else {
			throw new DbError(err, 404, Util.format('No file found by url %s', url));
		}
	}).catch(function(err){
		if(err) defer.reject(new DbError(err, 500));
	});

	return defer.promise;
};




/** Получение файла по id
 *
 * @param id {string} - id файла в коллекции
 * @returns {object} - promise to return file or error
 */
File.statics.getFileById = function(id){
	let deffer = Q.defer();
	var promise = this.findById(id).exec();
	promise.then(function(file){
		if(file) deffer.resolve(file);
		else {
			throw new DbError(null, 404, Util.format('No file found by id %s', id));
		}
	}).catch(function(err){
		console.log(err);
		if(err) deffer.reject(new DbError(err, 500));
	});

	return deffer.promise;
};





/** Формотирование объекта к виду {id, uploader, path, access}
 *
 * @returns {{id: {string}, uploader: {string}, path: {string}, access: {object} }}
 */
File.methods.formatWithPath = function(){
	return {
		id: this._id,
		uploader: this.uploader,
		path: this.path,
		access: this.access
	}
};





/** Формотирование объекта к виду {id, uploader, access}
 *
 * @returns {{id: {string}, uploader: {string}, access: {object}}}
 */
File.methods.formatWithoutPath = function(){
	return {
		id: this._id,
		uploader: this.uploader,
		access: this.access
	}
};







/** Метод для отметки файла, что он используется
*   @summary Метод для отметки файла, что он используется
*   @param {boolean} save нужно ли сохранять файл после изменения проперти
*   @return {object}
 */

File.methods.setFileUsed = function(save){
	this.used = true;
	let defer = Q.defer();

	if(save){
		this.saveFile()
			.then(function(file){
				defer.resolve(file);
			})
			.catch(function(err){
				defer.reject(err);
			})
	}else{
		return true;
	}

};



/** Сохранение файла. Особенность - если происходит ошибка, то производится еще попытка сохранить файла(повторяется 5 раз)
 *
 * @returns {error|object}
 */
File.methods.saveFile = function(){
	let a = 5;
	let file;
	let File = this;
	return Q.async(function*(){
		while(a > 0){
			try{
				file = yield File.save();
				return file;
			}catch(err){
				a--;
			}
		}
		throw new DbError(null, "Can't save file");
	})();
};



module.exports = File;


