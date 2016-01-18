var codes = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','R','S','T'];

function getRandomFourArray(): Array<String> {
  var codeFour = new Array<String>();
  for(var i=0; i<4; i++) {
    addRandomOneToArray(codeFour);
  }
  return codeFour;
}

function addRandomOneToArray(result: Array<String>): void {
  result.push(codes[Math.floor(Math.random()*codes.length)]);
}
function addRandomOneToMap(result: Map<String>): void {
  var letter = codes[Math.floor(Math.random()*codes.length)];
  mapAdd(result, letter, letter);
}

function getRandomSixMap(): Map<String> {
  var codeSix = newMap<String>();
  for(var i=0; i<4; i++) {
    addRandomOneToMap(codeSix);
  }
  return codeSix;
}
