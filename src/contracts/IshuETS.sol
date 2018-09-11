pragma solidity ^0.4.19;

import './SafeMath.sol';
import './Ownable.sol';
import './IshuUser.sol';
import './ERC884ForToken.sol';

contract IshuETS is ERC884ForToken, Ownable {

    using SafeMath for uint256;

    string public name;
    string public symbol;
    uint public decimals = 0;

    IshuUser identity;

    /**
     * IshuETS contract constructor
     * When it is deployed, the identity contract should  be provided.
     * Also, the Token name and symbol should be provided.
     */
    constructor(IshuUser _identity, string _name, string _symbol)
    public {

        identity = _identity;
        name = _name;
        symbol = _symbol;
    }

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
    public returns (bool) {

        require(to != address(0));
        require(amount != 0);

        // get signed address from hash data
        address fromAddr = ecrecover(hashData[0], v[0], r[0], s[0]);
        address ishuAddr = ecrecover(hashData[1], v[1], r[1], s[1]);

        // verify ishu owner signature
        require(owner == ishuAddr);

        // verify from address signer's signature
        IshuUser ishuUser = IshuUser(identity);
        if(ishuUser.isVerified(fromAddr, identityHash[0]) && ishuUser.isVerified(to, identityHash[1])) {
            return super.transferFrom(fromAddr, to, amount);
        }
        else
            return false;
    }

    /**
     * The `transfer` function MUST NOT allow transfers to addresses that
     * have not been verified and added to the contract.
     * If the `to` address is not currently a holder then it MUST become one.
     * @param to address The address which you want to send tokens to
     * @param amount uint The amount how much you want to send tokens to
     * @param hashData bytes32 The `ishu` owner address signed hash data
     * @param r bytes32 The `to` sign data
     * @param s bytes32 The `to` sign data
     * @param v uint8 The `to` sign data
     * @param identityHash bytes32 The `to` identity hash data
     */
    function transfer(address to, uint256 amount, bytes32 hashData, bytes32 r, bytes32 s, uint8 v, bytes32 identityHash)
    public returns (bool) {

        require(to != address(0));
        require(amount != 0);

        // get signed address from hash data
        address ishuAddr = ecrecover(hashData, v, r, s);

        // verify ishu owner signature
        require(owner == ishuAddr);

        // verify from address signer's signature
        IshuUser ishuUser = IshuUser(identity);
        if(ishuUser.isVerified(to, identityHash[1])) {
            totalSupply = totalSupply.add(amount);
            return super.transfer(to, amount);
        }
        else
            return false;
    }

    /**
     * Set identity contract reference
     * This is called by only Ishu owner
     * @param _identity IshuUser The IshuUser contract address
     */
    function setIdentity(IshuUser _identity)
    public onlyOwner {

        identity = _identity;
    }

}