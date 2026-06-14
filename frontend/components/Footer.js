export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-text">
          © {new Date().getFullYear()} XacMinhVanBang — Hệ thống xác minh văn bằng số trên Blockchain
        </p>
        <div className="footer-links">
          <a
            href="https://sepolia.etherscan.io"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Etherscan
          </a>
          <a
            href="https://ipfs.io"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            IPFS
          </a>
        </div>
      </div>
    </footer>
  );
}
