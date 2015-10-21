function reversedArrayClone(array: Array<any>): Array<any> {
  let result = new Array<any>();
  for(let s=array.length-1; s>=0; s--) {
    result.push(array[s].clone());
  }
  return result;
}

function arrayClone(array: Array<any>): Array<any> {
  let result = new Array<any>();
  for(let s=0; s<array.length; s++) {
    result.push(array[s].clone());
  }
  return result;
}
