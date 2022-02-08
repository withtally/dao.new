import { task } from "hardhat/config";
import * as fs from "fs";
import { DeployedContract } from "./deploy-utils";

task("verify-contracts", "Verify multiple contracts")
  .addParam(
    "contractFile",
    "json file containing deployed contracts as output from deploy script"
  )
  .setAction(async (args, hre) => {
    const contracts: DeployedContract[] = JSON.parse(
      fs.readFileSync(args.contractFile, { encoding: "utf8" })
    );

    for (const c of contracts) {
      console.log(`Verifying ${c.name} at address ${c.address}`);

      try {
        await hre.run("verify:verify", {
          address: c.address,
        });
      } catch (e) {
        console.error(e);
      }
    }
  });
