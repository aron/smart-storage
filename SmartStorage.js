/*
MIT Licensed - https://raw.github.com/aron/smart-storage/master/LICENSE
Copyright (c) 2010 Andy Hume (http://andyhume.net, andyhume@gmail.com)
*/

/**
* SmartStorage
* @constructor
*/
function SmartStorage(dbname) {
    if (SmartStorage.browserIsSupported()) {
        this.dbname = dbname;
    }
}

/**
* Stash a key/value in the browser store, prefixed with the dbname.
* @private
* @param {String} key The post db prefix key to store the value against.
* @param value The value to store
* @param optional expiry time in milliseconds.
*/
SmartStorage.prototype._setItemForDb = function(key, value, time, callback) {
    value = JSON.stringify(value);
    if (time) {
        value = ((new Date()).getTime() + time) + "--cache--" + value;
    }
    
    // Set and return values synchronously.
    return localStorage.setItem(this.dbname + '_' + key, value);
}

/**
* Get a value from the browser store, based on dbname and key.
* @private
* @param {String} key The key to lookup.
* @returns The requested value.
*/
SmartStorage.prototype._getItemForDb = function(key, callback) {
    var prefixed_key = this.dbname + '_' + key;
    var value = localStorage.getItem(prefixed_key);
    if (value) {
        
        // Return values synchronously.
        value = SmartStorage.getCachableValue(value);
    }
    return JSON.parse(value);
}

/**
* Remove a value from the browser store, based on dbname and key.
* @private
* @param {String} key The key to remove.
*/
SmartStorage.prototype._removeItemForDb = function(key) {
    return localStorage.removeItem(this.dbname + '_' + key);
}

/**
* Removes an entry from the browser store.
* @param {String} key The key to remove.
*/
SmartStorage.prototype.remove = function(key) {
    if (arguments.length < 1) {
        throw "SmartStorage error: remove() requires 1 argument."
    }
    return this._removeItemForDb(key);
}

/**
* Set key to the value. Overrides anything that is already set.
* @param {String} key The key to store the value against.
* @param value The value to store.
* @param optional expiry time in milliseconds.
*/
SmartStorage.prototype.set = function(key, value, time, callback) {
    if (arguments.length < 2) {
        throw "SmartStorage error: set() requires at least 2 arguments."
    }
    if (SmartStorage.typeOf(value) === "function") {
        throw "SmartStorage error: Can't store function reference."
    }
    return this._setItemForDb(key, value, time, callback);
}

/**
* Get value for passed in key.
* @param {String} key The key to lookup.
* @returns The requested value or null if it doesn't exist.
*/
SmartStorage.prototype.get = function(key, callback) {
    if (arguments.length < 1) {
        throw "SmartStorage error: get() requires 1 argument."
    }
    return this._getItemForDb(key, callback);
}


SmartStorage.getCachableValue = function(value) {
    if (value.indexOf('--cache--') > -1) {
        // If the expiry time has passed then return null.
        var time_and_value = value.split("--cache--");
        if ( ((new Date()).getTime()) > time_and_value[0] ) {
            value = null;
        } else {
            value = time_and_value[1];
        }
    }
    return value;
}


/**
* @returns {Boolean} Does the browser have localStorage API?
*/
SmartStorage.browserIsSupported = function() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) { return false; }
}
/**
* More robust typeof function. With thanks to Mr Crockford.
* @returns The type of value passed in.
*/
SmartStorage.typeOf = function(value) {
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (value instanceof Array) {
                s = 'array';
            } else
            if (value instanceof String) {
                s = 'string';
            }
        } else {
            s = 'null';
        }
    }
    return s;
};
