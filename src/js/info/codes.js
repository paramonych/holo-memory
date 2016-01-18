var codes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
function getRandomFourArray() {
    var codeFour = new Array();
    for (var i = 0; i < 4; i++) {
        addRandomOneToArray(codeFour);
    }
    return codeFour;
}
function addRandomOneToArray(result) {
    result.push(codes[Math.floor(Math.random() * codes.length)]);
}
function addRandomOneToMap(result) {
    var letter = codes[Math.floor(Math.random() * codes.length)];
    mapAdd(result, Math.random() * Math.random(), letter);
}
function getRandomSixMap() {
    var codeSix = newMap();
    for (var i = 0; i < 6; i++) {
        addRandomOneToMap(codeSix);
    }
    return codeSix;
}
