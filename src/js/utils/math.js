function randomSign() {
    var a = random();
    var b = random();
    return (a - b) / Math.abs(a - b);
}
function random() {
    return Math.random();
}
function getUniqueId() {
    var a = random();
    var b = random();
    return a * b * 10000000;
}
