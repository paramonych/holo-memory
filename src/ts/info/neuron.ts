enum NeuronType {
  'Medium',
  'Progeny'
}

function isMedium(type: NeuronType): boolean {
  return type === NeuronType.Medium;
}
