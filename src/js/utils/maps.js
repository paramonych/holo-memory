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
