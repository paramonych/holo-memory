var SpikeDirection;
(function (SpikeDirection) {
    SpikeDirection[SpikeDirection["Forward"] = 0] = "Forward";
    SpikeDirection[SpikeDirection["Backeard"] = 1] = "Backeard";
})(SpikeDirection || (SpikeDirection = {}));
function isDirect(direction) {
    return direction === SpikeDirection.Forward;
}
