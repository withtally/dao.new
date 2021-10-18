import chai from "chai";
import { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";
import {
  deployCloneFactory,
  deployDAOToken,
  roles,
  defaultAssignees,
  attachToken,
} from "./utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  ERC721DAOToken,
  CloneFactory,
  ERC721DAOToken__factory,
} from "../../frontend/types/typechain";
import { isBytesLike } from "@ethersproject/bignumber/node_modules/@ethersproject/bytes";

chai.use(solidity);
const { expect } = chai;

const zeroAddress = "0x0000000000000000000000000000000000000000";

describe("CloneFactory", () => {
  let factory: CloneFactory;
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;
  let snapshotId: number;
  let tokenLogic: ERC721DAOToken;

  before(async () => {
    [deployer, user] = await ethers.getSigners();
    factory = await deployCloneFactory(deployer);
    tokenLogic = await deployDAOToken(deployer);
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send("evm_snapshot", []);
  });

  afterEach(async () => {
    await ethers.provider.send("evm_revert", [snapshotId]);
  });

  it("should add implementation", async () => {
    await factory.addImplementation(tokenLogic.address, "some details");

    expect(await factory.implementations(0)).equals(tokenLogic.address);
  });

  it("should clone", async () => {
    await factory.addImplementation(tokenLogic.address, "some details");
    const assignees = await defaultAssignees(deployer);
    const callData = tokenLogic.interface.encodeFunctionData("initialize", [
      "NewToken",
      "NT",
      roles,
      assignees,
    ]);

    const tx = await factory.clone(0, callData);
    const receipt = await tx.wait();

    const event = receipt.events?.find((e) => e.event == "NewClone");
    const token = attachToken(deployer, event?.args?.instance);

    expect(await token.name()).equals("NewToken");
    expect(await token.symbol()).equals("NT");
  });
});
