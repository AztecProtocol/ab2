// SPDX-License-Identifier: MIT
pragma solidity >=0.8.18;

contract MockENS {
    mapping(bytes => bool) public _exists;
    mapping(address => uint256) public _totalNames;
    mapping(address => mapping(uint256 => bytes)) public _names;

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

        _exists[_name] = true;
        uint256 nextCount = _totalNames[msg.sender];
        _names[msg.sender][nextCount] = _name;
        _totalNames[msg.sender]++;
        emit NameRegistered(msg.sender, _name);
    }

    function isRegistered(bytes memory _name) public view returns (bool) {
        return _exists[_name];
    }

    function nameOf(address _owner, uint256 index) public view returns (bytes memory) {
        return _names[_owner][index];
    }

    function hasEns(address _owner) public view returns (bool) {
        return _totalNames[_owner] != 0;
    }
}
