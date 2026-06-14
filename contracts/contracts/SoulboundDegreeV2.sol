// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title SoulboundDegreeV2
 * @author XacMinhVanBang Team
 * @notice Soulbound Token (SBT) representing academic degrees with fee-based
 *         student confirmation flow.
 *         Flow: Admin creates request → Student confirms & pays → SBT auto-mints.
 * @dev Inherits ERC721, ERC721URIStorage, ERC721Enumerable, AccessControl.
 *      Transfers are blocked by overriding the `_update` hook (OZ v5 pattern).
 */
contract SoulboundDegreeV2 is ERC721, ERC721URIStorage, ERC721Enumerable, AccessControl {

    // =========================================================================
    //                              CONSTANTS & STATE
    // =========================================================================

    /// @notice Role identifier for accounts allowed to mint and revoke degrees
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice Fixed minting fee (0.3 ETH)
    uint256 public constant MINT_FEE = 0.3 ether;

    /// @notice Duration before a request expires (30 days)
    uint256 public constant REQUEST_DURATION = 30 days;

    /// @notice Treasury address that receives minting fees
    address public treasury;

    /// @dev Auto-incrementing counter for token IDs (starts at 1)
    uint256 private _nextTokenId;

    /// @notice Total revenue collected from student payments
    uint256 public totalRevenue;

    /// @notice Total number of requests created
    uint256 public requestCount;

    // =========================================================================
    //                              REQUEST SYSTEM
    // =========================================================================

    /// @notice Status of a degree request
    enum RequestStatus { PENDING, CONFIRMED, EXPIRED, REJECTED, CANCELLED }

    /// @notice A degree request created by admin, awaiting student confirmation
    struct DegreeRequest {
        address student;       // Student wallet address
        string metadataURI;    // IPFS URI with degree metadata
        uint256 createdAt;     // Timestamp when created
        uint256 expiresAt;     // Timestamp when it expires
        RequestStatus status;  // Current status
        uint256 tokenId;       // Token ID after mint (0 if not minted)
        string rejectionReason; // Reason for rejection (empty if not rejected)
    }

    /// @notice Mapping of requestId => DegreeRequest
    mapping(uint256 => DegreeRequest) public requests;

    /// @notice Mapping of student address => list of requestIds
    mapping(address => uint256[]) private _studentRequests;

    // =========================================================================
    //                              EVENTS
    // =========================================================================

    event RequestCreated(uint256 indexed requestId, address indexed student, string uri, uint256 expiresAt);
    event RequestConfirmed(uint256 indexed requestId, address indexed student, uint256 tokenId, uint256 fee);
    event RequestRejected(uint256 indexed requestId, address indexed student, string reason);
    event RequestCancelled(uint256 indexed requestId);
    event RequestExpired(uint256 indexed requestId);

    // =========================================================================
    //                              ERRORS
    // =========================================================================

    /// @notice Custom error: SBTs cannot be transferred
    error SBTTransferNotAllowed();

    // =========================================================================
    //                              CONSTRUCTOR
    // =========================================================================

    /**
     * @notice Deploy the SoulboundDegreeV2 contract.
     * @param admin    The address that receives DEFAULT_ADMIN_ROLE and MINTER_ROLE.
     * @param _treasury The treasury address that receives minting fees.
     */
    constructor(address admin, address _treasury) ERC721("SoulboundDegree", "SBD") {
        require(_treasury != address(0), "SBD: treasury is zero address");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _nextTokenId = 1;
        treasury = _treasury;
    }

    // =========================================================================
    //                          REQUEST MANAGEMENT
    // =========================================================================

    /**
     * @notice Create a degree request for a student. Only callable by MINTER_ROLE.
     * @param student The student wallet address.
     * @param uri     The metadata URI (IPFS).
     * @return requestId The ID of the newly created request.
     */
    function createRequest(address student, string memory uri)
        external
        onlyRole(MINTER_ROLE)
        returns (uint256)
    {
        require(student != address(0), "SBD: student is zero address");
        require(bytes(uri).length > 0, "SBD: empty URI");

        uint256 requestId = requestCount;
        requestCount++;

        requests[requestId] = DegreeRequest({
            student: student,
            metadataURI: uri,
            createdAt: block.timestamp,
            expiresAt: block.timestamp + REQUEST_DURATION,
            status: RequestStatus.PENDING,
            tokenId: 0,
            rejectionReason: ""
        });

        _studentRequests[student].push(requestId);

        emit RequestCreated(requestId, student, uri, block.timestamp + REQUEST_DURATION);
        return requestId;
    }

    /**
     * @notice Create multiple degree requests in one transaction.
     * @param students Array of student addresses.
     * @param uris     Array of metadata URIs.
     * @return requestIds Array of created request IDs.
     */
    function createBatchRequests(
        address[] calldata students,
        string[] calldata uris
    )
        external
        onlyRole(MINTER_ROLE)
        returns (uint256[] memory)
    {
        require(students.length == uris.length, "SBD: arrays length mismatch");
        require(students.length > 0, "SBD: empty arrays");

        uint256[] memory requestIds = new uint256[](students.length);

        for (uint256 i = 0; i < students.length; i++) {
            require(students[i] != address(0), "SBD: student is zero address");
            require(bytes(uris[i]).length > 0, "SBD: empty URI");

            uint256 requestId = requestCount;
            requestCount++;

            requests[requestId] = DegreeRequest({
                student: students[i],
                metadataURI: uris[i],
                createdAt: block.timestamp,
                expiresAt: block.timestamp + REQUEST_DURATION,
                status: RequestStatus.PENDING,
                tokenId: 0,
                rejectionReason: ""
            });

            _studentRequests[students[i]].push(requestId);
            requestIds[i] = requestId;

            emit RequestCreated(requestId, students[i], uris[i], block.timestamp + REQUEST_DURATION);
        }

        return requestIds;
    }

    /**
     * @notice Student confirms a request and pays the minting fee.
     *         The SBT is automatically minted upon confirmation.
     * @param requestId The ID of the request to confirm.
     */
    function confirmAndMint(uint256 requestId) external payable {
        DegreeRequest storage req = requests[requestId];

        require(req.student != address(0), "SBD: request does not exist");
        require(msg.sender == req.student, "SBD: caller is not the student");
        require(req.status == RequestStatus.PENDING, "SBD: request is not pending");
        require(block.timestamp <= req.expiresAt, "SBD: request has expired");
        require(msg.value == MINT_FEE, "SBD: incorrect fee amount");

        // Update request status
        req.status = RequestStatus.CONFIRMED;

        // Mint the SBT
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;
        _safeMint(req.student, tokenId);
        _setTokenURI(tokenId, req.metadataURI);
        req.tokenId = tokenId;

        // Transfer fee to treasury
        (bool success, ) = treasury.call{value: msg.value}("");
        require(success, "SBD: fee transfer failed");
        totalRevenue += msg.value;

        emit RequestConfirmed(requestId, req.student, tokenId, msg.value);
    }

    /**
     * @notice Student rejects a request if the information is incorrect.
     * @param requestId The ID of the request to reject.
     * @param reason The reason for rejection.
     */
    function rejectRequest(uint256 requestId, string calldata reason) external {
        DegreeRequest storage req = requests[requestId];

        require(req.student != address(0), "SBD: request does not exist");
        require(msg.sender == req.student, "SBD: caller is not the student");
        require(req.status == RequestStatus.PENDING, "SBD: request is not pending");
        require(bytes(reason).length > 0, "SBD: reason is required");

        req.status = RequestStatus.REJECTED;
        req.rejectionReason = reason;

        emit RequestRejected(requestId, req.student, reason);
    }

    /**
     * @notice Admin cancels a pending request.
     * @param requestId The ID of the request to cancel.
     */
    function cancelRequest(uint256 requestId) external onlyRole(MINTER_ROLE) {
        DegreeRequest storage req = requests[requestId];

        require(req.student != address(0), "SBD: request does not exist");
        require(req.status == RequestStatus.PENDING, "SBD: request is not pending");

        req.status = RequestStatus.CANCELLED;

        emit RequestCancelled(requestId);
    }

    /**
     * @notice Mark an expired request. Anyone can call this.
     * @param requestId The ID of the request to check.
     */
    function cleanExpired(uint256 requestId) external {
        DegreeRequest storage req = requests[requestId];

        require(req.student != address(0), "SBD: request does not exist");
        require(req.status == RequestStatus.PENDING, "SBD: request is not pending");
        require(block.timestamp > req.expiresAt, "SBD: request has not expired");

        req.status = RequestStatus.EXPIRED;

        emit RequestExpired(requestId);
    }

    // =========================================================================
    //                          DIRECT MINTING (Admin-only)
    // =========================================================================

    /**
     * @notice Mint a single SBT directly (no fee, admin only, for special cases).
     * @param to  The recipient wallet address.
     * @param uri The metadata URI.
     * @return tokenId The newly minted token ID.
     */
    function mint(address to, string memory uri)
        external
        onlyRole(MINTER_ROLE)
        returns (uint256)
    {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    /**
     * @notice Batch-mint SBTs directly (no fee, admin only).
     * @param recipients Array of recipient addresses.
     * @param uris       Array of metadata URIs.
     * @return tokenIds  Array of newly minted token IDs.
     */
    function batchMint(
        address[] calldata recipients,
        string[] calldata uris
    )
        external
        onlyRole(MINTER_ROLE)
        returns (uint256[] memory)
    {
        require(recipients.length == uris.length, "SBD: arrays length mismatch");
        require(recipients.length > 0, "SBD: empty arrays");

        uint256[] memory tokenIds = new uint256[](recipients.length);

        for (uint256 i = 0; i < recipients.length; i++) {
            uint256 tokenId = _nextTokenId;
            _nextTokenId++;
            _safeMint(recipients[i], tokenId);
            _setTokenURI(tokenId, uris[i]);
            tokenIds[i] = tokenId;
        }

        return tokenIds;
    }

    // =========================================================================
    //                              REVOCATION
    // =========================================================================

    /**
     * @notice Revoke (burn) a degree. Only callable by MINTER_ROLE.
     * @param tokenId The token ID to revoke.
     */
    function revoke(uint256 tokenId) external onlyRole(MINTER_ROLE) {
        _burn(tokenId);
    }

    // =========================================================================
    //                              VIEW FUNCTIONS
    // =========================================================================

    /**
     * @notice Check whether a token exists.
     * @param tokenId The token ID to check.
     * @return True if the token exists.
     */
    function exists(uint256 tokenId) external view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    /**
     * @notice Get all token IDs owned by an address.
     * @param owner The address to query.
     * @return An array of token IDs.
     */
    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 count = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }
        return tokenIds;
    }

    /**
     * @notice Get all request IDs for a student.
     * @param student The student address.
     * @return Array of request IDs.
     */
    function getStudentRequests(address student) external view returns (uint256[] memory) {
        return _studentRequests[student];
    }

    /**
     * @notice Get pending request IDs for a student.
     * @param student The student address.
     * @return pendingIds Array of pending request IDs.
     */
    function getPendingRequests(address student) external view returns (uint256[] memory) {
        uint256[] memory allReqs = _studentRequests[student];
        uint256 pendingCount = 0;

        // Count pending
        for (uint256 i = 0; i < allReqs.length; i++) {
            if (requests[allReqs[i]].status == RequestStatus.PENDING &&
                block.timestamp <= requests[allReqs[i]].expiresAt) {
                pendingCount++;
            }
        }

        // Collect pending
        uint256[] memory pendingIds = new uint256[](pendingCount);
        uint256 idx = 0;
        for (uint256 i = 0; i < allReqs.length; i++) {
            if (requests[allReqs[i]].status == RequestStatus.PENDING &&
                block.timestamp <= requests[allReqs[i]].expiresAt) {
                pendingIds[idx] = allReqs[i];
                idx++;
            }
        }

        return pendingIds;
    }

    /**
     * @notice Get contract statistics.
     * @return _totalSupply Total minted tokens
     * @return _totalRevenue Total fees collected
     * @return _requestCount Total requests created
     * @return _pendingCount Number of currently pending requests
     */
    function getStats() external view returns (
        uint256 _totalSupply,
        uint256 _totalRevenue,
        uint256 _requestCount,
        uint256 _pendingCount
    ) {
        _totalSupply = totalSupply();
        _totalRevenue = totalRevenue;
        _requestCount = requestCount;

        // Count pending requests
        _pendingCount = 0;
        for (uint256 i = 0; i < requestCount; i++) {
            if (requests[i].status == RequestStatus.PENDING &&
                block.timestamp <= requests[i].expiresAt) {
                _pendingCount++;
            }
        }
    }

    // =========================================================================
    //                         ADMIN FUNCTIONS
    // =========================================================================

    /**
     * @notice Update the treasury address. Only callable by DEFAULT_ADMIN_ROLE.
     * @param _treasury The new treasury address.
     */
    function setTreasury(address _treasury) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_treasury != address(0), "SBD: treasury is zero address");
        treasury = _treasury;
    }

    // =========================================================================
    //                         SOULBOUND ENFORCEMENT
    // =========================================================================

    /**
     * @dev Override the internal `_update` hook to block all transfers.
     *      Minting (from == address(0)) and burning (to == address(0)) are allowed.
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    )
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert SBTTransferNotAllowed();
        }
        return super._update(to, tokenId, auth);
    }

    // =========================================================================
    //                       REQUIRED OVERRIDES (OZ v5)
    // =========================================================================

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
