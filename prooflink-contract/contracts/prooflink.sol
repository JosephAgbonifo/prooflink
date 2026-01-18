// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract FlareProjectVault {
    
    struct Project {
        address owner;
        uint256 totalBalance;
        bool exists;
    }

    address public protocolAdmin;
    uint256 public constant FEE_BPS = 150; // 1.5% (150 / 10000)
    mapping(string => Project) public projects;

    event ProjectRegistered(string projectId, address indexed owner);
    event PaymentReceived(string projectId, address indexed sender, uint256 amount);
    event Withdrawal(string projectId, address indexed owner, uint256 amount, uint256 fee);
    event ProjectDeleted(string projectId, uint256 refunded, uint256 feeKept);

    constructor() {
        protocolAdmin = msg.sender;
    }

    /**
     * @dev Register a new project and map it to the sender.
     */
    function registerProject(string memory _projectId) external {
        require(!projects[_projectId].exists, "Project already exists");
        projects[_projectId] = Project({
            owner: msg.sender,
            totalBalance: 0,
            exists: true
        });
        emit ProjectRegistered(_projectId, msg.sender);
    }

    /**
     * @dev Contribute FLR to a specific project.
     * Updates the project's internal balance.
     */
    function contribute(string memory _projectId) external payable {
        require(projects[_projectId].exists, "Project not found");
        require(msg.value > 0, "Amount must be > 0");

        projects[_projectId].totalBalance += msg.value;
        emit PaymentReceived(_projectId, msg.sender, msg.value);
    }

    /**
     * @dev Withdrawal: Owner takes the project balance.
     * Keeps 1.5% in the contract as a protocol fee.
     */
    function withdraw(string memory _projectId) external {
        Project storage project = projects[_projectId];
        require(msg.sender == project.owner, "Not the project owner");
        
        uint256 amount = project.totalBalance;
        require(amount > 0, "No funds to withdraw");

        uint256 fee = (amount * FEE_BPS) / 10000;
        uint256 netAmount = amount - fee;

        project.totalBalance = 0; // Reset balance before transfer (Reentrancy protection)

        (bool success, ) = payable(project.owner).call{value: netAmount}("");
        require(success, "Withdrawal transfer failed");

        emit Withdrawal(_projectId, project.owner, netAmount, fee);
    }

    /**
     * @dev Deletion & Refund: Sends contributions back to supporters.
     * Deducts 1.5% from EACH refund to cover protocol costs.
     */
    function deleteAndRefund(
        string memory _projectId, 
        address[] calldata _contributors, 
        uint256[] calldata _amounts
    ) external {
        Project storage project = projects[_projectId];
        require(msg.sender == project.owner, "Only owner can delete");
        require(_contributors.length == _amounts.length, "Data mismatch");

        uint256 totalRefunded = 0;
        uint256 totalFeesKept = 0;

        for (uint256 i = 0; i < _contributors.length; i++) {
            uint256 fee = (_amounts[i] * FEE_BPS) / 10000;
            uint256 refundAmount = _amounts[i] - fee;

            totalRefunded += refundAmount;
            totalFeesKept += fee;

            (bool success, ) = payable(_contributors[i]).call{value: refundAmount}("");
            require(success, "Refund failed");
        }

        delete projects[_projectId];
        emit ProjectDeleted(_projectId, totalRefunded, totalFeesKept);
    }

    /**
     * @dev Admin function to withdraw the accumulated 1.5% fees.
     */
    function withdrawProtocolFees() external {
        require(msg.sender == protocolAdmin, "Only admin");
        uint256 balance = address(this).balance;
        // Logic to subtract active project balances could be added here for safety
        payable(protocolAdmin).transfer(balance);
    }
}