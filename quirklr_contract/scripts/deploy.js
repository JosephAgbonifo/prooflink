const hre = require("hardhat");

async function main() {
  console.log("Deploying FlareProjectVault...");

  // Get the contract factory
  const FlareProjectVault = await hre.ethers.getContractFactory(
    "FlareProjectVault"
  );

  // Deploy the contract
  const vault = await FlareProjectVault.deploy();

  // Wait for the deployment to finish
  await vault.waitForDeployment();

  const address = await vault.getAddress();

  console.log("----------------------------------------------------");
  console.log(`FlareProjectVault deployed to: ${address}`);
  console.log(`Protocol Admin set to: ${await vault.protocolAdmin()}`);
  console.log("----------------------------------------------------");

  // Optional: Verification step (for Flare Explorer/Blockscout)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Wait for block confirmations...");
    // Wait for a few blocks to ensure the explorer has indexed the bytecode
    await vault.deploymentTransaction().wait(5);

    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
