var GasOptimizeSample = artifacts.require("../contracts/GasOptimizeSample");

contract('GasOptimizeSample', function(accounts) {
    var instanceFuture = GasOptimizeSample.new();

    it("Passes testcase 1 ", async function() {
        let totalGas = 0;
        let defaultValue = 1000;
        let defaultGas = 1000000;
        let instance = await instanceFuture;
        await instance.bet(2, {from: accounts[0], value: defaultValue, gas: defaultGas});
        await instance.bet(3, {from: accounts[1], value: defaultValue, gas: defaultGas});
        await instance.bet(6, {from: accounts[2], value: defaultValue, gas: defaultGas});
        await instance.bet(7, {from: accounts[3], value: defaultValue, gas: defaultGas});
        // 第五次下注前先预估一下这次调用会花费的 gas，这是基于前四次下注之后的状态
        let curGas = 0;
        curGas = await instance.bet.estimateGas(10, {from: accounts[4], value: defaultValue, gas: defaultGas}) - 21000;
        console.log(curGas);
        // 实际执行第五次下注
        await instance.bet(10, {from: accounts[4], value: defaultValue, gas: defaultGas});
        // 验证合约的处理结果
        let curBalance = 0;
        for (let i = 0; i < 5; i++) {
            curBalance = await instance.playerBalance.call({from: accounts[i], gas: defaultGas});
            assert.equal(curBalance, defaultValue);
        }
        totalGas += curGas;
        // 预估清理操作的 gas 消耗
        curGas = await instance.clearState1.estimateGas({gas: defaultGas}) - 21000;
        console.log(curGas);
        totalGas += curGas;
        console.log("Total gas for GasOptimizeSample: " + totalGas);
        // 实际执行清理操作
        await instance.clearState1({gas: defaultGas});
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
        // 第五次下注前先预估一下这次调用会花费的 gas，这是基于前四次下注之后的状态
        let curGas = 0;
        curGas = await instance.bet.estimateGas(10, {from: accounts[4], value: defaultValue, gas: defaultGas}) - 21000;
        console.log(curGas);
        // 实际执行第五次下注
        await instance.bet(8, {from: accounts[4], value: defaultValue, gas: defaultGas});
        // 验证合约的处理结果
        let curBalance = 0;
        for (let i = 0; i < 4; i++) {
            curBalance = await instance.playerBalance.call({from: accounts[i], gas: defaultGas});
            assert.equal(curBalance, 2250);
        }
        curBalance = await instance.playerBalance.call({from: accounts[4], gas: defaultGas});
        assert.equal(curBalance, 1000);
        totalGas += curGas;
        // 预估清理操作的 gas 消耗
        curGas = await instance.clearState2.estimateGas({gas: defaultGas}) - 21000;
        console.log(curGas);
        totalGas += curGas;
        console.log("Total gas for GasOptimizeSample: " + totalGas);
        // 实际执行清理操作
        await instance.clearState2({gas: defaultGas});
    });

});