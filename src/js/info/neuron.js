var NeuronType;
(function (NeuronType) {
    NeuronType[NeuronType['Medium'] = 0] = 'Medium';
    NeuronType[NeuronType['Progeny'] = 1] = 'Progeny';
})(NeuronType || (NeuronType = {}));
function isMedium(type) {
    return type === NeuronType.Medium;
}
