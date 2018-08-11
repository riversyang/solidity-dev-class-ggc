var GasOptimizeSample = artifacts.require("./GasOptimizeSample.sol");

module.exports = function(deployer, network) {
  if (network == "development") {
    deployer.deploy(GasOptimizeSample);
  }
};
