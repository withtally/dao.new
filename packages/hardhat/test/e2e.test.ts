import chai from "chai";
import { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";
import {
  deployToken,
  deployTimelock,
  deployGovernor,
  deployMinter,
  propose,
  hashString,
  advanceBlocks,
  setNextBlockTimestamp,
  createTransferProp,
  deployAndInitDeployer,
  MINTER_ADMIN_ROLE,
  BURNER_ADMIN_ROLE,
  BASE_URI_ADMIN_ROLE,
  MINTER_ROLE,
  BURNER_ROLE,
  BASE_URI_ROLE,
  DEFAULT_ADMIN_ROLE,
  ADMINS_ADMIN_ROLE,
  proposeAndExecute,
} from "./utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  FixedPriceSequentialMinter,
  ERC721DAOToken,
  ERC721Governor,
  ERC721Timelock,
  ERC721Timelock__factory,
  ERC721DAOToken__factory,
  ERC721Governor__factory,
  FixedPriceSequentialMinter__factory,
  FixedPriceSpecificIDMinter__factory,
  FixedPriceSpecificIDMinter,
  RequiredNFTsMintingFilter,
} from "../../frontend/types/typechain";
import { ERC721DAODeployer } from "../../frontend/types/typechain/ERC721DAODeployer";
import { Wallet } from "@ethersproject/wallet";
import { RequiredNFTsMintingFilter__factory } from "../../frontend/types/typechain/factories/RequiredNFTsMintingFilter__factory";

chai.use(solidity);
const { expect } = chai;
const zeroAddress = "0x0000000000000000000000000000000000000000";

// Token Config
const BASE_URI =
  "ipfs://bafybeif4s7oom2ch6iv42yn7la4b3dnkud2dgujmnhuxuswekx4l6yz4me/";

// Minter Config
const MAX_TOKENS = 10;
const TOKEN_PRICE = 100;
const MAX_MINTS_PER_WALLET = 10;
const STARTING_BLOCK = 1;
const TOTAL_SHARES = 10000;
const FOUNDER_REWARD = 0.05;
const FOUNDER_SHARES = FOUNDER_REWARD * TOTAL_SHARES;
const DAO_SHARES = TOTAL_SHARES - FOUNDER_SHARES;

// Governance Config
const PROP_THRESHOLD = 1;
const QUORUM_NUMERATOR = 1; // 1%
const VOTING_PERIOD = 5_760; // About 24 hours with 15s blocks
const VOTING_DELAY = 1; // 1 block
const TIMELOCK_DELAY = 172_800; // 2 days

let signer: SignerWithAddress;
let user1: SignerWithAddress;
let user2: SignerWithAddress;
let user3: SignerWithAddress;
let rando: SignerWithAddress;
let creator: Wallet;

let tokenImpl: ERC721DAOToken;
let timelockImpl: ERC721Timelock;
let governorImpl: ERC721Governor;
let simpleMinterImpl: FixedPriceSequentialMinter;
let idMinterImpl: FixedPriceSpecificIDMinter;
let requiredNFTFilterImpl: RequiredNFTsMintingFilter;

let token: ERC721DAOToken;
let timelock: ERC721Timelock;
let governor: ERC721Governor;
let simpleMinter: FixedPriceSequentialMinter;
let idMinter: FixedPriceSpecificIDMinter;
let deployer: ERC721DAODeployer;
let requiredToken: ERC721DAOToken;

const deploy = async () => {
  [signer, user1, user2, user3, rando] = await ethers.getSigners();

  creator = new Wallet(Wallet.createRandom().privateKey, signer.provider);

  const giveCreatorEth = {
    to: creator.address,
    value: ethers.utils.parseEther("50"),
  };
  await user1.sendTransaction(giveCreatorEth);

  // Deploy logic contracts
  tokenImpl = await deployToken(signer);
  timelockImpl = await deployTimelock(signer);
  governorImpl = await deployGovernor(signer);
  simpleMinterImpl = await deployMinter(signer);
  idMinterImpl = await new FixedPriceSpecificIDMinter__factory(signer).deploy();
  requiredNFTFilterImpl = await new RequiredNFTsMintingFilter__factory(
    signer
  ).deploy();

  deployer = await deployAndInitDeployer(
    signer,
    tokenImpl,
    timelockImpl,
    governorImpl,
    [simpleMinterImpl.address, idMinterImpl.address],
    [requiredNFTFilterImpl.address]
  );
};

const cloneWithFixedPriceSequentialMinter = async () => {
  const tx = await deployer.clone(
    creator.address,
    {
      name: "MyToken",
      symbol: "MT",
      baseURI: BASE_URI,
    },
    {
      name: "GovName",
      proposalThreshold: PROP_THRESHOLD,
      votingDelay: VOTING_DELAY,
      votingPeriod: VOTING_PERIOD,
      quorumNumerator: QUORUM_NUMERATOR,
      timelockDelay: TIMELOCK_DELAY,
    },
    {
      implementationIndex: 0,
      startingBlock: STARTING_BLOCK,
      creatorShares: FOUNDER_SHARES,
      daoShares: DAO_SHARES,
      extraInitCallData: simpleMinterImpl.interface.encodeFunctionData("init", [
        MAX_TOKENS,
        TOKEN_PRICE,
        MAX_MINTS_PER_WALLET,
      ]),
    },
    {
      useMintingFilter: false,
      implementationIndex: 0,
      initCallData: [],
    }
  );
  const receipt = await tx.wait();
  const event = receipt.events?.find((e) => e.event == "NewClone");

  token = new ERC721DAOToken__factory(signer).attach(event?.args?.token);
  timelock = new ERC721Timelock__factory(signer).attach(event?.args?.timelock);
  governor = new ERC721Governor__factory(signer).attach(event?.args?.governor);
  simpleMinter = new FixedPriceSequentialMinter__factory(signer).attach(
    event?.args?.minter
  );

  await simpleMinter.connect(creator).unpause();
};

const cloneWithIDMinter = async () => {
  const tx = await deployer.clone(
    creator.address,
    {
      name: "MyToken",
      symbol: "MT",
      baseURI: BASE_URI,
    },
    {
      name: "GovName",
      proposalThreshold: PROP_THRESHOLD,
      votingDelay: VOTING_DELAY,
      votingPeriod: VOTING_PERIOD,
      quorumNumerator: QUORUM_NUMERATOR,
      timelockDelay: TIMELOCK_DELAY,
    },
    {
      implementationIndex: 1,
      startingBlock: STARTING_BLOCK,
      creatorShares: FOUNDER_SHARES,
      daoShares: DAO_SHARES,
      extraInitCallData: idMinterImpl.interface.encodeFunctionData("init", [
        MAX_TOKENS,
        TOKEN_PRICE,
      ]),
    },
    {
      useMintingFilter: false,
      implementationIndex: 0,
      initCallData: [],
    }
  );
  const receipt = await tx.wait();
  const event = receipt.events?.find((e) => e.event == "NewClone");

  token = new ERC721DAOToken__factory(signer).attach(event?.args?.token);
  timelock = new ERC721Timelock__factory(signer).attach(event?.args?.timelock);
  governor = new ERC721Governor__factory(signer).attach(event?.args?.governor);
  idMinter = new FixedPriceSpecificIDMinter__factory(signer).attach(
    event?.args?.minter
  );

  await idMinter.connect(creator).unpause();
};

const cloneWithSequentialMinterAndRequiredNFTFilter = async () => {
  requiredToken = await new ERC721DAOToken__factory(signer).deploy();
  await requiredToken.initialize(
    "Name",
    "Symbol",
    "baseURI",
    [MINTER_ROLE],
    [signer.address]
  );

  const tx = await deployer.clone(
    creator.address,
    {
      name: "MyToken",
      symbol: "MT",
      baseURI: BASE_URI,
    },
    {
      name: "GovName",
      proposalThreshold: PROP_THRESHOLD,
      votingDelay: VOTING_DELAY,
      votingPeriod: VOTING_PERIOD,
      quorumNumerator: QUORUM_NUMERATOR,
      timelockDelay: TIMELOCK_DELAY,
    },
    {
      implementationIndex: 0,
      startingBlock: STARTING_BLOCK,
      creatorShares: FOUNDER_SHARES,
      daoShares: DAO_SHARES,
      extraInitCallData: simpleMinterImpl.interface.encodeFunctionData("init", [
        MAX_TOKENS,
        TOKEN_PRICE,
        MAX_MINTS_PER_WALLET,
      ]),
    },
    {
      useMintingFilter: true,
      implementationIndex: 0,
      initCallData: requiredNFTFilterImpl.interface.encodeFunctionData(
        "initialize",
        [[requiredToken.address], [2]]
      ),
    }
  );
  const receipt = await tx.wait();
  const event = receipt.events?.find((e) => e.event == "NewClone");

  token = new ERC721DAOToken__factory(signer).attach(event?.args?.token);
  timelock = new ERC721Timelock__factory(signer).attach(event?.args?.timelock);
  governor = new ERC721Governor__factory(signer).attach(event?.args?.governor);
  simpleMinter = new FixedPriceSequentialMinter__factory(signer).attach(
    event?.args?.minter
  );

  await simpleMinter.connect(creator).unpause();
};

describe("End to end flows", () => {
  before(deploy);

  describe("Using FixedPriceSequentialMinter", async () => {
    before(cloneWithFixedPriceSequentialMinter);

    it("lets users mint", async () => {
      let expectedMinterBalance = 0;
      expect(await ethers.provider.getBalance(simpleMinter.address)).to.equal(
        expectedMinterBalance
      );

      await simpleMinter.connect(user1).mint(4, {
        value: TOKEN_PRICE * 4,
      });
      expectedMinterBalance += TOKEN_PRICE * 4;
      expect(await ethers.provider.getBalance(simpleMinter.address)).to.equal(
        expectedMinterBalance
      );

      await simpleMinter.connect(user2).mint(1, {
        value: TOKEN_PRICE,
      });
      expectedMinterBalance += TOKEN_PRICE;
      expect(await ethers.provider.getBalance(simpleMinter.address)).to.equal(
        expectedMinterBalance
      );

      await simpleMinter.connect(user3).mint(1, {
        value: TOKEN_PRICE,
      });
      expectedMinterBalance += TOKEN_PRICE;
      expect(await ethers.provider.getBalance(simpleMinter.address)).to.equal(
        expectedMinterBalance
      );

      expect(await token.ownerOf(1)).equals(user1.address);
      expect(await token.ownerOf(2)).equals(user1.address);
      expect(await token.ownerOf(3)).equals(user1.address);
      expect(await token.ownerOf(4)).equals(user1.address);
      expect(await token.ownerOf(5)).equals(user2.address);
      expect(await token.ownerOf(6)).equals(user3.address);
    });

    it("allows founder and DAO to withdraw minting funds", async () => {
      const totalSupply = await token.totalSupply();
      const totalProceeds = TOKEN_PRICE * totalSupply.toNumber();
      expect(await ethers.provider.getBalance(simpleMinter.address)).to.equal(
        totalProceeds
      );
      expect(await ethers.provider.getBalance(timelock.address)).to.equal(0);
      const expectedFounderProfit = FOUNDER_REWARD * totalProceeds;
      const expectedDAOProfit = totalProceeds - expectedFounderProfit;

      await expect(() =>
        simpleMinter.release(creator.address)
      ).to.changeEtherBalance(creator, expectedFounderProfit);
      await simpleMinter.release(timelock.address);
      expect(await ethers.provider.getBalance(timelock.address)).to.equal(
        expectedDAOProfit
      );
    });

    it("allows DAO to spend via proposals", async () => {
      const targets = [rando.address];
      const values = [TOKEN_PRICE];
      const callDatas = ["0x"];
      const description = "description";
      const descriptionHash = hashString(description);

      const propInfo = createTransferProp(rando.address, TOKEN_PRICE);

      const proposalId = await propose(user1, governor, propInfo);
      await advanceBlocks(VOTING_DELAY);

      await governor.connect(user1).castVote(proposalId, 1);
      await advanceBlocks(VOTING_PERIOD);

      await governor.queue(targets, values, callDatas, descriptionHash);
      const eta = await governor.proposalEta(proposalId);
      await setNextBlockTimestamp(eta.toNumber(), false);

      expect(() =>
        governor.execute(targets, values, callDatas, descriptionHash)
      ).to.changeEtherBalance(rando, TOKEN_PRICE);
    });

    describe("Governance Parameter Changes", async () => {
      it("allows changing proposal threshold via proposals", async () => {
        const newValue = (await governor.proposalThreshold()).add(1);
        const calldata = governor.interface.encodeFunctionData(
          "setProposalThreshold",
          [newValue]
        );

        await proposeAndExecute(user1, governor, {
          targets: [governor.address],
          values: [0],
          callDatas: [calldata],
          description: "description",
          descriptionHash: hashString("description"),
        });

        expect(await governor.proposalThreshold()).to.equal(newValue);
      });

      it("allows changing voting delay via proposals", async () => {
        const newValue = (await governor.votingDelay()).add(1);
        const calldata = governor.interface.encodeFunctionData(
          "setVotingDelay",
          [newValue]
        );

        await proposeAndExecute(user1, governor, {
          targets: [governor.address],
          values: [0],
          callDatas: [calldata],
          description: "description",
          descriptionHash: hashString("description"),
        });

        expect(await governor.votingDelay()).to.equal(newValue);
      });

      it("allows changing voting period via proposals", async () => {
        const newValue = (await governor.votingPeriod()).add(1);
        const calldata = governor.interface.encodeFunctionData(
          "setVotingPeriod",
          [newValue]
        );

        await proposeAndExecute(user1, governor, {
          targets: [governor.address],
          values: [0],
          callDatas: [calldata],
          description: "description",
          descriptionHash: hashString("description"),
        });

        expect(await governor.votingPeriod()).to.equal(newValue);
      });

      it("allows changing quorum numerator via proposals", async () => {
        const newValue = (await governor.quorumNumerator()).add(1);
        const calldata = governor.interface.encodeFunctionData(
          "updateQuorumNumerator",
          [newValue]
        );

        await proposeAndExecute(user1, governor, {
          targets: [governor.address],
          values: [0],
          callDatas: [calldata],
          description: "description",
          descriptionHash: hashString("description"),
        });

        expect(await governor.quorumNumerator()).to.equal(newValue);
      });
    });

    describe("With MintingFilter", async () => {
      before(async () => {
        await cloneWithSequentialMinterAndRequiredNFTFilter();

        requiredToken.connect(signer).mint(user3.address, 1);
        requiredToken.connect(signer).mint(user3.address, 2);
        requiredToken.connect(signer).mint(user2.address, 3);
      });

      it("blocks minting for users who don't have enough of the filter token", async () => {
        await expect(
          simpleMinter.connect(user1).mint(1, {
            value: TOKEN_PRICE,
          })
        ).to.be.revertedWith(
          "ERC721Minter: mintingFilter requirements not met"
        );

        await expect(
          simpleMinter.connect(user2).mint(1, {
            value: TOKEN_PRICE,
          })
        ).to.be.revertedWith(
          "ERC721Minter: mintingFilter requirements not met"
        );
      });

      it("allows minting for users who have enough of the filter token", async () => {
        const expectedBalance = (await token.balanceOf(user3.address)).add(1);

        await simpleMinter.connect(user3).mint(1, {
          value: TOKEN_PRICE,
        });

        expect(await token.balanceOf(user3.address)).to.equal(expectedBalance);
      });
    });
  });

  describe("Using FixedPriceSpecificIDMinter", async () => {
    before(cloneWithIDMinter);

    it("lets users mint", async () => {
      let expectedMinterBalance = 0;
      expect(await ethers.provider.getBalance(idMinter.address)).to.equal(
        expectedMinterBalance
      );

      await idMinter.connect(user1).mint(0, {
        value: TOKEN_PRICE,
      });
      expectedMinterBalance += TOKEN_PRICE;
      expect(await ethers.provider.getBalance(idMinter.address)).to.equal(
        expectedMinterBalance
      );

      await idMinter.connect(user2).mint(1, {
        value: TOKEN_PRICE,
      });
      expectedMinterBalance += TOKEN_PRICE;
      expect(await ethers.provider.getBalance(idMinter.address)).to.equal(
        expectedMinterBalance
      );

      await idMinter.connect(user3).mint(2, {
        value: TOKEN_PRICE,
      });
      expectedMinterBalance += TOKEN_PRICE;
      expect(await ethers.provider.getBalance(idMinter.address)).to.equal(
        expectedMinterBalance
      );

      expect(await token.ownerOf(0)).equals(user1.address);
      expect(await token.ownerOf(1)).equals(user2.address);
      expect(await token.ownerOf(2)).equals(user3.address);
    });

    it("allows founder and DAO to withdraw minting funds", async () => {
      const totalSupply = await token.totalSupply();
      const totalProceeds = TOKEN_PRICE * totalSupply.toNumber();
      expect(await ethers.provider.getBalance(idMinter.address)).to.equal(
        totalProceeds
      );
      expect(await ethers.provider.getBalance(timelock.address)).to.equal(0);
      const expectedFounderProfit = FOUNDER_REWARD * totalProceeds;
      const expectedDAOProfit = totalProceeds - expectedFounderProfit;

      await expect(() =>
        idMinter.release(creator.address)
      ).to.changeEtherBalance(creator, expectedFounderProfit);
      await idMinter.release(timelock.address);
      expect(await ethers.provider.getBalance(timelock.address)).to.equal(
        expectedDAOProfit
      );
    });

    describe("With NFTHolderMintingFilter", async () => {
      before(async () => {
        const otherToken = await new ERC721DAOToken__factory(signer).deploy();
        await otherToken.initialize(
          "Name",
          "Symbol",
          "baseURI",
          [MINTER_ROLE],
          [signer.address]
        );

        const deployedFilter = await new RequiredNFTsMintingFilter__factory(
          signer
        ).deploy();
        await deployedFilter.initialize([otherToken.address], [2]);

        await idMinter
          .connect(creator)
          .setMintingFilter(deployedFilter.address);

        otherToken.connect(signer).mint(user3.address, 1);
        otherToken.connect(signer).mint(user3.address, 2);
        otherToken.connect(signer).mint(user2.address, 3);
      });

      it("blocks minting for users who don't have enough of the filter token", async () => {
        await expect(
          idMinter.connect(user1).mint(1, {
            value: TOKEN_PRICE,
          })
        ).to.be.revertedWith(
          "ERC721Minter: mintingFilter requirements not met"
        );

        await expect(
          idMinter.connect(user2).mint(1, {
            value: TOKEN_PRICE,
          })
        ).to.be.revertedWith(
          "ERC721Minter: mintingFilter requirements not met"
        );
      });

      it("allows minting for users who have enough of the filter token", async () => {
        const expectedBalance = (await token.balanceOf(user3.address)).add(1);

        await idMinter.connect(user3).mint(1234, {
          value: TOKEN_PRICE,
        });

        expect(await token.balanceOf(user3.address)).to.equal(expectedBalance);
      });
    });
  });

  describe("Token Roles", async () => {
    before(cloneWithIDMinter);

    it("creator is admin of all roles: minter, burner and base URI, and doesn't have default admin", async () => {
      expect(await token.hasRole(MINTER_ADMIN_ROLE, creator.address)).to.be
        .true;
      expect(await token.hasRole(BURNER_ADMIN_ROLE, creator.address)).to.be
        .true;
      expect(await token.hasRole(BASE_URI_ADMIN_ROLE, creator.address)).to.be
        .true;

      // DEFAULT_ADMIN_ROLE can be risky, best not to have it.
      expect(await token.hasRole(DEFAULT_ADMIN_ROLE, creator.address)).to.be
        .false;
    });

    it("creator can assign minter, burner and base URI roles", async () => {
      await token.connect(creator).grantRole(MINTER_ROLE, rando.address);
      await token.connect(creator).grantRole(BURNER_ROLE, user3.address);
      await token.connect(creator).grantRole(BASE_URI_ROLE, user2.address);
    });

    it("creator can assign the admin roles to the DAO", async () => {
      await token
        .connect(creator)
        .grantRole(MINTER_ADMIN_ROLE, timelock.address);
      await token
        .connect(creator)
        .grantRole(BURNER_ADMIN_ROLE, timelock.address);
      await token
        .connect(creator)
        .grantRole(BASE_URI_ADMIN_ROLE, timelock.address);
      await token
        .connect(creator)
        .grantRole(ADMINS_ADMIN_ROLE, timelock.address);

      expect(await token.hasRole(MINTER_ADMIN_ROLE, timelock.address)).to.be
        .true;
      expect(await token.hasRole(BURNER_ADMIN_ROLE, timelock.address)).to.be
        .true;
      expect(await token.hasRole(BASE_URI_ADMIN_ROLE, timelock.address)).to.be
        .true;
      expect(await token.hasRole(ADMINS_ADMIN_ROLE, timelock.address)).to.be
        .true;
    });

    it("creator can renounce admin roles and then cannot assign roles any longer", async () => {
      await token
        .connect(creator)
        .renounceRole(MINTER_ADMIN_ROLE, creator.address);
      await token
        .connect(creator)
        .renounceRole(BURNER_ADMIN_ROLE, creator.address);
      await token
        .connect(creator)
        .renounceRole(BASE_URI_ADMIN_ROLE, creator.address);

      await expect(
        token.connect(creator).grantRole(MINTER_ROLE, user1.address)
      ).to.revertedWith(
        `AccessControl: account ${creator.address.toLowerCase()} is missing role 0x70480ee89cb38eff00b7d23da25713d52ce19c6ed428691d22c58b2f615e3d67`
      );
      await expect(
        token.connect(creator).grantRole(BURNER_ROLE, user2.address)
      ).to.revertedWith(
        `AccessControl: account ${creator.address.toLowerCase()} is missing role 0xc8d1ad9d415224b751d781cc8214ccfe7c47716e13229475443f04f1ebddadc6`
      );
      await expect(
        token.connect(creator).grantRole(BASE_URI_ROLE, user3.address)
      ).to.revertedWith(
        `AccessControl: account ${creator.address.toLowerCase()} is missing role 0xe0d0d9e49dfab9a7a7b34707b3c82b3f11c47969a80cdc398ea138bce37e99a9`
      );
    });

    it("creator can renounce the super admin role, and then cannot assign admin roles", async () => {
      expect(await token.hasRole(ADMINS_ADMIN_ROLE, creator.address)).to.be
        .true;
      await token
        .connect(creator)
        .renounceRole(ADMINS_ADMIN_ROLE, creator.address);
      expect(await token.hasRole(ADMINS_ADMIN_ROLE, creator.address)).to.be
        .false;

      await expect(
        token.connect(creator).grantRole(ADMINS_ADMIN_ROLE, timelock.address)
      ).to.be.revertedWith(
        `AccessControl: account ${creator.address.toLowerCase()} is missing role 0x778f133ac0489209d5e8c78e45e9d0226a824164fd90f9892f5d8214632583e0'`
      );
      await expect(
        token.connect(creator).grantRole(MINTER_ADMIN_ROLE, timelock.address)
      ).to.be.revertedWith(
        `AccessControl: account ${creator.address.toLowerCase()} is missing role 0x778f133ac0489209d5e8c78e45e9d0226a824164fd90f9892f5d8214632583e0'`
      );
      await expect(
        token.connect(creator).grantRole(BURNER_ADMIN_ROLE, timelock.address)
      ).to.be.revertedWith(
        `AccessControl: account ${creator.address.toLowerCase()} is missing role 0x778f133ac0489209d5e8c78e45e9d0226a824164fd90f9892f5d8214632583e0'`
      );
      await expect(
        token.connect(creator).grantRole(BASE_URI_ADMIN_ROLE, timelock.address)
      ).to.be.revertedWith(
        `AccessControl: account ${creator.address.toLowerCase()} is missing role 0x778f133ac0489209d5e8c78e45e9d0226a824164fd90f9892f5d8214632583e0'`
      );
    });
  });
});
