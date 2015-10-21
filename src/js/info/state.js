var StateType;
(function (StateType) {
    StateType[StateType['Active'] = 0] = 'Active';
    StateType[StateType['Silent'] = 1] = 'Silent';
})(StateType || (StateType = {}));
function isActiveState(state) {
    return state === StateType.Active;
}
