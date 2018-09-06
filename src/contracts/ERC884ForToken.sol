pragma solidity ^0.4.19;

import './StandardToken.sol';

/**
 *  An `ERC20` compatible token that conforms to Delaware State Senate,
 *  149th General Assembly, Senate Bill No. 69: An act to Amend Title 8
 *  of the Delaware Code Relating to the General Corporation Law.
 */
contract ERC884ForToken is StandardToken {

    /**
     * The `transferToken` function MUST NOT allow transfers to addresses that
     * have not been verified and added to the contract.
     * Before call this function, sender should allow Ishu to send tokens
     * to receiver by calling approve() function
     * If the `to` address is not currently a holder then it MUST become one.
     * @param to address The address which you want to send tokens to
     * @param amount uint The amount how much you want to send tokens to
     * @param hashData bytes32[] The `from` address and `ishu` owner address signed hash array
     * @param r bytes32[] The bytes32 array of `from` and `ishu` sign data
     * @param s bytes32[] The bytes32 array of `from` and `ishu` sign data
     * @param v uint8[] The uint8 array of `from` and `ishu` sign data
     * @param identityHash bytes32[] The bytes32 array of `from` and `to` identity hash data
     */
    function transferToken(address to, uint amount, bytes32[] hashData, bytes32[] r, bytes32[] s, uint8[] v, bytes32[] identityHash)
    public returns (bool);

    /**
     *  The `transfer` function MUST NOT allow transfers to addresses that
     *  have not been verified and added to the contract.
     *  If the `to` address is not currently a holder then it MUST become one.
     * @param to address The address which you want to send tokens to
     * @param amount uint The amount how much you want to send tokens to
     * @param hashData bytes32 The `ishu` owner address signed hash data
     * @param r bytes32 The `to` sign data
     * @param s bytes32 The `to` sign data
     * @param v uint8 The `to` sign data
     * @param identityHash The `to` identity hash data
     */
    function transfer(address to, uint256 amount, bytes32 hashData, bytes32 r, bytes32 s, uint8 v, bytes32 identityHash)
    public returns (bool);

}