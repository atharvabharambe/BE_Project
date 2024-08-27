const Types = artifacts.require("Types");
const Helpers = artifacts.require("Helpers");
const Customers = artifacts.require("Customers");
const Banks = artifacts.require("Banks");
const KYC = artifacts.require("KYC");
const path = require('node:path');
const fs = require('node:fs');


module.exports = function (deployer, network, accounts) {
  console.log(accounts);

  if (network == "development") {
    deployer.deploy(Helpers);
    deployer.deploy(Types);
    deployer.link(Helpers, Customers);
    deployer.link(Types, Customers);
    deployer.deploy(Customers);
    deployer.link(Helpers, Banks);
    deployer.link(Types, Banks);
    deployer.deploy(Banks);
    deployer.deploy(KYC, "Samarth", "samarth@gmail.com").then(() => saveAddressToFile(KYC.address));
  } else {
    // For live & test networks

    deployer.deploy(Helpers);
    deployer.deploy(Types);
    deployer.link(Helpers, Customers);
    deployer.link(Types, Customers);
    deployer.deploy(Customers);
    deployer.link(Helpers, Banks);
    deployer.link(Types, Banks);
    deployer.deploy(Banks);
    deployer.deploy(KYC, "Samarth", "samarth@gmail.com").then(() => saveAddressToFile(KYC.address));
  }
};


function saveAddressToFile(address) {
  const addressJson = JSON.stringify({ "CONTRACT_ADDRESS": address });
  
  const testFilePath = path.resolve(path.join(__dirname,"..","test"), "address.json");
  fs.writeFileSync(testFilePath, addressJson, "utf8" , (err) => console.error(err));

  const frontendFilePath = path.resolve(path.join(__dirname,"..","..","front-end","src","repository"), "address.json");
  fs.writeFileSync(frontendFilePath, addressJson, "utf8" , (err) => console.error(err));
}