// eslint-disable-next-line no-undef
const CaseManagement = artifacts.require("CaseManagement");

module.exports = function (deployer) {
  deployer.deploy(CaseManagement);
};
