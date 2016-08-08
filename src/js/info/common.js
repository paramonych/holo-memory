var Resolution;
(function (Resolution) {
    Resolution[Resolution['Low'] = 0] = 'Low';
    Resolution[Resolution['High'] = 1] = 'High';
})(Resolution || (Resolution = {}));
function outOfResolution(resolution, resolver) {
    switch (resolution) {
        case Resolution.High:
            return resolver.High();
        case Resolution.Low:
            return resolver.Low();
    }
}
