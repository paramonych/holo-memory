function randomSign() {
    var a = Math.random();
    var b = Math.random();
    return (a - b) / Math.abs(a - b);
}
