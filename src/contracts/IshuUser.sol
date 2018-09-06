pragma solidity ^0.4.19;

import './Ownable.sol';
import './ERC884ForUser.sol';

contract IshuUser is ERC884ForUser, Ownable {

    bytes32 constant private ZERO_BYTES = bytes32(0);
    address constant private ZERO_ADDRESS = address(0);

    mapping(address => bytes32) private verified;

    modifier isVerifiedAddress(address addr) {
        require(verified[addr] != ZERO_BYTES);
        _;
    }

    /**
     *  Add a verified address, along with an associated verification hash to the contract.
     *  @param addr The address of the person represented by the supplied hash.
     *  @param hash A cryptographic hash of the address holder's verified information.
     */
    function addVerified(address addr, bytes32 hash)
    public onlyOwner {

        require(addr != ZERO_ADDRESS);
        require(hash != ZERO_BYTES);
        require(verified[addr] == ZERO_BYTES);
        verified[addr] = hash;
        emit VerifiedAddressAdded(addr, hash, msg.sender);
    }

    /**
     *  Remove a verified address, and the associated verification hash
     *  @param addr The verified address to be removed.
     */
    function removeVerified(address addr)
    public onlyOwner {

        if (verified[addr] != ZERO_BYTES) {
            verified[addr] = ZERO_BYTES;
        }
        emit VerifiedAddressRemoved(addr, msg.sender);
    }

    /**
     *  Update the hash for a verified address known to the contract.
     *  @param addr The verified address of the person represented by the supplied hash.
     *  @param hash A new cryptographic hash of the address holder's updated verified information.
     */
    function updateVerified(address addr, bytes32 hash)
    public onlyOwner isVerifiedAddress(addr) {

        require(hash != ZERO_BYTES);
        bytes32 oldHash = verified[addr];
        if (oldHash != hash) {
            verified[addr] = hash;
        }
        emit VerifiedAddressUpdated(addr, oldHash, hash, msg.sender);
    }

    /**
     *  Tests that the supplied address is known to the contract.
     *  @param addr The address to test.
     *  @return true if the address is known to the contract.
     */
    function isVerified(address addr, bytes32 hash)
    public view returns (bool) {

        require(verified[addr] != ZERO_BYTES);
        return verified[addr] == hash;
    }
}