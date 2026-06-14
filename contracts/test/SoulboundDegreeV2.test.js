const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("SoulboundDegreeV2", function () {
  let contract, admin, treasury, student1, student2, outsider;
  const MINT_FEE = ethers.parseEther("0.3");
  const SAMPLE_URI = "ipfs://QmTest123";
  const SAMPLE_URI2 = "ipfs://QmTest456";

  beforeEach(async function () {
    [admin, treasury, student1, student2, outsider] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("SoulboundDegreeV2");
    contract = await Factory.deploy(admin.address, treasury.address);
    await contract.waitForDeployment();
  });

  // =========================================================================
  //                          DEPLOYMENT
  // =========================================================================

  describe("Deployment", function () {
    it("should set admin roles correctly", async function () {
      const DEFAULT_ADMIN = "0x0000000000000000000000000000000000000000000000000000000000000000";
      const MINTER_ROLE = await contract.MINTER_ROLE();
      expect(await contract.hasRole(DEFAULT_ADMIN, admin.address)).to.be.true;
      expect(await contract.hasRole(MINTER_ROLE, admin.address)).to.be.true;
    });

    it("should set treasury correctly", async function () {
      expect(await contract.treasury()).to.equal(treasury.address);
    });

    it("should set constants correctly", async function () {
      expect(await contract.MINT_FEE()).to.equal(MINT_FEE);
      expect(await contract.REQUEST_DURATION()).to.equal(30 * 24 * 60 * 60);
    });

    it("should revert if treasury is zero address", async function () {
      const Factory = await ethers.getContractFactory("SoulboundDegreeV2");
      await expect(Factory.deploy(admin.address, ethers.ZeroAddress))
        .to.be.revertedWith("SBD: treasury is zero address");
    });
  });

  // =========================================================================
  //                        CREATE REQUEST
  // =========================================================================

  describe("createRequest", function () {
    it("should create a pending request", async function () {
      const tx = await contract.createRequest(student1.address, SAMPLE_URI);
      await tx.wait();

      const req = await contract.requests(0);
      expect(req.student).to.equal(student1.address);
      expect(req.metadataURI).to.equal(SAMPLE_URI);
      expect(req.status).to.equal(0); // PENDING
      expect(req.tokenId).to.equal(0);
      expect(await contract.requestCount()).to.equal(1);
    });

    it("should emit RequestCreated event", async function () {
      await expect(contract.createRequest(student1.address, SAMPLE_URI))
        .to.emit(contract, "RequestCreated");
    });

    it("should revert for non-admin", async function () {
      await expect(contract.connect(student1).createRequest(student1.address, SAMPLE_URI))
        .to.be.reverted;
    });

    it("should revert for zero address student", async function () {
      await expect(contract.createRequest(ethers.ZeroAddress, SAMPLE_URI))
        .to.be.revertedWith("SBD: student is zero address");
    });

    it("should revert for empty URI", async function () {
      await expect(contract.createRequest(student1.address, ""))
        .to.be.revertedWith("SBD: empty URI");
    });
  });

  // =========================================================================
  //                     CREATE BATCH REQUESTS
  // =========================================================================

  describe("createBatchRequests", function () {
    it("should create multiple requests", async function () {
      const tx = await contract.createBatchRequests(
        [student1.address, student2.address],
        [SAMPLE_URI, SAMPLE_URI2]
      );
      await tx.wait();

      expect(await contract.requestCount()).to.equal(2);
      const req0 = await contract.requests(0);
      const req1 = await contract.requests(1);
      expect(req0.student).to.equal(student1.address);
      expect(req1.student).to.equal(student2.address);
    });

    it("should revert for mismatched arrays", async function () {
      await expect(contract.createBatchRequests(
        [student1.address],
        [SAMPLE_URI, SAMPLE_URI2]
      )).to.be.revertedWith("SBD: arrays length mismatch");
    });

    it("should revert for empty arrays", async function () {
      await expect(contract.createBatchRequests([], []))
        .to.be.revertedWith("SBD: empty arrays");
    });
  });

  // =========================================================================
  //                       CONFIRM AND MINT
  // =========================================================================

  describe("confirmAndMint", function () {
    beforeEach(async function () {
      await contract.createRequest(student1.address, SAMPLE_URI);
    });

    it("should mint SBT and transfer fee to treasury", async function () {
      const treasuryBefore = await ethers.provider.getBalance(treasury.address);

      const tx = await contract.connect(student1).confirmAndMint(0, { value: MINT_FEE });
      await tx.wait();

      // Check request status
      const req = await contract.requests(0);
      expect(req.status).to.equal(1); // CONFIRMED
      expect(req.tokenId).to.equal(1);

      // Check token minted
      expect(await contract.ownerOf(1)).to.equal(student1.address);
      expect(await contract.tokenURI(1)).to.equal(SAMPLE_URI);

      // Check treasury received fee
      const treasuryAfter = await ethers.provider.getBalance(treasury.address);
      expect(treasuryAfter - treasuryBefore).to.equal(MINT_FEE);

      // Check total revenue
      expect(await contract.totalRevenue()).to.equal(MINT_FEE);
    });

    it("should emit RequestConfirmed event", async function () {
      await expect(contract.connect(student1).confirmAndMint(0, { value: MINT_FEE }))
        .to.emit(contract, "RequestConfirmed")
        .withArgs(0, student1.address, 1, MINT_FEE);
    });

    it("should revert if wrong student", async function () {
      await expect(contract.connect(student2).confirmAndMint(0, { value: MINT_FEE }))
        .to.be.revertedWith("SBD: caller is not the student");
    });

    it("should revert if wrong fee amount", async function () {
      await expect(contract.connect(student1).confirmAndMint(0, { value: ethers.parseEther("0.1") }))
        .to.be.revertedWith("SBD: incorrect fee amount");
    });

    it("should revert if no fee sent", async function () {
      await expect(contract.connect(student1).confirmAndMint(0, { value: 0 }))
        .to.be.revertedWith("SBD: incorrect fee amount");
    });

    it("should revert if request expired", async function () {
      // Fast forward 31 days
      await time.increase(31 * 24 * 60 * 60);
      await expect(contract.connect(student1).confirmAndMint(0, { value: MINT_FEE }))
        .to.be.revertedWith("SBD: request has expired");
    });

    it("should revert if request already confirmed", async function () {
      await contract.connect(student1).confirmAndMint(0, { value: MINT_FEE });
      await expect(contract.connect(student1).confirmAndMint(0, { value: MINT_FEE }))
        .to.be.revertedWith("SBD: request is not pending");
    });

    it("should revert if request does not exist", async function () {
      await expect(contract.connect(student1).confirmAndMint(99, { value: MINT_FEE }))
        .to.be.revertedWith("SBD: request does not exist");
    });
  });

  // =========================================================================
  //                        REJECT REQUEST
  // =========================================================================

  describe("rejectRequest", function () {
    beforeEach(async function () {
      await contract.createRequest(student1.address, SAMPLE_URI);
    });

    it("should reject a pending request", async function () {
      await contract.connect(student1).rejectRequest(0, "Sai thông tin họ tên");
      const req = await contract.requests(0);
      expect(req.status).to.equal(3); // REJECTED
      expect(req.rejectionReason).to.equal("Sai thông tin họ tên");
    });

    it("should emit RequestRejected event with reason", async function () {
      await expect(contract.connect(student1).rejectRequest(0, "Sai ngành học"))
        .to.emit(contract, "RequestRejected")
        .withArgs(0, student1.address, "Sai ngành học");
    });

    it("should revert if reason is empty", async function () {
      await expect(contract.connect(student1).rejectRequest(0, ""))
        .to.be.revertedWith("SBD: reason is required");
    });

    it("should revert if not the student", async function () {
      await expect(contract.connect(student2).rejectRequest(0, "Sai thông tin"))
        .to.be.revertedWith("SBD: caller is not the student");
    });

    it("should revert if already confirmed", async function () {
      await contract.connect(student1).confirmAndMint(0, { value: MINT_FEE });
      await expect(contract.connect(student1).rejectRequest(0, "Sai thông tin"))
        .to.be.revertedWith("SBD: request is not pending");
    });
  });

  // =========================================================================
  //                       CANCEL REQUEST (Admin)
  // =========================================================================

  describe("cancelRequest", function () {
    beforeEach(async function () {
      await contract.createRequest(student1.address, SAMPLE_URI);
    });

    it("should cancel a pending request", async function () {
      await contract.cancelRequest(0);
      const req = await contract.requests(0);
      expect(req.status).to.equal(4); // CANCELLED
    });

    it("should emit RequestCancelled event", async function () {
      await expect(contract.cancelRequest(0))
        .to.emit(contract, "RequestCancelled")
        .withArgs(0);
    });

    it("should revert for non-admin", async function () {
      await expect(contract.connect(student1).cancelRequest(0))
        .to.be.reverted;
    });
  });

  // =========================================================================
  //                       CLEAN EXPIRED
  // =========================================================================

  describe("cleanExpired", function () {
    beforeEach(async function () {
      await contract.createRequest(student1.address, SAMPLE_URI);
    });

    it("should mark expired request", async function () {
      await time.increase(31 * 24 * 60 * 60);
      await contract.cleanExpired(0);
      const req = await contract.requests(0);
      expect(req.status).to.equal(2); // EXPIRED
    });

    it("should emit RequestExpired event", async function () {
      await time.increase(31 * 24 * 60 * 60);
      await expect(contract.cleanExpired(0))
        .to.emit(contract, "RequestExpired")
        .withArgs(0);
    });

    it("should revert if not expired yet", async function () {
      await expect(contract.cleanExpired(0))
        .to.be.revertedWith("SBD: request has not expired");
    });

    it("anyone can call cleanExpired", async function () {
      await time.increase(31 * 24 * 60 * 60);
      await contract.connect(outsider).cleanExpired(0);
      const req = await contract.requests(0);
      expect(req.status).to.equal(2); // EXPIRED
    });
  });

  // =========================================================================
  //                       VIEW FUNCTIONS
  // =========================================================================

  describe("View Functions", function () {
    it("getPendingRequests returns only pending", async function () {
      await contract.createRequest(student1.address, SAMPLE_URI);
      await contract.createRequest(student1.address, SAMPLE_URI2);

      // Reject one
      await contract.connect(student1).rejectRequest(0, "Sai thông tin");

      const pending = await contract.getPendingRequests(student1.address);
      expect(pending.length).to.equal(1);
      expect(pending[0]).to.equal(1);
    });

    it("getStudentRequests returns all requests", async function () {
      await contract.createRequest(student1.address, SAMPLE_URI);
      await contract.createRequest(student1.address, SAMPLE_URI2);

      const all = await contract.getStudentRequests(student1.address);
      expect(all.length).to.equal(2);
    });

    it("getStats returns correct values", async function () {
      await contract.createRequest(student1.address, SAMPLE_URI);
      await contract.connect(student1).confirmAndMint(0, { value: MINT_FEE });
      await contract.createRequest(student2.address, SAMPLE_URI2);

      const stats = await contract.getStats();
      expect(stats._totalSupply).to.equal(1);
      expect(stats._totalRevenue).to.equal(MINT_FEE);
      expect(stats._requestCount).to.equal(2);
      expect(stats._pendingCount).to.equal(1);
    });
  });

  // =========================================================================
  //                       DIRECT MINT (V1 compat)
  // =========================================================================

  describe("Direct Mint (V1 compat)", function () {
    it("should mint directly without fee", async function () {
      const tx = await contract.mint(student1.address, SAMPLE_URI);
      await tx.wait();

      expect(await contract.ownerOf(1)).to.equal(student1.address);
      expect(await contract.tokenURI(1)).to.equal(SAMPLE_URI);
    });

    it("should batch mint directly", async function () {
      await contract.batchMint(
        [student1.address, student2.address],
        [SAMPLE_URI, SAMPLE_URI2]
      );

      expect(await contract.ownerOf(1)).to.equal(student1.address);
      expect(await contract.ownerOf(2)).to.equal(student2.address);
    });

    it("should revert for non-admin", async function () {
      await expect(contract.connect(student1).mint(student1.address, SAMPLE_URI))
        .to.be.reverted;
    });
  });

  // =========================================================================
  //                       SOULBOUND + REVOKE
  // =========================================================================

  describe("Soulbound Enforcement", function () {
    beforeEach(async function () {
      await contract.createRequest(student1.address, SAMPLE_URI);
      await contract.connect(student1).confirmAndMint(0, { value: MINT_FEE });
    });

    it("should block transfers", async function () {
      await expect(
        contract.connect(student1).transferFrom(student1.address, student2.address, 1)
      ).to.be.revertedWithCustomError(contract, "SBTTransferNotAllowed");
    });

    it("should block safeTransferFrom", async function () {
      await expect(
        contract.connect(student1)["safeTransferFrom(address,address,uint256)"](
          student1.address, student2.address, 1
        )
      ).to.be.revertedWithCustomError(contract, "SBTTransferNotAllowed");
    });
  });

  describe("Revocation", function () {
    beforeEach(async function () {
      await contract.mint(student1.address, SAMPLE_URI);
    });

    it("should revoke a token", async function () {
      await contract.revoke(1);
      expect(await contract.exists(1)).to.be.false;
    });

    it("should revert for non-admin", async function () {
      await expect(contract.connect(student1).revoke(1)).to.be.reverted;
    });
  });

  // =========================================================================
  //                       SET TREASURY
  // =========================================================================

  describe("setTreasury", function () {
    it("should update treasury", async function () {
      await contract.setTreasury(outsider.address);
      expect(await contract.treasury()).to.equal(outsider.address);
    });

    it("should revert for zero address", async function () {
      await expect(contract.setTreasury(ethers.ZeroAddress))
        .to.be.revertedWith("SBD: treasury is zero address");
    });

    it("should revert for non-admin", async function () {
      await expect(contract.connect(student1).setTreasury(outsider.address))
        .to.be.reverted;
    });
  });
});
