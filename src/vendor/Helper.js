export function number_format(number, separator = ',', seprator_digit = 3) {
    var num = number + '';
    num = num.replace(/[^\d]/g, '');

    if (num.length > seprator_digit) {
        // console
        let expresion = '\\B(?=(?:\\d{' + seprator_digit + '})+(?!\\d))';

        expresion = new RegExp(expresion, 'g');
        // console.log('exp',expresion);
        num = num.replace(expresion, separator);
    }

    return num;
}

export function getTime() {
    const dateTime = Date.now();
    return Math.floor(dateTime / 1000);
}

/*
 object1  - object2  buy only compare key
 DELETE object2 data FROM object1 WHERE they have common key
 if value has been set then DELETE FROM object1
 WHERE object2 value is equal value parameter
 */
export function keyMines(object1, object2, value = undefined) {
    for (let key in object2) {
        if (value === undefined || (value !== undefined && object2[key] == value)) {
            delete object1[key];
        }
    }
    return object1;
}

export function commonObject(object1, object2) {
    let data = {};
    for (let key in object1) {
        if (object2[key] !== undefined && object1[key] === object2[key]) {
            data[key] = object1[key];
        }
    }
    return data;
}

export function array_sum(arrayOfObject, prop) {
    var total = 0
    for (var i = 0, _len = arrayOfObject.length; i < _len; i++) {
        total += arrayOfObject[i][prop]
    }
    return total
}

export function preparePicker(data, from, to) {
    let output = [];
    for (let key in data) {
        output.push({label: data[key][to], value: data[key][from]});
    }
    return output;
}

export function mapObject(object, callback) {
    return Object.keys(object).map(function (key) {
        return callback(object[key], key);
    });
}

export function goBack() {
    Actions.pop({refresh: {refresh: Math.random()}});
}

export function empty(obj) {
    if (!obj) {
        return true;
    }
    if (typeof obj === "string" || this.isNumeric(obj)) {//zero is empty? yes
        if (obj) {
            return false;
        }
    }

    let flag = Object.keys(obj).length === 0 && obj.constructor === Object;//check object
    if (Array.isArray(obj) && obj.length === 0) {
        flag = true;
    }
    return flag;
}


