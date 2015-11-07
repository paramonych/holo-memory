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
