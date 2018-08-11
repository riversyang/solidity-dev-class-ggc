var GasOptimizeSample = artifacts.require("../contracts/GasOptimizeSample");
var testdata = require('../data/GasOptimizeSample.json');

contract('GasOptimizeSample', function(accounts) {
    var instanceFuture = GasOptimizeSample.deployed();
    testdata.vectors.forEach(function(v, i) {
        var totalGas = 0;
        it("Passes test vector " + i, async function() {
            var instance = await instanceFuture;
            await instance.initData(v.input[0], v.input[1], v.input[2], {gas: v.gas});
            //
            var curGas = 0;
            curGas = await instance.distributePrizes.estimateGas(v.input[3], {gas: v.gas}) - 21000;
            console.log(curGas);
            //
            var curBalance = 0;
            for (var i = 0; i < v.input[4].length; i++) {
                curBalance = await instance.playerBalance(v.input[4][i], {gas: v.gas});
                console.log(v.input[4][i]);
                console.log(v.output[0][i]);
                // assert.equal(curBalance, v.output[0][i]);
                console.log(curBalance);
            }
            //
            totalGas += curGas;
            curGas = await instance.clearState.estimateGas({gas: v.gas}) - 21000;
            console.log(curGas);
            totalGas += curGas;
            console.log("Total gas for GasOptimizeSample: " + totalGas);
        });
    });

    // after(async function() {
    //     var totalGas = 0;
    //     var instance = await instanceFuture;
    //     var curGas = 0;
    //     for (var v of testdata.vectors) {
    //         curGas = await instance.distributePrizes.estimateGas(v.input[3], {gas: v.gas}) - 21000;
    //         console.log(curGas);
    //         totalGas += curGas;
    //     }
    //     console.log("Total gas for GasOptimizeSample: " + totalGas);
    // });

    // after(async function() {
    //     var instance = await instanceFuture;
    //     var curBalance = 0;
    //     for (var i = 1; i < 6; i++) {
    //         curBalance = await instance.playerBalance(i);
    //         assert.equal(curBalance, 1000);
    //         console.log(curBalance);
    //     }
    //     curBalance = await instance.playerBalance(5);
    //     assert.equal(curBalance, 5000);
    //     console.log(curBalance);
    // });

    // after(async function() {
    //     var totalGas = 0;
    //     var instance = await instanceFuture;
    //     var curGas = 0;
    //     for (var v of testdata.vectors) {
    //         curGas = await instance.clearState.estimateGas({gas: v.gas}) - 21000;
    //         console.log(curGas);
    //         totalGas += curGas;
    //     }
    //     console.log("Total gas for GasOptimizeSample: " + totalGas);
    // });

});