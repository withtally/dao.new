// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { Contract, ContractFactory } from "ethers";
import { config, ethers } from "hardhat";
import fs from "fs";
import {
  ERC721DAOToken__factory,
  ERC721Governor__factory,
  ERC721Timelock__factory,
  FixedPriceMinter__factory,
  Multicall__factory,
  ERC721DAODeployer__factory,
  ERC721DAODeployer,
} from "../../frontend/types/typechain";

const contractAddressFile = `${config.paths.artifacts}/contracts/contractAddress.ts`;

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  if (fs.existsSync(contractAddressFile)) {
    fs.unlinkSync(contractAddressFile);
  }

  const [deployer] = await ethers.getSigners();

  await deployContract(new Multicall__factory(deployer), "Multicall");

  const tokenImpl = await deployContract(
    new ERC721DAOToken__factory(deployer),
    "ERC721DAOToken"
  );
  const timelockImpl = await deployContract(
    new ERC721Timelock__factory(deployer),
    "ERC721Timelock"
  );
  const governorImpl = await deployContract(
    new ERC721Governor__factory(deployer),
    "ERC721Governor"
  );
  const minterImpl = await deployContract(
    new FixedPriceMinter__factory(deployer),
    "FixedPriceMinter"
  );
  const deployerContract = (await deployContract(
    new ERC721DAODeployer__factory(deployer),
    "ERC721DAODeployer"
  )) as ERC721DAODeployer;

  await deployerContract.initialize(
    tokenImpl.address,
    timelockImpl.address,
    governorImpl.address,
    minterImpl.address
  );
}

async function deployContract(factory: ContractFactory, name: string) {
  const contract = await factory.deploy();
  await contract.deployed();
  saveFrontendFiles(contract, name);
  return contract;
}

// https://github.com/nomiclabs/hardhat-hackathon-boilerplate/blob/master/scripts/deploy.js
function saveFrontendFiles(contract: Contract, contractName: string) {
  const varName = contractName + "Address";
  fs.appendFileSync(
    contractAddressFile,
    `export const ${varName} = '${contract.address}'\n`
  );
  console.log("%s deployed to: %s", contractName, contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
