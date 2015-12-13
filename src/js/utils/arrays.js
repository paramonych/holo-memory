function reversedArrayClone(array) {
    var result = new Array();
    for (var s = array.length - 1; s >= 0; s--) {
        result.push(array[s].clone());
    }
    return result;
}
function arrayClone(array) {
    var result = new Array();
    for (var s = 0; s < array.length; s++) {
        result.push(array[s].clone());
    }
    return result;
}
function appendAll(one, two) {
    for (var s = 0; s < two.length; s++) {
        one.push(two[s]);
    }
}
