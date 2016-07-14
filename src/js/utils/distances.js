function checkDistanceFromPointToPoint(one, two, delta) {
    var calculatedDistance = getDistanceBetweenTwoPoints(one, two);
    return (calculatedDistance ? (calculatedDistance < delta) : false);
}
function checkDistanceFromVectorToPoint(one, point, delta) {
    var directionVector = getSegmentVector(one.mesh.curve[0], one.mesh.curve[1]);
    var connectingVector = getSegmentVector(point, one.mesh.curve[0]);
    var calculatedDistance = getDistanceOne(directionVector, connectingVector);
    return (calculatedDistance ? (calculatedDistance < delta) : false);
}
function checkDistanceFromVectorToVector(one, two, delta) {
    var directionVectorOne = getSegmentVector(one.mesh.curve[0], one.mesh.curve[1]);
    var directionVectorTwo = getSegmentVector(two.mesh.curve[0], two.mesh.curve[1]);
    var connectingVector = getSegmentVector(one.mesh.curve[0], two.mesh.curve[0]);
    var calculatedDistance = getDistanceTwo(directionVectorOne, directionVectorTwo, connectingVector);
    return (calculatedDistance ? (calculatedDistance < delta) : false);
}
function getDistanceOne(directionVector, connectingVector) {
    var distance = 0;
    var a = directionVector.x;
    var b = directionVector.y;
    var c = directionVector.z;
    var d = connectingVector.x;
    var e = connectingVector.y;
    var f = connectingVector.z;
    var up = Math.sqrt(Math.pow((b * f - c * e), 2) + Math.pow((c * d - a * f), 2) + Math.pow((a * e - d * b), 2));
    var down = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2) + Math.pow(c, 2));
    distance = up / down;
    return distance;
}
function getDistanceTwo(directionVectorOne, directionVectorTwo, connectingVector) {
    var distance = 0;
    var a = directionVectorOne.x;
    var b = directionVectorOne.y;
    var c = directionVectorOne.z;
    var d = directionVectorTwo.x;
    var e = directionVectorTwo.y;
    var f = directionVectorTwo.z;
    var g = connectingVector.x;
    var h = connectingVector.y;
    var l = connectingVector.z;
    var up = (g * b * f + c * h * d + a * l * e - d * b * l - a * h * f - g * e * c);
    var down = Math.sqrt(Math.pow((b * f - c * e), 2) + Math.pow((c * d - a * f), 2) + Math.pow((a * e - d * b), 2));
    distance = up / down;
    return distance;
}
function getDistanceBetweenTwoPoints(one, two) {
    return Math.sqrt(Math.pow((one.x - two.x), 2) + Math.pow((one.y - two.y), 2) + Math.pow((one.z - two.z), 2));
}
function getSegmentVector(segmentStart, segmentEnd) {
    return vectorFrom(segmentEnd.x - segmentStart.x, segmentEnd.y - segmentStart.y, segmentEnd.z - segmentStart.z);
}
