pragma solidity ^0.4.19;

/**
 * @title ERC20Basic
 * Simple version of ERC20 interface
 */
contract ERC20Basic {

    uint256 public totalSupply;

    function balanceOf(address who)
    public constant returns (uint256);

    function transfer(address to, uint256 value)
    public returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
}