import chai from "chai";
import { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";
import { PaymentSplitterWithFeeUpgradeableDerived__factory } from "../typechain/factories/PaymentSplitterWithFeeUpgradeableDerived__factory";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { parseEther } from "ethers/lib/utils";
import { PaymentSplitterWithFeeUpgradeableDerived } from "../typechain/PaymentSplitterWithFeeUpgradeableDerived";

chai.use(solidity);
const { expect } = chai;

describe("PaymentSplitterWithFeeUpradeable", async () => {
  let snapshotId: number;
  let deployer: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let serviceProvider: SignerWithAddress;
  let paymentSplitterWithFee: PaymentSplitterWithFeeUpgradeableDerived;
  const serviceFeeBasisPoints = 1000; // = 10%

  beforeEach(async () => {
    snapshotId = await ethers.provider.send("evm_snapshot", []);
  });

  afterEach(async () => {
    await ethers.provider.send("evm_revert", [snapshotId]);
  });

  before(async () => {
    [deployer, user1, user2, serviceProvider] = await ethers.getSigners();
  });

  const deployPaymentSplitter = async () => {
    paymentSplitterWithFee =
      await new PaymentSplitterWithFeeUpgradeableDerived__factory(
        deployer
      ).deploy();

    paymentSplitterWithFee.initialize(
      [user1.address, user2.address],
      [10, 20],
      serviceProvider.address,
      serviceFeeBasisPoints
    );
  };

  it("sends service fee when releasing funds", async () => {
    await deployPaymentSplitter();

    const initialBalance = parseEther("3");
    await deployer.sendTransaction({
      to: paymentSplitterWithFee.address,
      value: initialBalance,
    });

    let user1Eth = initialBalance.mul(10).div(30);
    let user1Fee = user1Eth.mul(serviceFeeBasisPoints).div(10000);

    await expect(
      await paymentSplitterWithFee.release(user1.address)
    ).to.changeEtherBalances(
      [user1, serviceProvider],
      [user1Eth.sub(user1Fee), user1Fee]
    );

    let user2Eth = initialBalance.mul(20).div(30);
    let user2Fee = user2Eth.mul(serviceFeeBasisPoints).div(10000);

    await expect(
      await paymentSplitterWithFee.release(user2.address)
    ).to.changeEtherBalances(
      [user2, serviceProvider],
      [user2Eth.sub(user2Fee), user2Fee]
    );
  });

  it("emits event", async () => {
    await deployPaymentSplitter();

    const initialBalance = parseEther("3");
    await deployer.sendTransaction({
      to: paymentSplitterWithFee.address,
      value: initialBalance,
    });

    let user1Eth = initialBalance.mul(10).div(30);
    let user1Fee = user1Eth.mul(serviceFeeBasisPoints).div(10000);

    await expect(paymentSplitterWithFee.release(user1.address))
      .to.emit(paymentSplitterWithFee, "PaymentReleased")
      .withArgs(user1.address, user1Eth, user1Fee);
  });
});
