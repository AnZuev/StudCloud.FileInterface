# StudCloud.FileInterface  

## Install using npm  
npm i @anzuev/studcloud.fileinterface

## Description
Модуль, который представляет собой интерфейс для взаимодействия с коллекцией files.
Модуль позволяет настраивать базу данных, с которой на данный момент нужно работать.
Для этого необходимо передать объект mongooseConnection

##API description

### Configure
```javascript
  //configure.js file
  
  
  /*
    require FileInterface Object
  */
  let FileInterface = require('@anzuev/studcloud.fileinterface');
  
  /*
    create an instance of FileInterface Object
  */
  let fileInterface = new FileInterface();
  
  /* 
    create mongooseConnection here or require it from somewhere else
  */
  let connection = mongoose.createConnection(/* settings*/);
  
  /*
    !!! It is important to configure FileInterface object(connect this module to specific db)
        If you forget to do that you are going to get an DbError 'No connection was configured for FileInterface module'
  */
  fileInterface.setConnection(connection);

  /*
    export fileInterface(using connection to specific db);
  */
  module.exports = fileInterface.get();
```

### Usage
```javascript
  // index.js file
  
  let fileInterface = require(/*path to configure.js file*/"./configure.js");
  
  let promise1 = fileInterface.add(.....);
  let promise2 = fileInterface.getFileById(...);
  
  // work with promises
  promise1.then(function(file){
    
  }).catch(function(error){
  
  });
  
  //or work with es6 generators and Q.async
  
  Q.async(function*(){
    let file = yield promise1;
    let file2 = yield promise2;
    ...
  })().done();
  
  .....
  
```


##API description

### FileInterface
- **setConnection(connection)**  
  Description: *set connection that FileInterface object will use*  
  Input: *mongoose connection. (mongoose.connect or mongoose.createConnection)*  
  Output: *void*  
  
- **get()**  
  Description: *get model(collection 'files' in db passed using method setConnection)*  
  Input: *void*  
  Output:  
  - *file model(mongoose.model)*
  - *Throw DbError(@anzuev/studcloud.errors) if model hasn't been configured yet*

### File model(fileInterface.get());
 - **add(url, publicAccess, accessItem, path, title, uploader)**  
   Description: *try to add file to files collection*  
  Input:  
     - *url - String url файла*
     - *publicAccess - Boolean is file public?*
     - *accessItem - Object only if publicAccess == false*
        - type - string accessType(group or convId)
        - value - value of convId(for group it's not used)
     - *path - String Path to file*
     - *title - String title to display*
     - *uploader - String userId who upload this file*  
       
  Output: 
     - *promise to save file and return file if everything ok*
     - *throws DbError if can't save file*  
       
 - **getFileById(id)**  
   Description: *try to get file from files collection by id*  
     
   Input:  
     - *id - String id файла*  
       
   Output:
     - *promise to return file*
        - resolve promise with file if everything ok
        - reject promise if DbError happened
     - *throws DbError if file doesn't exist*  
     
 - **formatWithPath()**
   Description: *return formatted object*  
   Input:  
     - *void*  
       
   Output:
     - *object*
        - id - String file._id
        - uploader - String file.uploader
        - path - String file.path
        - access - Object file.access
            - publicAccess - Boolean isPublic
            - cType - String type (convId or group). Exists only if publicAccess==false
            - value - String value. Exists only if cType == group     
              
 - **formatWithoutPath()**
   Description: *return formatted object*  
   Input:  
     - *void*  
       
   Output:
     - *object*
        - id - String file._id
        - uploader - String file.uploader
        - access - Object file.access
            - publicAccess - Boolean isPublic
            - cType - String type (convId or group). Exists only if publicAccess==false
            - value - String value. Exists only if cType == group 
              
 - **setFileUsed(save)**
   Description: *set file used*  
   Input:  
     - *save - Boolean. If true - file will be saved immediately*   
       
   Output:
     - *promise to save file if save == true*
        - file if everything ok
        - DbError if error happened
     - *true if save != true*  
       
         
 - **setFileUnused(save)**
   Description: *set file unused*  
   Input:  
     - *save - Boolean. If true - file will be saved immediately*    
         
   Output:
     - *promise to save file if save == true*
        - file if everything ok
        - DbError if error happened
     - *true if save != true*    
     
 - **saveFile()**
   Description: *save file*  
   Input:  
     - *void*   
         
   Output:
     - *promise to save file*
        - file if everything ok
        - DbError if error happened
  
   
