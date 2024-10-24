// SPDX-License-Identifier: MIT
pragma solidity >=0.8.18;

contract MockENS {
    mapping(bytes => bool) public _exists;
    mapping(address => bytes) public _names;

    error InvalidName();
    error NameAlreadyTaken();
    error NameAlreadyExists();

    event NameRegistered(address indexed owner, bytes indexed name);

    function register(bytes memory _name) public {
        if (_name.length == 0) {
            revert InvalidName();
        }

        if (_exists[_name]) {
            revert NameAlreadyExists();
        }

        if (_names[msg.sender].length != 0) {
            revert NameAlreadyTaken();
        }

        _exists[_name] = true;
        _names[msg.sender] = _name;
        emit NameRegistered(msg.sender, _name);
    }

    function isRegistered(bytes memory _name) public view returns (bool) {
        return _exists[_name];
    }

    function nameOf(address _owner) public view returns (bytes memory) {
        return _names[_owner];
    }

    function hasEns(address _owner) public view returns (bool) {
        return _names[_owner].length != 0;
    }
}
