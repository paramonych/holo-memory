var codes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T'];
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
    mapAdd(result, letter, letter);
}
function getRandomSixMap() {
    var codeSix = newMap();
    for (var i = 0; i < 4; i++) {
        addRandomOneToMap(codeSix);
    }
    return codeSix;
}
