function checkUpperDistanceLimitFromPointToPoint(one: BABYLON.Vector3, two: BABYLON.Vector3, delta: number): boolean {
  let calculatedDistance = getDistanceBetweenTwoPoints(one, two);
  //let calculatedDistance = vectorFromTwoPoints(one, two).length();

  return (calculatedDistance ? (calculatedDistance < delta) : false);
}

function checkLowerDistanceLimitFromPointToPoint(one: BABYLON.Vector3, two: BABYLON.Vector3, delta: number): boolean {
  let calculatedDistance = getDistanceBetweenTwoPoints(one, two);
  //let calculatedDistance = vectorFromTwoPoints(one, two).length();

  return (calculatedDistance ? (calculatedDistance > delta) : false);
}

function checkDistanceFromVectorToPoint(one: Neuron, point: BABYLON.Vector3, delta: number): boolean {
  let directionVector = getSegmentVector(one.mesh.curve[0], one.mesh.curve[1]);
  let connectingVector = getSegmentVector(point, one.mesh.curve[0]);

  let calculatedDistance = getDistanceOne(directionVector, connectingVector);

  return (calculatedDistance ? (calculatedDistance < delta) : false);
}

function checkUpperDistanceLimitFromVectorToVector(one: Neuron, two: Neuron, delta: number): boolean {
  let directionVectorOne = getSegmentVector(one.mesh.curve[0], one.mesh.curve[1]);
  let directionVectorTwo = getSegmentVector(two.mesh.curve[0], two.mesh.curve[1]);
  let connectingVector = getSegmentVector(one.mesh.curve[0], two.mesh.curve[0]);

  let calculatedDistance = getDistanceTwo(directionVectorOne, directionVectorTwo, connectingVector);

  return (calculatedDistance ? (calculatedDistance < delta) : false);
}

function checkLowerDistanceLimitFromVectorToVector(one: Neuron, two: Neuron, delta: number): boolean {
  let directionVectorOne = getSegmentVector(one.mesh.curve[0], one.mesh.curve[1]);
  let directionVectorTwo = getSegmentVector(two.mesh.curve[0], two.mesh.curve[1]);
  let connectingVector = getSegmentVector(one.mesh.curve[0], two.mesh.curve[0]);

  let calculatedDistance = getDistanceTwo(directionVectorOne, directionVectorTwo, connectingVector);

  return (calculatedDistance ? (calculatedDistance > delta) : false);
}

function getDistanceOne(directionVector: BABYLON.Vector3, connectingVector: BABYLON.Vector3) : number {
  let distance = 0;

  let a = directionVector.x;
  let b = directionVector.y;
  let c = directionVector.z;

  let d = connectingVector.x;
  let e = connectingVector.y;
  let f = connectingVector.z;

  let up = Math.sqrt(Math.pow((b*f - c*e), 2) + Math.pow((c*d - a*f), 2) + Math.pow((a*e - d*b), 2));
  let down = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2) + Math.pow(c, 2));

  distance = up/down;

  return distance;
}
function getDistanceTwo(directionVectorOne: BABYLON.Vector3, directionVectorTwo: BABYLON.Vector3, connectingVector: BABYLON.Vector3) : number {
  let distance = 0;

  let a = directionVectorOne.x;
  let b = directionVectorOne.y;
  let c = directionVectorOne.z;

  let d = directionVectorTwo.x;
  let e = directionVectorTwo.y;
  let f = directionVectorTwo.z;

  let g = connectingVector.x;
  let h = connectingVector.y;
  let l = connectingVector.z;

  let up = (g*b*f + c*h*d + a*l*e - d*b*l - a*h*f - g*e*c);
  let down = Math.sqrt(Math.pow((b*f - c*e), 2) + Math.pow((c*d - a*f), 2) + Math.pow((a*e - d*b), 2));

  distance = up/down;

  return distance;
}

function getDistanceBetweenTwoPoints(one: BABYLON.Vector3, two: BABYLON.Vector3): number {

  return Math.sqrt(Math.pow((one.x - two.x),2) + Math.pow((one.y - two.y),2) + Math.pow((one.z - two.z),2));
}

function getSegmentVector(segmentStart: BABYLON.Vector3, segmentEnd: BABYLON.Vector3): BABYLON.Vector3 {
  return vectorFrom(segmentEnd.x - segmentStart.x, segmentEnd.y - segmentStart.y, segmentEnd.z - segmentStart.z);
}
