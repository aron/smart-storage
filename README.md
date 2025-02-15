SmartStorage Light
==================

This is a lightweight version of @ahume's HTML5 localStorage wrapper. It supports `get`, `set` and `remove`, including expiry dates and JSON objects.

Examples
--------

```javascript
var store = new SmartStorage("my_store");

// Store string.
store.set("key", "value");
store.get("key"); //=> "value"

// Remove string.
store.remove("key");
store.get("key"); //=> null
```

### Expiry

Store object/hash with expiry time of 2 minutes.

```javascript
store.set("my_object", {"key1": "value1", "key2": "value2"}, 120 * 1000); // Expires in 120*1000 = 2 minutes.
store.get("my_object").key2; //=> "value2"
```

Methods
-------

* `set(key, val, [expiry])` - Set key to the value. Optional expiry time in milliseconds. Overrides anything that is already set.
* `get(key)` - Get value for passed in key. Returns null if it doesn't exist.
* `remove(key)` - Remove value for passed in key.
