enum StateType {
  'Active',
  'Silent'
}

function isActiveState(state: StateType): boolean {
  return state === StateType.Active;
}
