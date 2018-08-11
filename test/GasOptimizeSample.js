var GasOptimizeSample = artifacts.require("../contracts/GasOptimizeSample");
var testdata = require('../data/GasOptimizeSample.json');

contract('GasOptimizeSample', function(accounts) {
    var instanceFuture = GasOptimizeSample.new();
    testdata.vectors.forEach(function(v, i) {
        it("Passes test vector " + i, async function() {
            var instance = await instanceFuture;
            var result = await instance.initData(v.input[0], {gas: v.gas});
            assert.equal(result, v.output[0]);
        });
    });

    after(async function() {
        var totalGas = 0;
        var instance = await instanceFuture;
        var curGas = 0;
        for(var v of testdata.vectors) {
            curGas = await instance.distributePrizes.estimateGas(6, {gas: v.gas}) - 21000;
            console.log(curGas);
            totalGas += curGas;
        }
        console.log("Total gas for GasOptimizeSample: " + totalGas);
    });
});