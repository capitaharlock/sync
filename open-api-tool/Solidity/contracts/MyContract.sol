// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Simple Token Contract
/// @notice This contract allows users to store and transfer tokens
contract MyContract {
    
    /// @notice The owner of the contract
    address public owner;

    /// @notice The total supply of tokens
    uint256 public totalSupply;

    /// @notice Mapping to store balances of each address
    mapping(address => uint256) public balances;

    /// @notice Event emitted when tokens are transferred
    /// @param from The address sending tokens
    /// @param to The address receiving tokens
    /// @param amount The number of tokens transferred
    event Transfer(address indexed from, address indexed to, uint256 amount);

    /// @notice Constructor to initialize the contract with a total supply
    /// @param _initialSupply The total supply of tokens
    constructor(uint256 _initialSupply) {
        owner = msg.sender;
        totalSupply = _initialSupply;
        balances[owner] = _initialSupply;
    }

    /// @notice Get the balance of an account22
    /// @param _account The address to query balance for
    /// @return The balance of the account
    function balanceOf(address _account) public view returns (uint256) {
        return balances[_account];
    }

    /// @notice Transfer tokens from the caller to another account
    /// @param _to The address to transfer tokens to
    /// @param _amount The amount of tokens to transfer
    /// @return A boolean indicating success
    function transfer(address _to, uint256 _amount) public returns (bool) {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;

        emit Transfer(msg.sender, _to, _amount);
        return true;
    }

    /// @notice Mint new tokens and add them to the owner's balance
    /// @param _amount The amount of new tokens to mint
    function mint(uint256 _amount) public {
        require(msg.sender == owner, "Only the owner can mint tokens");
        totalSupply += _amount;
        balances[owner] += _amount;
    }
    
    /// @notice Burn tokens from the owner's balance
    /// @param _amount The amount of tokens to burn
    function burn(uint256 _amount) public {
        require(msg.sender == owner, "Only the owner can burn tokens");
        require(balances[owner] >= _amount, "Insufficient balance to burn");
        totalSupply -= _amount;
        balances[owner] -= _amount;
    }
}
