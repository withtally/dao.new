import { task } from "hardhat/config";
import { deployContract } from "./deploy-utils";
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

const SERVICE_FEE_ADDRESS = "0x4cce31b5E734934c62f0F411BaF53c2b3e14c3f4"; // TODO update this to DAO address

task("deploy", "Deploy all contracts").setAction(async (args, { ethers }) => {
  const [deployer] = await ethers.getSigners();

  if ((await ethers.provider.getNetwork()).chainId == 1337) {
    // Deploy Multicall on localhost
    await deployContract(new Multicall__factory(deployer), "Multicall");
  }

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

  await deployContract(new SVGPlaceholder__factory(deployer), "SVGPlaceholder");

  /*
   *  Minters
   */
  const simpleMinterImpl = await deployContract(
    new FixedPriceSequentialMinter__factory(deployer),
    "FixedPriceSequentialMinter"
  );
  const idMinterImpl = await deployContract(
    new FixedPriceSpecificIDMinter__factory(deployer),
    "FixedPriceSpecificIDMinter"
  );

  /*
   *  Minting Filters
   */
  const requiredNFTMintingFilter = await deployContract(
    new RequiredNFTsMintingFilter__factory(deployer),
    "RequiredNFTsMintingFilter"
  );
  const rejectedNFTsMintingFilter = await deployContract(
    new RejectedNFTsMintingFilter__factory(deployer),
    "RejectedNFTsMintingFilter"
  );
  const compositeMintingFilter = await deployContract(
    new CompositeMintingFilter__factory(deployer),
    "CompositeMintingFilter"
  );

  /*
   *  Deployer
   */
  const deployerContract = (await deployContract(
    new ERC721DAODeployer__factory(deployer),
    "ERC721DAODeployer"
  )) as ERC721DAODeployer;

  await deployerContract.initialize(
    tokenImpl.address,
    timelockImpl.address,
    governorImpl.address,
    [simpleMinterImpl.address, idMinterImpl.address],
    [
      requiredNFTMintingFilter.address,
      rejectedNFTsMintingFilter.address,
      compositeMintingFilter.address,
    ],
    SERVICE_FEE_ADDRESS
  );
});
