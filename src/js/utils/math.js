function randomSign() {
    var a = random();
    var b = random();
    return (a - b) / Math.abs(a - b);
}
function random() {
    return Math.random();
}
function randomWithRandomSign() {
    return random() * randomSign();
}
function limitedRandom(delta) {
    var result = Math.random();
    var upperValue = 1 - delta;
    var lowerValue = delta;
    return (lowerValue >= result && result <= upperValue) ? result : limitedRandom(delta);
}
function limitedRandomWithRandomSign(delta) {
    return limitedRandom(delta) * randomSign();
}
function getUniqueId() {
    var a = random();
    var b = random();
    return a * b * 10000000;
}
function ra() {
    var r = random();
    return (r < 0.1) ? (1 - r) : r;
}
function negate(value) {
    return (-1) * value;
}
