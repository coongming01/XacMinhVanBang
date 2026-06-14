const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SoulboundDegree", function () {
  let soulboundDegree;
  let admin, minter, student1, student2, stranger;

  const SAMPLE_URI_1 = "ipfs://QmTestHash1/metadata.json";
  const SAMPLE_URI_2 = "ipfs://QmTestHash2/metadata.json";
  const SAMPLE_URI_3 = "ipfs://QmTestHash3/metadata.json";

  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));

  beforeEach(async function () {
    [admin, minter, student1, student2, stranger] = await ethers.getSigners();

    const SoulboundDegree = await ethers.getContractFactory("SoulboundDegree");
    soulboundDegree = await SoulboundDegree.deploy(admin.address);
    await soulboundDegree.waitForDeployment();
  });

  // =========================================================================
  // 1. Deployment
  // =========================================================================
  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await soulboundDegree.name()).to.equal("SoulboundDegree");
      expect(await soulboundDegree.symbol()).to.equal("SBD");
    });

    it("Should grant DEFAULT_ADMIN_ROLE to admin", async function () {
      const DEFAULT_ADMIN_ROLE = await soulboundDegree.DEFAULT_ADMIN_ROLE();
      expect(await soulboundDegree.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.be.true;
    });

    it("Should grant MINTER_ROLE to admin", async function () {
      expect(await soulboundDegree.hasRole(MINTER_ROLE, admin.address)).to.be.true;
    });

    it("Should have zero total supply initially", async function () {
      expect(await soulboundDegree.totalSupply()).to.equal(0);
    });
  });

  // =========================================================================
  // 2. Minting
  // =========================================================================
  describe("Minting", function () {
    it("Should allow admin (MINTER_ROLE) to mint a token", async function () {
      const tx = await soulboundDegree.connect(admin).mint(student1.address, SAMPLE_URI_1);
      const receipt = await tx.wait();

      expect(await soulboundDegree.ownerOf(1)).to.equal(student1.address);
      expect(await soulboundDegree.totalSupply()).to.equal(1);
    });

    it("Should return the correct token ID when minting", async function () {
      // Token IDs start at 1
      const tokenId = await soulboundDegree.connect(admin).mint.staticCall(student1.address, SAMPLE_URI_1);
      expect(tokenId).to.equal(1);
    });

    it("Should auto-increment token IDs", async function () {
      await soulboundDegree.connect(admin).mint(student1.address, SAMPLE_URI_1);
      await soulboundDegree.connect(admin).mint(student2.address, SAMPLE_URI_2);

      expect(await soulboundDegree.ownerOf(1)).to.equal(student1.address);
      expect(await soulboundDegree.ownerOf(2)).to.equal(student2.address);
    });

    it("Should revert when non-MINTER_ROLE tries to mint", async function () {
      await expect(
        soulboundDegree.connect(stranger).mint(student1.address, SAMPLE_URI_1)
      ).to.be.reverted;
    });

    it("Should allow a granted MINTER_ROLE account to mint", async function () {
      // Grant MINTER_ROLE to the minter account
      await soulboundDegree.connect(admin).grantRole(MINTER_ROLE, minter.address);

      await soulboundDegree.connect(minter).mint(student1.address, SAMPLE_URI_1);
      expect(await soulboundDegree.ownerOf(1)).to.equal(student1.address);
    });
  });

  // =========================================================================
  // 3. Soulbound (Non-Transferable)
  // =========================================================================
  describe("Soulbound", function () {
    beforeEach(async function () {
      await soulboundDegree.connect(admin).mint(student1.address, SAMPLE_URI_1);
    });

    it("Should revert on transferFrom", async function () {
      await expect(
        soulboundDegree.connect(student1).transferFrom(student1.address, student2.address, 1)
      ).to.be.revertedWithCustomError(soulboundDegree, "SBTTransferNotAllowed");
    });

    it("Should revert on safeTransferFrom", async function () {
      await expect(
        soulboundDegree.connect(student1)["safeTransferFrom(address,address,uint256)"](
          student1.address, student2.address, 1
        )
      ).to.be.revertedWithCustomError(soulboundDegree, "SBTTransferNotAllowed");
    });

    it("Should revert on safeTransferFrom with data", async function () {
      await expect(
        soulboundDegree.connect(student1)["safeTransferFrom(address,address,uint256,bytes)"](
          student1.address, student2.address, 1, "0x"
        )
      ).to.be.revertedWithCustomError(soulboundDegree, "SBTTransferNotAllowed");
    });
  });

  // =========================================================================
  // 4. Revoke (Burn)
  // =========================================================================
  describe("Revoke", function () {
    beforeEach(async function () {
      await soulboundDegree.connect(admin).mint(student1.address, SAMPLE_URI_1);
    });

    it("Should allow MINTER_ROLE to revoke a token", async function () {
      await soulboundDegree.connect(admin).revoke(1);

      expect(await soulboundDegree.exists(1)).to.be.false;
      expect(await soulboundDegree.totalSupply()).to.equal(0);
    });

    it("Should revert when querying ownerOf a revoked token", async function () {
      await soulboundDegree.connect(admin).revoke(1);

      await expect(soulboundDegree.ownerOf(1)).to.be.reverted;
    });

    it("Should revert when non-MINTER_ROLE tries to revoke", async function () {
      await expect(
        soulboundDegree.connect(stranger).revoke(1)
      ).to.be.reverted;
    });

    it("Should update balance after revocation", async function () {
      expect(await soulboundDegree.balanceOf(student1.address)).to.equal(1);

      await soulboundDegree.connect(admin).revoke(1);

      expect(await soulboundDegree.balanceOf(student1.address)).to.equal(0);
    });
  });

  // =========================================================================
  // 5. Batch Mint
  // =========================================================================
  describe("Batch Mint", function () {
    it("Should batch mint multiple tokens", async function () {
      const recipients = [student1.address, student2.address, student1.address];
      const uris = [SAMPLE_URI_1, SAMPLE_URI_2, SAMPLE_URI_3];

      await soulboundDegree.connect(admin).batchMint(recipients, uris);

      expect(await soulboundDegree.totalSupply()).to.equal(3);
      expect(await soulboundDegree.ownerOf(1)).to.equal(student1.address);
      expect(await soulboundDegree.ownerOf(2)).to.equal(student2.address);
      expect(await soulboundDegree.ownerOf(3)).to.equal(student1.address);
    });

    it("Should return correct token IDs from batch mint", async function () {
      const recipients = [student1.address, student2.address];
      const uris = [SAMPLE_URI_1, SAMPLE_URI_2];

      const tokenIds = await soulboundDegree.connect(admin).batchMint.staticCall(recipients, uris);

      expect(tokenIds[0]).to.equal(1);
      expect(tokenIds[1]).to.equal(2);
    });

    it("Should revert when arrays have different lengths", async function () {
      const recipients = [student1.address, student2.address];
      const uris = [SAMPLE_URI_1];

      await expect(
        soulboundDegree.connect(admin).batchMint(recipients, uris)
      ).to.be.revertedWith("SBD: arrays length mismatch");
    });

    it("Should revert when arrays are empty", async function () {
      await expect(
        soulboundDegree.connect(admin).batchMint([], [])
      ).to.be.revertedWith("SBD: empty arrays");
    });

    it("Should revert when non-MINTER_ROLE tries to batch mint", async function () {
      await expect(
        soulboundDegree.connect(stranger).batchMint(
          [student1.address],
          [SAMPLE_URI_1]
        )
      ).to.be.reverted;
    });
  });

  // =========================================================================
  // 6. Token URI
  // =========================================================================
  describe("Token URI", function () {
    it("Should return the correct URI for a minted token", async function () {
      await soulboundDegree.connect(admin).mint(student1.address, SAMPLE_URI_1);

      expect(await soulboundDegree.tokenURI(1)).to.equal(SAMPLE_URI_1);
    });

    it("Should return different URIs for different tokens", async function () {
      await soulboundDegree.connect(admin).mint(student1.address, SAMPLE_URI_1);
      await soulboundDegree.connect(admin).mint(student2.address, SAMPLE_URI_2);

      expect(await soulboundDegree.tokenURI(1)).to.equal(SAMPLE_URI_1);
      expect(await soulboundDegree.tokenURI(2)).to.equal(SAMPLE_URI_2);
    });

    it("Should revert when querying URI of non-existent token", async function () {
      await expect(soulboundDegree.tokenURI(999)).to.be.reverted;
    });
  });

  // =========================================================================
  // 7. tokensOfOwner
  // =========================================================================
  describe("tokensOfOwner", function () {
    it("Should return empty array for address with no tokens", async function () {
      const tokens = await soulboundDegree.tokensOfOwner(student1.address);
      expect(tokens.length).to.equal(0);
    });

    it("Should return correct token IDs for an owner", async function () {
      await soulboundDegree.connect(admin).mint(student1.address, SAMPLE_URI_1);
      await soulboundDegree.connect(admin).mint(student2.address, SAMPLE_URI_2);
      await soulboundDegree.connect(admin).mint(student1.address, SAMPLE_URI_3);

      const tokensStudent1 = await soulboundDegree.tokensOfOwner(student1.address);
      expect(tokensStudent1.length).to.equal(2);
      expect(tokensStudent1[0]).to.equal(1);
      expect(tokensStudent1[1]).to.equal(3);

      const tokensStudent2 = await soulboundDegree.tokensOfOwner(student2.address);
      expect(tokensStudent2.length).to.equal(1);
      expect(tokensStudent2[0]).to.equal(2);
    });

    it("Should update after revocation", async function () {
      await soulboundDegree.connect(admin).mint(student1.address, SAMPLE_URI_1);
      await soulboundDegree.connect(admin).mint(student1.address, SAMPLE_URI_2);

      await soulboundDegree.connect(admin).revoke(1);

      const tokens = await soulboundDegree.tokensOfOwner(student1.address);
      expect(tokens.length).to.equal(1);
      expect(tokens[0]).to.equal(2);
    });
  });

  // =========================================================================
  // 8. exists()
  // =========================================================================
  describe("exists", function () {
    it("Should return false for non-existent token", async function () {
      expect(await soulboundDegree.exists(1)).to.be.false;
    });

    it("Should return true for minted token", async function () {
      await soulboundDegree.connect(admin).mint(student1.address, SAMPLE_URI_1);
      expect(await soulboundDegree.exists(1)).to.be.true;
    });

    it("Should return false after revocation", async function () {
      await soulboundDegree.connect(admin).mint(student1.address, SAMPLE_URI_1);
      await soulboundDegree.connect(admin).revoke(1);
      expect(await soulboundDegree.exists(1)).to.be.false;
    });
  });

  // =========================================================================
  // 9. supportsInterface
  // =========================================================================
  describe("supportsInterface", function () {
    it("Should support ERC721 interface", async function () {
      // ERC721 interfaceId = 0x80ac58cd
      expect(await soulboundDegree.supportsInterface("0x80ac58cd")).to.be.true;
    });

    it("Should support ERC721Enumerable interface", async function () {
      // ERC721Enumerable interfaceId = 0x780e9d63
      expect(await soulboundDegree.supportsInterface("0x780e9d63")).to.be.true;
    });

    it("Should support AccessControl interface", async function () {
      // IAccessControl interfaceId = 0x7965db0b
      expect(await soulboundDegree.supportsInterface("0x7965db0b")).to.be.true;
    });
  });
});
