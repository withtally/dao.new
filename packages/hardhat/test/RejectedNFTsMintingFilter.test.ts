import chai from "chai";
import { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  ERC721DAOToken,
  ERC721DAOToken__factory,
} from "../../frontend/types/typechain";
import { MINTER_ROLE } from "./utils";
import { RejectedNFTsMintingFilter__factory } from "../../frontend/types/typechain/factories/RejectedNFTsMintingFilter__factory";
import { RejectedNFTsMintingFilter } from "../../frontend/types/typechain/RejectedNFTsMintingFilter";

chai.use(solidity);
const { expect } = chai;

describe("RejectedNFTsMintingFilter", async () => {
  let filter: RejectedNFTsMintingFilter;
  let signer: SignerWithAddress;
  let snapshotId: number;
  let tokens: ERC721DAOToken[] = [];
  let minter: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async () => {
    snapshotId = await ethers.provider.send("evm_snapshot", []);
  });

  afterEach(async () => {
    await ethers.provider.send("evm_revert", [snapshotId]);
  });

  before(async () => {
    [signer, minter, user1, user2] = await ethers.getSigners();

    tokens.push(await new ERC721DAOToken__factory(signer).deploy());
    await tokens[0].initialize(
      "FirstToken",
      "FT",
      "",
      [MINTER_ROLE],
      [minter.address]
    );

    tokens.push(await new ERC721DAOToken__factory(signer).deploy());
    await tokens[1].initialize(
      "SecondToken",
      "ST",
      "",
      [MINTER_ROLE],
      [minter.address]
    );

    filter = await new RejectedNFTsMintingFilter__factory(signer).deploy();
    await filter.initialize([tokens[0].address, tokens[1].address], [1, 2]);
  });

  it("reverts if initialized with wrong arity", async () => {
    const otherFilter = await new RejectedNFTsMintingFilter__factory(
      signer
    ).deploy();

    await expect(
      otherFilter.initialize([tokens[0].address], [1, 2])
    ).to.be.revertedWith(
      "RejectedNFTsMintingFilter: tokens and minBalances arity mismatch"
    );
  });

  it("returns false for a user with balance=minBalance in both tokens", async () => {
    await tokens[0].connect(minter).mint(user1.address, 1);
    await tokens[1].connect(minter).mint(user1.address, 1);
    await tokens[1].connect(minter).mint(user1.address, 2);

    expect(await filter.meetsRequirements(user1.address)).to.be.false;
  });

  it("returns false for a user with minBalance in only one token", async () => {
    await tokens[1].connect(minter).mint(user1.address, 1);
    await tokens[1].connect(minter).mint(user1.address, 2);

    expect(await filter.meetsRequirements(user1.address)).to.be.false;
  });

  it("returns true for a user with balance<minBalance in both tokens", async () => {
    await tokens[1].connect(minter).mint(user1.address, 1);

    expect(await filter.meetsRequirements(user1.address)).to.be.true;
  });
});
