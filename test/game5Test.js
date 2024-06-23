const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
const { ethers } = require('hardhat');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    return { game };
  }
  it('should be a winner', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    // good luck
    const threshold = '0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf';
    const threshold20 = parseInt(threshold.substring(2),16);
    let account;
    let address;

    do {
      account = await ethers.Wallet.createRandom();
      address = parseInt(account.address.substring(2),16);

    } while (threshold20 < address);

    let provider = await ethers.provider;
    account = account.connect(provider);

    const signer = await ethers.getSigner();
 
    await signer.sendTransaction({
      to: account.address,
      value: ethers.utils.parseEther('1')
    });

    await game.connect(account).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
