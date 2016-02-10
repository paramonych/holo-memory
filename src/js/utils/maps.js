function newMap() {
    return {};
}
function getByKey(map, key) {
    return map[keyToString(key)];
}
function mapHasKey(map, key) {
    return map[keyToString(key)] !== void 0;
}
function mapAdd(map, key, value) {
    map[keyToString(key)] = value;
}
function mapRemoveByKey(map, key) {
    map[keyToString(key)] = void 0;
}
function keyToString(key) {
    return key.toString();
}
function toKeys(map) {
    var keys = new Array();
    for (var key in map) {
        keys.push(key);
    }
    return keys;
}
function toValues(map) {
    var keys = new Array();
    for (var key in map) {
        keys.push(getByKey(map, key));
    }
    return keys;
}
function useMap(map, callback) {
    toValues(map).forEach(callback);
}
function mapSize(map) {
    var size = 0;
    for (var key in map) {
        size++;
    }
    return size;
}
