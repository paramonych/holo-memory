function getRandomFourArray() {
    var codeFour = new Array();
    for (var i = 0; i < 4; i++) {
        addRandomOneToArray(codeFour);
    }
    return codeFour;
}
function addRandomOneToArray(result) {
    result.push(CODES[Math.floor(Math.random() * CODES.length)]);
}
function addRandomOneToMap(result) {
    var letter = CODES[Math.floor(Math.random() * CODES.length)];
    mapAdd(result, letter, letter);
}
function getRandomSixMap() {
    var codeSix = newMap();
    for (var i = 0; i < 6; i++) {
        addRandomOneToMap(codeSix);
    }
    return codeSix;
}
function getRandomWordsMap(wordLength, vocabLength) {
    var vocab = newMap();
    var wordLettersArray;
    var word;
    for (var i = 0; i < vocabLength; i++) {
        wordLettersArray = new Array();
        for (var i_1 = 0; i_1 < wordLength; i_1++) {
            wordLettersArray.push(CODES[Math.floor(Math.random() * CODES.length)]);
        }
        word = wordLettersArray.join('');
        mapAdd(vocab, word, word);
    }
    return vocab;
}
