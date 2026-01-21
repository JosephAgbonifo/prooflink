// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FlareProjectVault {
    
    struct Project {
        address owner;
        address tokenAddress; // Can be ERC20 address OR 0xeeee... for Native C2FLR
        uint256 totalBalance;
        bool exists;
    }
    mapping(address => uint256) public totalProjectObligations;
    address public protocolAdmin;
    uint256 public constant FEE_BPS = 150; // 1.5%
    // Convention for Native Token
    address public constant NATIVE_TOKEN = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    
    mapping(string => Project) public projects;

    event ProjectRegistered(string projectId, address indexed owner, address token);
    event PaymentReceived(string projectId, address indexed sender, uint256 amount);
    event Withdrawal(string projectId, address indexed owner, uint256 amount, uint256 fee);

    constructor() {
        protocolAdmin = msg.sender;
    }

    function registerProject(string memory _projectId, address _tokenAddress) external {
        require(!projects[_projectId].exists, "Project already exists");
        // Verify it is one of your 3 allowed tokens
        require(
            _tokenAddress == NATIVE_TOKEN || 
            _tokenAddress == 0xC1A5B41512496B80903D1f32d6dEa3a73212E71F || // USDT0
            _tokenAddress == 0x8b4abA9C4BD7DD961659b02129beE20c6286e17F,   // FXRP
            "Unsupported token"
        );

        projects[_projectId] = Project({
            owner: msg.sender,
            tokenAddress: _tokenAddress,
            totalBalance: 0,
            exists: true
        });

        emit ProjectRegistered(_projectId, msg.sender, _tokenAddress);
    }

    /**
     * @dev Handles both Native C2FLR and ERC20 tokens.
     */
    function contribute(string memory _projectId, uint256 _amount) external payable {
        Project storage project = projects[_projectId];
        require(project.exists, "Project not found");

        if (project.tokenAddress == NATIVE_TOKEN) {
            // NATIVE CASE: Use msg.value
            require(msg.value > 0, "Send FLR");
            project.totalBalance += msg.value;
            totalProjectObligations[project.tokenAddress] += msg.value; // (or msg.value for native)
            emit PaymentReceived(_projectId, msg.sender, msg.value);
        } else {
            // ERC20 CASE: Use transferFrom
            require(_amount > 0, "Amount must be > 0");
            require(msg.value == 0, "Do not send FLR for ERC20 projects");
            
            IERC20 token = IERC20(project.tokenAddress);
            bool success = token.transferFrom(msg.sender, address(this), _amount);
            require(success, "Token transfer failed");
            totalProjectObligations[project.tokenAddress] += _amount;
            project.totalBalance += _amount;
            emit PaymentReceived(_projectId, msg.sender, _amount);
        }
    }

function withdraw(string memory _projectId) external {
    Project storage project = projects[_projectId];
    require(msg.sender == project.owner, "Not owner");
    
    uint256 amount = project.totalBalance; // This is the 100% amount
    require(amount > 0, "Empty");

    uint256 fee = (amount * FEE_BPS) / 10000;
    uint256 netAmount = amount - fee;
    
    project.totalBalance = 0;
    
    // FIX: Subtract the FULL amount (100%), not the netAmount (98.5%)
    totalProjectObligations[project.tokenAddress] -= amount; 

    if (project.tokenAddress == NATIVE_TOKEN) {
        (bool success, ) = payable(project.owner).call{value: netAmount}("");
        require(success, "FLR withdrawal failed");
    } else {
        require(IERC20(project.tokenAddress).transfer(project.owner, netAmount), "ERC20 withdrawal failed");
    }
    
    emit Withdrawal(_projectId, project.owner, netAmount, fee);
}

    /**
 * @notice Returns the financial state for a specific token (Native or ERC20)
 * @param _tokenAddress The address of the token to check
 * @return projectObligations Total balance currently assigned to all projects
 * @return actualContractBalance The actual amount of tokens held by this contract
 * @return protocolFeesAvailable The difference (fees/profit) available for admin withdrawal
 */
function getProtocolFinances(address _tokenAddress) 
    external 
    view 
    returns (
        uint256 projectObligations, 
        uint256 actualContractBalance, 
        uint256 protocolFeesAvailable
    ) 
{
    require(msg.sender == protocolAdmin, "Only admin");

    // 1. Calculate projectObligations (This requires tracking total active balances)
    // Note: To make this efficient, you should add a state variable: 
    // uint256 public totalProjectBalancesPerToken;
    // For now, if you aren't tracking a global sum, you'd have to iterate (expensive) 
    // so I recommend adding a tracker variable to contribute/withdraw.
    
    // Assuming you add a mapping: mapping(address => uint256) public totalProjectObligations;
    projectObligations = totalProjectObligations[_tokenAddress];

    // 2. Get actual balance
    if (_tokenAddress == NATIVE_TOKEN) {
        actualContractBalance = address(this).balance;
    } else {
        actualContractBalance = IERC20(_tokenAddress).balanceOf(address(this));
    }

    // 3. Calculate the "System Share"
    if (actualContractBalance > projectObligations) {
        protocolFeesAvailable = actualContractBalance - projectObligations;
    } else {
        protocolFeesAvailable = 0; // Should not happen unless there's an accounting error
    }
}
    // Admin withdraws native or token fees
    function withdrawProtocolFees(address _tokenAddress) external {
        require(msg.sender == protocolAdmin, "Only admin");
        if (_tokenAddress == NATIVE_TOKEN) {
            payable(protocolAdmin).transfer(address(this).balance);
        } else {
            IERC20 token = IERC20(_tokenAddress);
            token.transfer(protocolAdmin, token.balanceOf(address(this)));
        }
    }
}