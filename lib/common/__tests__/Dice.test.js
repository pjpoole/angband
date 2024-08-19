"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("@jest/globals");
var dice_1 = require("../utilities/dice");
function makeParams(obj) {
    var _a, _b, _c, _d, _e;
    return {
        expressions: (_a = obj.expressions) !== null && _a !== void 0 ? _a : [],
        b: (_b = obj.b) !== null && _b !== void 0 ? _b : null,
        x: (_c = obj.x) !== null && _c !== void 0 ? _c : null,
        y: (_d = obj.y) !== null && _d !== void 0 ? _d : null,
        m: (_e = obj.m) !== null && _e !== void 0 ? _e : null
    };
}
(0, globals_1.describe)('Dice', function () {
    (0, globals_1.describe)('new()', function () {
        (0, globals_1.test)('basic parameters', function () {
            var params = makeParams({ b: 1 });
            var dice = new dice_1.Dice(params);
            (0, globals_1.expect)(dice.b).toEqual(1);
        });
    });
});
