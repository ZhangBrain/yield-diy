// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.19;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StrategyTemplate {
    error CommansInEmptyError();
    error CommandCallError(
        address target,
        bytes4 selector,
        bytes staticParameters,
        bytes dynamicParameters
    );

    struct Command {
        address target;
        bytes4 selector;
        bytes staticParameters;
    }

    Command[] public commandsIn;
    Command[] public commandsOut;

    constructor(Command[] memory _commandsIn, Command[] memory _commandsOut) {
        commandsIn = _commandsIn;
        commandsOut = _commandsOut;
    }

    function deposit(bytes memory _dynamicParameters) public {
        if (commandsIn.length == 0) revert CommansInEmptyError();
        uint _commandLen = commandsIn.length;
        uint _index = 0;
        do {
            Command memory _command = commandsIn[_index];
            bytes memory _callData = abi.encodeWithSelector(
                _command.selector,
                _command.staticParameters,
                _dynamicParameters
            );
            (bool _success, bytes memory _result) = _command.target.call(_callData);
            if (!_success)
                revert CommandCallError(
                    _command.target,
                    _command.selector,
                    _command.staticParameters,
                    _dynamicParameters
                );
            _dynamicParameters = _result;
            _index++;
        } while (_index < _commandLen);
    }
}
