# Admin & Minting pages for your dao.new made DAO

This package contains implementation of 2 pages useful for interacting with your NFT DAO clone.

1. `/admin` - admin page

   Used to manage your contracts, e.g enable minting, change mint price, release funds, etc. Only the creator of the NFT DAO can perform these operations.

2. `/` - minting page

   A page where users can mint tokens

These pages are meant as an example. Feel free to fork & extend.

## Running locally

1. Clone the repo (or fork & clone)

   `$ git clone git@github.com:withtally/dao.new.git`

2. Install dependencies

   `$ cd dao.new`

   `$ yarn`

3. Update config file

   Open `packages/minter-admin-frontend/config.ts` for editing.

   3.1. Set `CHAIN_ID` to the chain you are working on (e.g `ChainId.Rinkeby` or `ChainId.Mainnet`)

   3.2. Update contracts address for the chain you are working on. You need to update `tokenAddress`, `minterAddress`, `governorAddress` & `timelockAddress`.

   3.3. Update `minterType` to the type of minter you have chosed. Options are: `MinterType.FixedPriceSequentialMinter` or `MinterType.FixedPriceSpecificIDMinter`

4. (Optional) Set RPC endpoints: create `packages/minter-admin-frontend/.env` file similar to the `.env.example` file in the same folder.
   The JSON RPC urls should look something like: `https://eth-rinkeby.alchemyapi.io/v2/dkgAjugSdf`. You can get an Alchemy api key by [signing up](https://www.alchemy.com/).

5. Run the webapp in development mode

   From the repo root folder run:

   ```
   $ yarn prebuild
   $ cd packages/minter-admin-frontend/
   $ yarn dev
   ```

6. Open browser at http://localhost:3000

## Deploying to Vercel

After successfully running it locally, you may want to deploy it. These are instructions on how to deploy to Vercel.
This is assuming you followed the steps to run locally and successfully ran in development mode.

1. Have a fork of this repository with the config changes listed above in step 3

2. Create an account on [Vercel](https://vercel.com/) and import the forked repo

3. Under "Framework Preset" choose "Next.js"

4. Set the root directory to be `packages/minter-admin-frontend`

5. Change the build command to: `./build.sh`

   The settings should look like this:

![vercel-settings](https://user-images.githubusercontent.com/351026/153179467-f630113d-8d33-49c0-ab39-0d967c6b9ad4.png)

6. Deploy 🚀
