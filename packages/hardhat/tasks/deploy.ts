import { task } from "hardhat/config";
import { deployContract, DeployedContract } from "./deploy-utils";
import {
  ERC721DAOToken__factory,
  ERC721Governor__factory,
  ERC721Timelock__factory,
  FixedPriceSequentialMinter__factory,
  Multicall__factory,
  ERC721DAODeployer__factory,
  ERC721DAODeployer,
  FixedPriceSpecificIDMinter__factory,
  RequiredNFTsMintingFilter__factory,
  RejectedNFTsMintingFilter__factory,
  CompositeMintingFilter__factory,
  SVGPlaceholder__factory,
} from "../typechain";
import * as fs from "fs";

task("deploy", "Deploy all contracts")
  .addParam(
    "serviceFeeAddress",
    "Address of the Tally DAO receipient of minting fees (0x...)"
  )
  .addOptionalParam(
    "timelockContractAddress",
    "(Optional) Address of an existing timelock contract to use instead of deploying a new one",
    undefined
  )
  .setAction(async (args, { ethers }) => {
    const deployedContracts: DeployedContract[] = [];

    // Verifying parameters
    const serviceFeeAddress = ethers.utils.getAddress(args.serviceFeeAddress);
    console.log(`Using serviceFeeAddress: ${serviceFeeAddress}`);

    let timelockAddress = "";
    if (args.timelockContractAddress) {
      timelockAddress = ethers.utils.getAddress(args.timelockContractAddress);
      console.log(`Using existing timelock contract at: ${timelockAddress}`);
    }

    const [deployer] = await ethers.getSigners();
    console.log(`Deployer: ${deployer.address}`);
    console.log("");

    if ((await ethers.provider.getNetwork()).chainId == 1337) {
      // Deploy Multicall on localhost
      await deployContract(
        new Multicall__factory(deployer),
        "Multicall",
        deployedContracts
      );
    }

    const tokenImpl = await deployContract(
      new ERC721DAOToken__factory(deployer),
      "ERC721DAOToken",
      deployedContracts
    );

    if (timelockAddress === "") {
      const timelockImpl = await deployContract(
        new ERC721Timelock__factory(deployer),
        "ERC721Timelock",
        deployedContracts
      );
      timelockAddress = timelockImpl.address;
    }
    const governorImpl = await deployContract(
      new ERC721Governor__factory(deployer),
      "ERC721Governor",
      deployedContracts
    );

    await deployContract(
      new SVGPlaceholder__factory(deployer),
      "SVGPlaceholder",
      deployedContracts
    );

    /*
     *  Minters
     */
    const simpleMinterImpl = await deployContract(
      new FixedPriceSequentialMinter__factory(deployer),
      "FixedPriceSequentialMinter",
      deployedContracts
    );
    const idMinterImpl = await deployContract(
      new FixedPriceSpecificIDMinter__factory(deployer),
      "FixedPriceSpecificIDMinter",
      deployedContracts
    );

    /*
     *  Minting Filters
     */
    const requiredNFTMintingFilter = await deployContract(
      new RequiredNFTsMintingFilter__factory(deployer),
      "RequiredNFTsMintingFilter",
      deployedContracts
    );
    const rejectedNFTsMintingFilter = await deployContract(
      new RejectedNFTsMintingFilter__factory(deployer),
      "RejectedNFTsMintingFilter",
      deployedContracts
    );
    const compositeMintingFilter = await deployContract(
      new CompositeMintingFilter__factory(deployer),
      "CompositeMintingFilter",
      deployedContracts
    );

    /*
     *  Deployer
     */
    const deployerContract = (await deployContract(
      new ERC721DAODeployer__factory(deployer),
      "ERC721DAODeployer",
      deployedContracts
    )) as ERC721DAODeployer;

    await deployerContract.initialize(
      tokenImpl.address,
      timelockAddress,
      governorImpl.address,
      [simpleMinterImpl.address, idMinterImpl.address],
      [
        requiredNFTMintingFilter.address,
        rejectedNFTsMintingFilter.address,
        compositeMintingFilter.address,
      ],
      serviceFeeAddress
    );

    fs.writeFileSync(
      "deployed_contracts.json",
      JSON.stringify(deployedContracts, null, 2)
    );
  });
