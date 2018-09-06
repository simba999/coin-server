pragma solidity ^0.4.19;

import './StandardToken.sol';
import './Ownable.sol';

/**
 * @title Mintable token
 * Simple ERC20 Token example, with mintable token creation
 */
contract MintableToken is StandardToken, Ownable {

    event Mint(address indexed to, uint256 amount);
    event MintFinished();

    bool public mintingFinished = false;

    modifier canMint() {
        require(!mintingFinished);
        _;
    }

    /**
     * Function to mint tokens
     * @param _to The address that will recieve the minted tokens.
     * @param _amount The amount of tokens to mint.
     * @return A boolean that indicates if the operation was successful.
     */
    function mint(address _to, uint256 _amount)
    onlyOwner canMint public returns (bool) {

        totalSupply = totalSupply.add(_amount);
        balances[_to] = balances[_to].add(_amount);
        Transfer(0x0, _to, _amount);
        return true;
    }

    /**
     * Function to stop minting new tokens.
     * @return True if the operation was successful.
     */
    function finishMinting()
    onlyOwner public returns (bool) {

        mintingFinished = true;
        MintFinished();
        return true;
    }
}