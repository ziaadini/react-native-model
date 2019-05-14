# react-native-model
A model for  work with :
* _react native [sqlite](https://github.com/craftzdog/react-native-sqlite-2)_
*  _validation_
*  _multi language_
*  _manage API URL_

### how to install

***

**_first install [sqlite2](https://github.com/craftzdog/react-native-sqlite-2)_**

``` npm install react-native-sqlite-2 --save ```

```react-native link react-native-sqlite-2```

 **_then install model_**

```npm install react-native-model```

### how to use it

***
you have to build and config your **BaseModel** then extend your models from this model

```
import {Model} from "react-native-model";
export class BaseModel extends Model {

    static BASE_URL = "https://your base domain/";//for manage your api urls
    static VERSION = "v1";//most APIs use a version, this version append to base url if you don't have it use empty quot
    static LANGUAGE="en";
    static showLog=false;//by default is true if you don't want to see raw queries in the log, set it to false;
    static DB_CONFIG = {
        db_name: "my.db",
        version: "1.0",
        display_name: "SQLite Menu Database",
        size: 200000,
    };
    static TRANSLATE={
        en:{
            _required_: "_field_ " + "is require",
            _unique_: "_field_ " + "is already taken",
            _email_: "_field_ " + "is not a valid email",
            _number_: "_field_ " + "should be a number",
            _integer_: "_field_ " + "should be an integer",
            _max_:  "maximum of"+" _field_ "+"should be"+" _validValue1_ ",
            _min_:  "minimum of"+" _field_ "+"should be"+" _validValue1_ ",
            _between_:  " value of"+" _field_ "+"should be between"+" _validValue1_ "+"and"+" _validValue2_ ",
            _string_:  " _field_ "+"should be a string",
            _maxLength_:  "max length of"+" _field_ "+"is "+" _validValue1_ ",
            _minLength_:  "min length of"+" _field_ "+"is "+" _validValue1_ ",
            //your translate
        },
        //another language like farsi :
        fa: {
            _required_: "_field_ " + "نمی تواند خالی باشد",
            _unique_: "_field_ " + "با مقدار "+"_validValue1_ "+"قبلا ثبت شده است",
            _email_: "_field_ " + "یک ایمیل معتبر نیست",
            _number_: "_field_ " + "باید یک عدد باشد",
            _integer_: "_field_ " + "باید یک عدد صحیح باشد",
            _max_:  "حداکثر مقدار"+" _field_ "+" باید"+" _validValue1_ "+"باشد",
            _min_:  "حداقل مقدار"+" _field_ "+" باید"+" _validValue1_ "+"باشد",
            _between_:  " مقدار"+" _field_ "+" باید بین"+" _validValue1_ "+"و"+" _validValue2_ "+"باشد",
            _string_:  " _field_ "+"باید یک رشته باشد",
            _maxLength_:  "حداکثر طول"+" _field_ "+" باید"+" _validValue1_ "+"کاراکتر باشد",
            _minLength_:  "حداقل طول"+" _field_ "+" باید"+" _validValue1_ "+"کاراکتر باشد",
            _compare_:  "_field_"+" و "+"_validValue1_"+" باید برابر باشند",
            //your translate
        },
    };
}
```

ok after config your base model, you can build your models here is an example of user model : 

```
import {BaseModel} from "your above baseMode";
export class UserModel extends BaseModel {

    constructor() {
        super(true,true);//first parameter: if your model has db set it true, second parameter: if your API has version
        this.createTable();//build your table if Not Exists
    }

    static getIndexUrl() {
       return this.__getUrl(["users"],{username:"ali",name:"sth"});//BASE_URL/VERSION/users?username=ali&name=sth
    }
    
    static tableName() {//return your table name
        return "user";
    }

    static table() {//your table definition
        let table;
        table = {
            id: "INTEGER PRIMARY KEY NOT NULL",
            username: "VARCHAR",
            password: "VARCHAR",
        };
        return table;
    }

    rules() {//your validation rules
        return [
            {field: ['username'], rule: 'unique'},
            {field: ['username', 'password'], rule: 'required'},
            {field:['password'], rule:'string',maxLength:50,minLength:6},
        ];
    }
}

```
_**Insert Query**_ :

``` 
async function saveModel() {
        let model = new UserModel();
        model.username = "ziaadini";
        model.password = "my pass";

        if (await model.validate()) {
            let isSaved = await model.save(false);
            console.log("is Saved", isSaved);
        } else {
            console.log('validation error is ', model.getErrors());
        }
    }
```

```
//shorter syntax
async function saveModel2() {
        let model = new UserModel();
        model.username = "ziaadini";
        model.password = "my pass";

        if (await model.save()) {
            console.log("is Saved", true);
        } else {
            console.log('validation error is ', model.getErrors());
        }
    }
```
_**validate function**_ => check validations defined in rules() method inside UserModel

_**save method**_       => insert data to user table, what is _false_ parameter?
save method by default call validate function and if model is not valid return false as a promise else return result as a promise. if set false save method don't check validation.

save method also is for update i will explain it in next lecture.

_**Select Query**_ :
```
  async function findUsers() {
        let users = await UserModel.find(new UserModel).limit(5).all();
        console.log(users);
    }
```

```
    async function findUserByID(id) {
        let user = await UserModel.find(new UserModel).where({id: id}).one();
        console.log(user);
    }
```
some point is here :
* if you pass ``new UserModel`` to the find method the result is instance of ``UserModel`` class else is an object
* ``one`` method return only one result as an object(or model instance).
* if your query has not any result ``one`` method ``resove null``
* ``all`` method return all result as array of objects(or model instance)
* in your query has not any result ``all`` method resolve empty array

_**Update Query**_ :

```
  async function updateUser(id, username) {
        let user = await UserModel.find(new UserModel).where({id: id, username: username}).one();
        if (user) {
            user.username = "new username";
            user.password = "new password";
            let isSaved = await user.save();
            if (isSaved) {
                console.info('is saved : ', isSaved);
            } else {
                console.info('errors : ', user.getErrors());
            }
        } else {
            console.log("user dos not exist");
        }
    }

```

a question is we are use ``save`` method for both ```insert``` and ```update``` query but how?
the point is if ```isNewRecord==false``` save method execute update query don't forget your model should has a primary key(here is id).
above example could change some thing like this (but not recommended) :
```
 let user=new UserModel();
    //config to update
    user.id=1;
    user.isNewRecord=false;

    user.username = "new username";
    user.password = "new password";
    let isSaved = await user.save();
```

_**translate validation errors and use multi language**_ :
just overwrite ```attributeLabels``` method inside your model, your model have to some thing like this :
```
import {BaseModel} from "models/BaseModel";

export class UserModel extends BaseModel {

    constructor() {
        super(true,true);
        this.createTable();
    }

    static getIndexUrl() {
        return this.__getUrl(["users"],{username:"ali",name:"some value"});
    }

    static tableName() {
        return "user";
    }

    static table() {
        let table;
        table = {
            id: "INTEGER PRIMARY KEY NOT NULL",
            username: "VARCHAR",
            password: "VARCHAR",
        };
        return table;
    }

    rules() {
        return [
            {field: ['username'], rule: 'unique'},
            {field: ['username', 'password'], rule: 'required'},
            {field:['password'], rule:'string',maxLength:50,minLength:6},
        ];
    }
    attributeLabels() {
        return {
            username : this.constructor.translate(this.constructor.LANGUAGE,"username"),
            password :  this.constructor.translate(this.constructor.LANGUAGE,"password"),
            //OR if you don't want use multi language
            // username:'Username',
            // password:'Password',
        }
    }
}

```

_**note : don't forget to put username and password fields in ```TRANSLATE``` object inside your base model class**_

if it's not important for you to have multi language or same translate for your attributes, you can simply use commented above codes, but not recommended.

you can use this model to work with database and i think is awesome.
this document need some additional work i will complete it later.
