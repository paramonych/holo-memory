
function getRandomFourArray(): Array<String> {
  var codeFour = new Array<String>();
  for(var i=0; i<4; i++) {
    addRandomOneToArray(codeFour);
  }
  return codeFour;
}

function addRandomOneToArray(result: Array<String>): void {
  result.push(CODES[Math.floor(Math.random()*CODES.length)]);
}
function addRandomOneToMap(result: Map<String>): void {
  var letter = CODES[Math.floor(Math.random()*CODES.length)];
  mapAdd(result, letter, letter);
}

function getRandomSixMap(): Map<String> {
  var codeSix = newMap<String>();
  for(var i=0; i<6; i++) {
    addRandomOneToMap(codeSix);
  }
  return codeSix;
}

function getRandomWordsMap(wordLength: number, vocabLength: number): Map<String> {
  var vocab = newMap<String>();
  var wordLettersArray;
  var word;

  for(let i=0; i< vocabLength; i++) {
    wordLettersArray = new Array<String>();

    for(let i=0; i< wordLength; i++) {
      wordLettersArray.push(CODES[Math.floor(Math.random()*CODES.length)]);
    }

    word = wordLettersArray.join('');

    mapAdd(vocab, word, word);
  }
  return vocab;
}
