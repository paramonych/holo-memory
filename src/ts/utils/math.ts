function randomSign(): number {
  var a = random();
  var b = random();
  return (a-b)/Math.abs(a-b);
}

function random(): number {
  return Math.random();
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
