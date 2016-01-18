enum SpikeDirection {
  Forward,
  Backeard
}

function isDirect(direction: SpikeDirection): boolean {
  return direction === SpikeDirection.Forward;
}
