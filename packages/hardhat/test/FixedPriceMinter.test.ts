import chai from "chai";
import { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";
import { deployToken, deployFixedPriceMinter, initToken } from "./utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  FixedPriceMinter,
  ERC721DAOToken,
} from "../../frontend/types/typechain";
import { BigNumberish } from "@ethersproject/bignumber";

chai.use(solidity);
const { expect } = chai;

const zeroAddress = "0x0000000000000000000000000000000000000000";
const MAX_TOKENS = 10;
const TOKEN_PRICE_ETH = 0.1;
const TOKEN_PRICE = ethers.utils.parseEther(TOKEN_PRICE_ETH.toString());
const MAX_MINTS_PER_WALLET = 10;
const STARTING_BLOCK = 1;

describe("FixedPriceMinter", () => {
  let minter: FixedPriceMinter;
  let token: ERC721DAOToken;
  let deployer: SignerWithAddress,
    user: SignerWithAddress,
    user2: SignerWithAddress,
    user3: SignerWithAddress,
    creator: SignerWithAddress;
  let snapshotId: number;

  before(async () => {
    [deployer, user, user2, user3, creator] = await ethers.getSigners();
    token = await deployToken(deployer);

    const payees: string[] = [await deployer.getAddress()];
    const shares: BigNumberish[] = [100];

    minter = await deployFixedPriceMinter(
      deployer,
      creator.address,
      token.address,
      MAX_TOKENS,
      TOKEN_PRICE,
      MAX_MINTS_PER_WALLET,
      STARTING_BLOCK,
      payees,
      shares
    );

    await initToken(token, deployer.address, deployer.address, minter.address);
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send("evm_snapshot", []);
  });

  afterEach(async () => {
    await ethers.provider.send("evm_revert", [snapshotId]);
  });

  describe("Before sale is active", async () => {
    it("should not allow minting", async () => {
      await expect(
        minter.connect(user).mint(1, { value: TOKEN_PRICE })
      ).to.be.revertedWith("FixedPriceMinter: sale is not active");
    });
  });

  describe("Mint after sale is active", async () => {
    before(async () => {
      await minter.connect(creator).setSaleActive(true);
    });

    it("should mint an asset", async () => {
      await minter.connect(creator).setSaleActive(true);
      await minter.connect(user).mint(1, {
        value: TOKEN_PRICE,
      });

      expect(await token.ownerOf(1)).equals(user.address);
    });

    it("should mint multiple assets", async () => {
      await minter.connect(user).mint(3, {
        value: ethers.utils.parseEther((TOKEN_PRICE_ETH * 3).toString()),
      });

      expect(await token.ownerOf(1)).equals(user.address);
      expect(await token.ownerOf(2)).equals(user.address);
      expect(await token.ownerOf(3)).equals(user.address);
    });

    it("should mint multiple assets for multiple users", async () => {
      await minter.connect(user).mint(1, {
        value: TOKEN_PRICE,
      });
      await minter.connect(user2).mint(2, {
        value: ethers.utils.parseEther((TOKEN_PRICE_ETH * 2).toString()),
      });
      await minter.connect(user3).mint(1, {
        value: TOKEN_PRICE,
      });

      expect(await token.ownerOf(1)).equals(user.address);
      expect(await token.ownerOf(2)).equals(user2.address);
      expect(await token.ownerOf(3)).equals(user2.address);
      expect(await token.ownerOf(4)).equals(user3.address);
    });

    it("wont mint too many at once", async () => {
      const numToMint = MAX_MINTS_PER_WALLET + 1;

      await expect(
        minter.connect(user).mint(MAX_MINTS_PER_WALLET + 1, {
          value: ethers.utils.parseEther(
            (TOKEN_PRICE_ETH * numToMint).toString()
          ),
        })
      ).to.be.reverted;
    });

    it("wont exceed max supply", async () => {
      await minter.connect(user).mint(9, {
        value: ethers.utils.parseEther((TOKEN_PRICE_ETH * 9).toString()),
      });

      await expect(
        minter.connect(user).mint(2, {
          value: ethers.utils.parseEther((TOKEN_PRICE_ETH * 2).toString()),
        })
      ).to.be.revertedWith(
        "FixedPriceMinter: Minting this many would exceed supply!"
      );
    });

    it("should not mint given insufficient funds", async () => {
      await expect(
        minter.connect(user).mint(3, {
          value: ethers.utils.parseEther((TOKEN_PRICE_ETH * 2).toString()),
        })
      ).to.be.revertedWith("FixedPriceMinter: not enough ether sent!");
    });

    it("should not mint before starting block", async () => {
      await minter
        .connect(creator)
        .setStartingBlock(ethers.provider.blockNumber + 1000);

      await expect(
        minter.connect(user).mint(3, {
          value: ethers.utils.parseEther((TOKEN_PRICE_ETH * 3).toString()),
        })
      ).to.be.revertedWith("FixedPriceMinter: Sale hasn't started yet!");
    });
  });

  describe("Starting Block", async () => {
    it("should allow the creator to set the starting block", async () => {
      const newValue = STARTING_BLOCK + 123;

      await minter.connect(creator).setStartingBlock(newValue);

      expect((await minter.startingBlock()).toNumber()).equals(newValue);
    });

    it("should prevent non-creators from setting starting block", async () => {
      expect(await minter.owner()).to.not.equal(deployer.address);

      await expect(
        minter.connect(deployer).setStartingBlock(STARTING_BLOCK + 123)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Mint special", async () => {
    it("should mint to the to address", async () => {
      await minter.connect(creator).ownerMint(user.address, 2);

      expect(await token.ownerOf(1)).equals(user.address);
      expect(await token.ownerOf(2)).equals(user.address);
    });

    it("should not allow non owners to mint", async () => {
      await expect(
        minter.connect(user).ownerMint(user.address, 5)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should not allow minting more than max supply", async () => {
      minter.connect(user).mint(MAX_TOKENS, {
        value: ethers.utils.parseEther(
          (TOKEN_PRICE_ETH * MAX_TOKENS).toString()
        ),
      });

      await expect(
        minter.connect(creator).ownerMint(user.address, 1)
      ).to.be.revertedWith(
        "FixedPriceMinter: Minting this many would exceed supply!"
      );
    });
  });
});
