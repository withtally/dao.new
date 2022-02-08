import { ContractFactory } from "ethers";

export interface DeployedContract {
  name: string;
  address: string;
}

export async function deployContract(
  factory: ContractFactory,
  name: string,
  deployedContracts?: DeployedContract[]
) {
  const contract = await factory.deploy();
  await contract.deployed();
  console.log("%s deployed to: %s", name, contract.address);

  if (deployedContracts) {
    deployedContracts.push({ name: name, address: contract.address });
  }
  return contract;
}
