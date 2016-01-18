interface Map<r> {
  [key: string]: r;
}

function newMap<r>(): Map<r> {
  return {};
}

function getByKey<r>(map: Map<r>, key: any): r {
  return map[keyToString(key)];
}

function mapHasKey<r>(map: Map<r>, key: any): boolean {
  return map[keyToString(key)] !== void 0;
}

function mapAdd<r>(map: Map<r>, key: any, value: r): void {
  map[keyToString(key)] = value;
}

function mapRemoveByKey<r>(map: Map<r>, key: any): void {
  map[keyToString(key)] = void 0;
}

function keyToString(key: any): string {
  return key.toString();
}

function toKeys<r>(map: Map<r>): Array<string> {
  let keys = new Array<string>();
  for(let key in map) {
    keys.push(key);
  }
  return keys;
}
function toValues<r>(map: Map<r>): Array<r> {
  let keys = new Array<r>();
  for(let key in map) {
    keys.push(getByKey(map, key));
  }
  return keys;
}

function mapSize<r>(map: Map<r>): number {
  let size = 0;
  for(let key in map) {
    size++;
  }
  return size;
}
