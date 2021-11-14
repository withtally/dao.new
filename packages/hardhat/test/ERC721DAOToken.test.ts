import chai from "chai";
import { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";
import { deployAndInitDAOToken, mineBlock } from "./utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ERC721DAOToken } from "../../frontend/types/typechain";

chai.use(solidity);
const { expect } = chai;

const zeroAddress = "0x0000000000000000000000000000000000000000";

describe("ERC721DAOToken", () => {
  let token: ERC721DAOToken;
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;
  let user2: SignerWithAddress;
  let snapshotId: number;
  let user1Address: string;
  let user2Address: string;

  before(async () => {
    [deployer, user, user2] = await ethers.getSigners();
    token = await deployAndInitDAOToken(deployer);
    user1Address = await user.getAddress();
    user2Address = await user2.getAddress();
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send("evm_snapshot", []);
  });

  afterEach(async () => {
    await ethers.provider.send("evm_revert", [snapshotId]);
  });

  it("should mint", async () => {
    expect(await token.totalSupply()).to.be.equal(0);

    const txn = await token.mint(user1Address, 0);

    expect(txn)
      .to.emit(token, "Transfer")
      .withArgs(zeroAddress, user1Address, 0);
  });

  describe("checkpoints", async () => {
    it("updates currentVotes on mint and transfer", async () => {
      expect(await token.getCurrentVotes(user1Address)).to.be.equal(0);
      expect(await token.getCurrentVotes(user2Address)).to.be.equal(0);

      await token.mint(user1Address, 0);
      expect(await token.getCurrentVotes(user1Address)).to.be.equal(1);

      await token.connect(user).transferFrom(user1Address, user2Address, 0);
      expect(await token.getCurrentVotes(user1Address)).to.be.equal(0);
      expect(await token.getCurrentVotes(user2Address)).to.be.equal(1);
    });

    it("keeps track of past votes", async () => {
      const txn1 = await (await token.mint(user1Address, 1)).wait();
      const txn2 = await (await token.mint(user1Address, 2)).wait();
      const txn3 = await (await token.mint(user1Address, 3)).wait();
      await mineBlock();

      expect(
        await token.getPriorVotes(user1Address, txn1.blockNumber)
      ).to.be.equal(1);
      expect(
        await token.getPriorVotes(user1Address, txn2.blockNumber)
      ).to.be.equal(2);
      expect(
        await token.getPriorVotes(user1Address, txn3.blockNumber)
      ).to.be.equal(3);

      const txn4 = await (
        await token.connect(user).transferFrom(user1Address, user2Address, 1)
      ).wait();
      await mineBlock();

      expect(
        await token.getPriorVotes(user1Address, txn4.blockNumber)
      ).to.be.equal(2);
      expect(
        await token.getPriorVotes(user2Address, txn4.blockNumber)
      ).to.be.equal(1);
    });

    it("keeps track of past total supply", async () => {
      const txn1 = await (await token.mint(user1Address, 1)).wait();
      const txn2 = await (await token.mint(user1Address, 2)).wait();
      const txn3 = await (await token.mint(user1Address, 3)).wait();
      await mineBlock();

      expect(await token.getPastTotalSupply(txn1.blockNumber)).to.be.equal(1);
      expect(await token.getPastTotalSupply(txn2.blockNumber)).to.be.equal(2);
    });
  });

  describe("token URI", async () => {
    it("returns placeholder SVG before base URI is set", async () => {
      await token.setBaseURIEnabled(false);
      const tokenURI: string = await token.tokenURI(123);
      expect(tokenURI).to.satisfy((s: string) =>
        s.startsWith("data:application/json;base64")
      );

      const json = JSON.parse(atob(tokenURI.split(",")[1]));
      expect(json["name"]).to.be.equal("AwesomeToken token #123");
      expect(json["description"]).to.be.equal(
        "Placeholder art for AwesomeToken token #123"
      );

      expect(json["image"]).to.satisfy((s: string) =>
        s.startsWith("data:image/svg+xml")
      );
      const svg = atob(json["image"].split(",")[1]);
      expect(svg).to.satisfy((s: string) => s.startsWith("<svg"));
    });

    it("uses baseURI once enabled", async () => {
      await (await token.mint(user1Address, 1)).wait();

      await token.setBaseURIEnabled(true);
      const tokenURI: string = await token.tokenURI(1);

      expect(tokenURI).to.be.equal("BaseURI1");
    });

    it("uses placeholder if baseURIEnabled is disabled", async () => {
      await (await token.mint(user1Address, 1)).wait();

      await token.setBaseURIEnabled(true);
      await token.setBaseURIEnabled(false);
      const tokenURI: string = await token.tokenURI(1);

      expect(tokenURI).to.satisfy((s: string) =>
        s.startsWith("data:application/json;base64")
      );
    });

    it("enables baseURI if providing non empty base uri in constructor", async () => {
      [deployer, user, user2] = await ethers.getSigners();
      const token = await deployAndInitDAOToken(
        deployer,
        undefined,
        undefined,
        undefined,
        undefined,
        "the base uri"
      );
      expect(await token.baseURIEnabled()).to.be.true;
    });

    it("disabled baseURI if providing empty base uri in constructor", async () => {
      [deployer, user, user2] = await ethers.getSigners();
      const token = await deployAndInitDAOToken(
        deployer,
        undefined,
        undefined,
        undefined,
        undefined,
        ""
      );
      expect(await token.baseURIEnabled()).to.be.false;
    });
  });
});
