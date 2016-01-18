function reversedArrayClone<r>(array: Array<r>): Array<r> {
  let result = new Array<r>();
  for(let s=array.length-1; s>=0; s--) {
    result.push((<any>array[s]).clone());
  }
  return result;
}

function arrayClone<r>(array: Array<r>): Array<r> {
  let result = new Array<r>();
  for(let s=0; s<array.length; s++) {
    result.push((<any>array[s]).clone());
  }
  return result;
}

function appendAll<r>(one: Array<r>, two: Array<r>): void {
  for(let s=0; s<two.length; s++) {
    one.push(two[s]);
  }
}
