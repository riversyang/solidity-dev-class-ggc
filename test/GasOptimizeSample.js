var GasOptimizeSample = artifacts.require("../contracts/GasOptimizeSample");

contract('GasOptimizeSample', function(accounts) {
    var instanceFuture = GasOptimizeSample.deployed();

    it("Passes testcase 1 " , async function() {
        let totalGas = 0;
        let defaultValue = 1000;
        let defaultGas = 1000000;
        let instance = await instanceFuture;
        await instance.bet(2, {from: accounts[0], value: defaultValue, gas: defaultGas});
        await instance.bet(3, {from: accounts[1], value: defaultValue, gas: defaultGas});
        await instance.bet(6, {from: accounts[2], value: defaultValue, gas: defaultGas});
        await instance.bet(7, {from: accounts[3], value: defaultValue, gas: defaultGas});
        //
        let curGas = 0;
        curGas = await instance.bet.estimateGas(10, {from: accounts[4], value: defaultValue, gas: defaultGas}) - 21000;
        console.log(curGas);
        //
        await instance.bet(10, {from: accounts[4], value: defaultValue, gas: defaultGas});
        //
        let curBalance = 0;
        for (let i = 0; i < 5; i++) {
            curBalance = await instance.playerBalance.call({from: accounts[i], gas: defaultGas});
            assert.equal(curBalance, defaultValue);
        }
        //
        totalGas += curGas;
        curGas = await instance.clearState.estimateGas({gas: defaultGas}) - 21000;
        console.log(curGas);
        totalGas += curGas;
        console.log("Total gas for GasOptimizeSample: " + totalGas);
        //
        await instance.clearState({gas: defaultGas});
    });

    it("Passes testcase 2 " , async function() {
        let totalGas = 0;
        let defaultValue = 1000;
        let defaultGas = 1000000;
        let instance = await instanceFuture;
        await instance.bet(5, {from: accounts[0], value: defaultValue, gas: defaultGas});
        await instance.bet(5, {from: accounts[1], value: defaultValue, gas: defaultGas});
        await instance.bet(5, {from: accounts[2], value: defaultValue, gas: defaultGas});
        await instance.bet(5, {from: accounts[3], value: defaultValue, gas: defaultGas});
        //
        let curGas = 0;
        curGas = await instance.bet.estimateGas(10, {from: accounts[4], value: defaultValue, gas: defaultGas}) - 21000;
        console.log(curGas);
        //
        await instance.bet(8, {from: accounts[4], value: defaultValue, gas: defaultGas});
        //
        let curBalance = 0;
        for (let i = 0; i < 4; i++) {
            curBalance = await instance.playerBalance.call({from: accounts[i], gas: defaultGas});
            assert.equal(curBalance, 2250);
        }
        curBalance = await instance.playerBalance.call({from: accounts[4], gas: defaultGas});
        assert.equal(curBalance, 1000);
        //
        totalGas += curGas;
        curGas = await instance.clearState.estimateGas({gas: defaultGas}) - 21000;
        console.log(curGas);
        totalGas += curGas;
        console.log("Total gas for GasOptimizeSample: " + totalGas);
        //
        await instance.clearState({gas: defaultGas});
    });

});