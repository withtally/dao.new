// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { Contract, ContractFactory } from "ethers";
import { config, ethers } from "hardhat";
import fs from "fs";
import {
  CloneFactory,
  CloneFactory__factory,
  ERC721DAOToken__factory,
  ERC721Governor__factory,
  ERC721Timelock__factory,
  FixedPriceMinter__factory,
  Multicall__factory,
} from "../../frontend/types/typechain";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  fs.unlinkSync(`${config.paths.artifacts}/contracts/contractAddress.ts`);

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
  const cloneFactory = (await deployContract(
    new CloneFactory__factory(deployer),
    "CloneFactory"
  )) as CloneFactory;

  // Sets the deployer as the Owner of the factory
  await cloneFactory.connect(deployer).initialize();

  await cloneFactory
    .connect(deployer)
    .addImplementation(tokenImpl.address, "token");
  await cloneFactory
    .connect(deployer)
    .addImplementation(timelockImpl.address, "timelock");
  await cloneFactory
    .connect(deployer)
    .addImplementation(governorImpl.address, "governor");
  await cloneFactory
    .connect(deployer)
    .addImplementation(minterImpl.address, "minter");
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
    `${config.paths.artifacts}/contracts/contractAddress.ts`,
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
