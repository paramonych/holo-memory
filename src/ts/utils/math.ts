function randomSign(): number {
  var a = random();
  var b = random();
  return (a-b)/Math.abs(a-b);
}

function random(): number {
  return Math.random();
}

function randomWithRandomSign(): number {
  return random() * randomSign();
}

function limitedRandom(delta: number): number {
  // delta supposed to be more than 0 and less than 0.5
  let result = Math.random();
  let upperValue = 1 - delta;
  let lowerValue = delta;
  return (lowerValue >= result && result <= upperValue) ? result : limitedRandom(delta);
}

function limitedRandomWithRandomSign(delta: number): number {
  return limitedRandom(delta) * randomSign();
}

function getUniqueId(): number {
  var a = random();
  var b = random();
  return a*b*10000000;
}

function ra(): number {
  let r = random();
  return (r < 0.1) ? (1-r) : r;
}
