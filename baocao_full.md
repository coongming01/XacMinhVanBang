# LỜI MỞ ĐẦU

## 1. Lý do chọn đề tài

Trong bối cảnh hội nhập quốc tế và chuyển đổi số đang diễn ra mạnh mẽ trên toàn cầu, lĩnh vực giáo dục đại học đang đối mặt với một thách thức nghiêm trọng và dai dẳng: **nạn giả mạo văn bằng tốt nghiệp**. Theo thống kê của Bộ Giáo dục và Đào tạo Việt Nam, hàng năm có hàng trăm vụ việc liên quan đến sử dụng bằng cấp giả bị phát hiện, gây ra những hậu quả nặng nề cho xã hội, làm suy giảm niềm tin vào hệ thống giáo dục và ảnh hưởng trực tiếp đến quyền lợi của những sinh viên tốt nghiệp chính quy.

Quy trình cấp và xác minh văn bằng truyền thống hiện nay tồn tại nhiều bất cập: văn bằng được in trên giấy với các yếu tố bảo mật hạn chế, dễ bị làm giả bằng công nghệ in ấn hiện đại; việc xác minh tính xác thực của bằng cấp phải thực hiện thủ công thông qua liên hệ trực tiếp với cơ sở đào tạo, mất nhiều thời gian (trung bình từ 5-15 ngày làm việc) và chi phí; dữ liệu văn bằng được lưu trữ tập trung tại các cơ sở đào tạo, tiềm ẩn rủi ro mất mát, hư hỏng hoặc bị thao túng.

Trước thực trạng đó, công nghệ **Blockchain** — với các đặc tính nổi bật như tính bất biến (immutability), minh bạch (transparency), phi tập trung (decentralization) và khả năng kiểm chứng công khai — đã nổi lên như một giải pháp tiềm năng để cách mạng hóa quy trình quản lý văn bằng. Đặc biệt, khái niệm **Soulbound Token (SBT)** do Vitalik Buterin đề xuất vào năm 2022 trong bài nghiên cứu *"Decentralized Society: Finding Web3's Soul"* đã mở ra một hướng tiếp cận hoàn toàn mới: token hóa văn bằng thành một tài sản số **không thể chuyển nhượng**, gắn vĩnh viễn với danh tính số của người sở hữu — phản ánh chính xác bản chất của văn bằng tốt nghiệp trong thế giới thực.

Xuất phát từ những lý do trên, nhóm nghiên cứu đã lựa chọn đề tài **"Hệ thống cấp và xác minh văn bằng tốt nghiệp sử dụng Soulbound Token (SBT) trên Ethereum Blockchain"** nhằm xây dựng một giải pháp công nghệ toàn diện, ứng dụng Blockchain để giải quyết triệt để vấn đề giả mạo văn bằng, đồng thời tự động hóa và minh bạch hóa toàn bộ quy trình cấp phát và xác minh bằng cấp.

## 2. Mục tiêu nghiên cứu

**Mục tiêu tổng quát:**

Nghiên cứu, thiết kế và triển khai một hệ thống cấp và xác minh văn bằng tốt nghiệp dựa trên công nghệ Blockchain, sử dụng Soulbound Token (SBT) trên mạng Ethereum, nhằm đảm bảo tính xác thực, minh bạch và bất biến của văn bằng số.

**Mục tiêu cụ thể:**

- Nghiên cứu cơ sở lý luận về công nghệ Blockchain, Soulbound Token và các ứng dụng trong lĩnh vực giáo dục trên thế giới.
- Phân tích thực trạng quản lý văn bằng tại Việt Nam, nhận diện các bất cập và đề xuất hướng giải quyết dựa trên công nghệ Blockchain.
- Thiết kế kiến trúc hệ thống bao gồm: Smart Contract (Solidity), Frontend (Next.js), lưu trữ phi tập trung (IPFS/Pinata) và tích hợp ví điện tử (MetaMask).
- Triển khai hợp đồng thông minh SoulboundDegreeV2 trên mạng Ethereum Sepolia với quy trình cấp bằng 2 bước: Admin tạo yêu cầu → Sinh viên xác nhận và thanh toán → Mint SBT tự động.
- Xây dựng giao diện web cho phép quản trị viên cấp bằng, sinh viên xác nhận và nhận bằng, cũng như bất kỳ ai đều có thể xác minh văn bằng thông qua địa chỉ ví hoặc mã QR.
- Kiểm thử toàn diện hệ thống với bộ test tự động và demo thực tế trên mạng Sepolia Testnet.

## 3. Phạm vi và đối tượng nghiên cứu

**Đối tượng nghiên cứu:**

- Công nghệ Blockchain và chuẩn token ERC-721 trên nền tảng Ethereum.
- Khái niệm Soulbound Token (SBT) và cơ chế chống chuyển nhượng.
- Quy trình cấp phát, lưu trữ và xác minh văn bằng tốt nghiệp.
- Hệ thống lưu trữ phi tập trung IPFS (InterPlanetary File System).

**Phạm vi nghiên cứu:**

- Về mặt lý thuyết: Tập trung vào công nghệ Blockchain, Smart Contract, Soulbound Token và các ứng dụng trong giáo dục.
- Về mặt thực tiễn: Thiết kế và triển khai hệ thống demo trên mạng Ethereum Sepolia Testnet, không triển khai trên Mainnet.
- Về mặt chức năng: Hệ thống hỗ trợ cấp bằng đơn lẻ và hàng loạt, xác nhận 2 bước có thu phí, xác minh bằng địa chỉ ví/Token ID/QR code, thu hồi bằng khi cần thiết.

## 4. Phương pháp nghiên cứu

- **Phương pháp nghiên cứu tài liệu:** Thu thập, phân tích và tổng hợp các tài liệu, bài báo khoa học, whitepaper liên quan đến Blockchain, Soulbound Token và ứng dụng trong giáo dục.
- **Phương pháp phân tích và thiết kế hệ thống:** Sử dụng các kỹ thuật phân tích yêu cầu, thiết kế kiến trúc phần mềm, mô hình hóa quy trình (Use Case, Sequence Diagram) để xây dựng hệ thống.
- **Phương pháp thực nghiệm:** Lập trình, triển khai và kiểm thử hệ thống trên môi trường thực tế (Ethereum Sepolia Testnet) với bộ kiểm thử tự động gồm 45 test cases.
- **Phương pháp so sánh đối chiếu:** So sánh giải pháp đề xuất với các hệ thống quản lý văn bằng truyền thống và các giải pháp Blockchain hiện có trên thế giới.

## 5. Bố cục báo cáo

Ngoài phần Lời mở đầu, Kết luận và Tài liệu tham khảo, báo cáo được chia thành 3 chương chính:

- **Chương I — Cơ sở lý luận về Blockchain trong cấp và xác minh văn bằng tốt nghiệp:** Trình bày các khái niệm nền tảng về công nghệ Blockchain, Soulbound Token, hợp đồng thông minh và các ứng dụng trong lĩnh vực quản lý văn bằng. Đồng thời phân tích các thách thức khi ứng dụng Blockchain trong giáo dục.

- **Chương II — Nghiên cứu kinh nghiệm thực tiễn áp dụng Blockchain trong quản lý văn bằng trên thế giới:** Phân tích các case study điển hình từ MIT, các trường đại học quốc tế, nền tảng Blockcerts, Ethereum Attestation Service (EAS) và mô hình SBT của Vitalik Buterin, từ đó rút ra bài học kinh nghiệm cho Việt Nam.

- **Chương III — Thiết kế và triển khai hệ thống cấp và xác minh văn bằng sử dụng SBT tại Việt Nam:** Trình bày thực trạng quản lý văn bằng tại Việt Nam, thiết kế kiến trúc và triển khai hệ thống XacMinhVanBang với Smart Contract SoulboundDegreeV2 trên Ethereum, và đề xuất các giải pháp thúc đẩy ứng dụng Blockchain trong giáo dục Việt Nam.
# NỘI DUNG

# CHƯƠNG I. CƠ SỞ LÝ LUẬN VỀ BLOCKCHAIN TRONG CẤP VÀ XÁC MINH VĂN BẰNG TỐT NGHIỆP

## Khái quát về công nghệ Blockchain

### 1.1. Khái niệm và Kiến trúc Sổ cái phân tán (Distributed Ledger) trong quản lý văn bằng

**Blockchain** (chuỗi khối) là một công nghệ sổ cái phân tán (Distributed Ledger Technology — DLT) cho phép ghi lại các giao dịch một cách an toàn, minh bạch và không thể thay đổi. Về bản chất, Blockchain là một cơ sở dữ liệu phi tập trung, trong đó dữ liệu được tổ chức thành các "khối" (block) liên kết với nhau theo thứ tự thời gian thông qua các hàm băm mật mã (cryptographic hash), tạo thành một "chuỗi" (chain) liên tục và không thể bị phá vỡ.

Mỗi khối trong chuỗi chứa ba thành phần chính:

- **Dữ liệu giao dịch (Transaction Data):** Các thông tin về giao dịch được ghi nhận, ví dụ: thông tin văn bằng, địa chỉ ví người nhận, metadata URI trên IPFS.
- **Mã băm của khối hiện tại (Current Block Hash):** Một chuỗi ký tự duy nhất được tính toán từ toàn bộ nội dung của khối, đóng vai trò như "dấu vân tay" nhận dạng khối.
- **Mã băm của khối trước đó (Previous Block Hash):** Liên kết khối hiện tại với khối trước, tạo thành chuỗi liên tục. Bất kỳ thay đổi nào ở một khối sẽ làm thay đổi mã băm của nó, phá vỡ liên kết với các khối sau, từ đó giúp phát hiện ngay lập tức mọi hành vi giả mạo.

[Chèn hình: Sơ đồ cấu trúc một khối (Block) trong Blockchain — bao gồm Block Header (Previous Hash, Timestamp, Nonce, Merkle Root) và Block Body (danh sách giao dịch)]

Trong ngữ cảnh quản lý văn bằng, kiến trúc sổ cái phân tán mang lại những lợi thế vượt trội so với hệ thống cơ sở dữ liệu tập trung truyền thống:

| Tiêu chí | Hệ thống tập trung | Blockchain (Sổ cái phân tán) |
|---|---|---|
| Kiểm soát dữ liệu | Một tổ chức duy nhất | Phân tán trên nhiều nút mạng |
| Rủi ro điểm lỗi đơn | Cao (Single Point of Failure) | Gần như không có |
| Khả năng giả mạo | Có thể bị thao túng nếu truy cập được CSDL | Gần như bất khả thi |
| Xác minh | Phải liên hệ cơ sở đào tạo | Tự động, công khai, tức thì |
| Minh bạch | Hạn chế | Hoàn toàn minh bạch |

### 1.2. Phân loại mạng lưới và Quyền truy cập (Public, Private, Consortium Blockchain)

Tùy thuộc vào mức độ phân quyền và khả năng truy cập, Blockchain được phân thành ba loại chính:

**a) Public Blockchain (Blockchain công khai)**

Là mạng lưới mở, bất kỳ ai cũng có thể tham gia, đọc dữ liệu và xác thực giao dịch. Không có tổ chức trung tâm kiểm soát. Ví dụ điển hình: Bitcoin, Ethereum. Trong đề tài này, hệ thống XacMinhVanBang được triển khai trên **Ethereum** — một Public Blockchain — nhằm đảm bảo tính minh bạch tối đa: bất kỳ ai trên thế giới đều có thể xác minh văn bằng mà không cần qua trung gian.

**b) Private Blockchain (Blockchain riêng tư)**

Là mạng lưới được quản lý bởi một tổ chức duy nhất. Chỉ những người được cấp quyền mới có thể tham gia và truy cập dữ liệu. Ví dụ: Hyperledger Fabric. Private Blockchain phù hợp cho các tổ chức muốn kiểm soát chặt chẽ quyền truy cập nhưng vẫn tận dụng tính bất biến của công nghệ Blockchain.

**c) Consortium Blockchain (Blockchain liên minh)**

Là mô hình lai giữa Public và Private, được quản lý bởi một nhóm các tổ chức cùng tham gia. Ví dụ: một liên minh các trường đại học cùng vận hành một mạng Blockchain để chia sẻ và xác minh văn bằng lẫn nhau. Đây là mô hình được khuyến nghị cho việc triển khai hệ thống xác minh văn bằng ở quy mô quốc gia.

[Chèn hình: Bảng so sánh trực quan 3 loại Blockchain (Public, Private, Consortium) về các tiêu chí: Quyền truy cập, Tốc độ, Mức độ phi tập trung, Ứng dụng phù hợp]

| Tiêu chí | Public | Private | Consortium |
|---|---|---|---|
| Quyền truy cập | Mở hoàn toàn | Hạn chế (1 tổ chức) | Hạn chế (nhóm tổ chức) |
| Tốc độ giao dịch | Chậm (~15s/block) | Nhanh | Nhanh |
| Phi tập trung | Cao nhất | Thấp | Trung bình |
| Chi phí vận hành | Gas fee | Thấp | Trung bình |
| Minh bạch | Tối đa | Hạn chế | Có kiểm soát |
| Ứng dụng phù hợp | Xác minh công khai | Nội bộ tổ chức | Liên trường đại học |

### 1.3. Đánh giá Thuộc tính Tích cực và Hạn chế Hệ thống

**Thuộc tính tích cực của Blockchain trong quản lý văn bằng:**

- **Tính bất biến (Immutability):** Sau khi văn bằng được ghi lên Blockchain, không ai có thể sửa đổi hoặc xóa bỏ dữ liệu. Điều này loại trừ hoàn toàn khả năng giả mạo hoặc thao túng thông tin văn bằng.

- **Tính minh bạch (Transparency):** Mọi giao dịch cấp bằng đều được ghi nhận công khai trên Blockchain. Bất kỳ ai có địa chỉ ví hoặc Token ID đều có thể xác minh văn bằng một cách độc lập mà không cần sự can thiệp của bên thứ ba.

- **Tính phi tập trung (Decentralization):** Dữ liệu văn bằng không phụ thuộc vào một máy chủ hay tổ chức duy nhất. Ngay cả khi một trường đại học ngừng hoạt động, văn bằng trên Blockchain vẫn tồn tại vĩnh viễn.

- **Tính bảo mật (Security):** Sử dụng mã hóa bất đối xứng (Public-Private Key) và hàm băm mật mã (SHA-256, Keccak-256), đảm bảo chỉ người sở hữu khóa riêng mới có thể tương tác với văn bằng của mình.

- **Khả năng kiểm chứng tức thì (Instant Verification):** Thay vì mất 5-15 ngày để xác minh bằng phương pháp truyền thống, hệ thống Blockchain cho phép xác minh trong vài giây thông qua truy vấn trực tiếp smart contract.

**Hạn chế cần lưu ý:**

- **Chi phí Gas fee:** Mỗi giao dịch trên Ethereum đều phải trả phí gas, có thể biến động theo mức độ tắc nghẽn mạng. Tuy nhiên, với việc sử dụng Sepolia Testnet và các giải pháp Layer 2, chi phí này có thể được kiểm soát.

- **Khả năng mở rộng (Scalability):** Ethereum hiện xử lý khoảng 15-30 giao dịch/giây, thấp hơn nhiều so với các hệ thống tập trung. Đối với quy mô cấp bằng của một trường đại học, con số này là đủ, nhưng sẽ cần giải pháp Layer 2 khi triển khai ở quy mô quốc gia.

- **Quyền riêng tư (Privacy):** Dữ liệu trên Public Blockchain là công khai. Cần thiết kế cẩn thận để chỉ lưu trữ metadata URI trên chain, trong khi thông tin chi tiết được mã hóa và lưu trên IPFS.

- **Độ phức tạp kỹ thuật:** Việc tương tác với Blockchain đòi hỏi người dùng phải có ví điện tử (MetaMask) và hiểu biết cơ bản về cryptocurrency, tạo ra rào cản cho người dùng phổ thông.

### 1.4. Cơ chế Mã hóa (Hashing) và Sự bất biến của dữ liệu

Hàm băm mật mã (Cryptographic Hash Function) là nền tảng đảm bảo tính bất biến của Blockchain. Ethereum sử dụng thuật toán **Keccak-256** — một biến thể của SHA-3 — để tạo mã băm cho các khối và giao dịch.

**Đặc điểm của hàm băm Keccak-256:**

- **Tính xác định (Deterministic):** Cùng một dữ liệu đầu vào luôn cho ra cùng một mã băm đầu ra.
- **Tính một chiều (One-way):** Không thể suy ngược dữ liệu gốc từ mã băm.
- **Tính nhạy cảm (Avalanche Effect):** Thay đổi dù chỉ 1 bit trong dữ liệu đầu vào sẽ tạo ra mã băm hoàn toàn khác biệt.
- **Tính chống va chạm (Collision Resistance):** Gần như không thể tìm được hai dữ liệu đầu vào khác nhau cho ra cùng một mã băm.

**Ứng dụng trong hệ thống văn bằng:**

Khi một văn bằng SBT được mint (đúc) trên Blockchain, toàn bộ thông tin giao dịch (địa chỉ ví sinh viên, metadata URI, timestamp, phí thanh toán) được băm bằng Keccak-256 và ghi vào khối. Mã băm này được liên kết với khối tiếp theo, tạo thành chuỗi bất biến. Bất kỳ nỗ lực nào nhằm sửa đổi thông tin văn bằng sẽ làm thay đổi mã băm của khối chứa nó, phá vỡ liên kết với các khối sau và bị toàn bộ mạng lưới từ chối.

[Chèn hình: Minh họa cơ chế Hashing liên kết các khối — khi thay đổi dữ liệu Block 2, hash thay đổi, Block 3 phát hiện sai lệch]

Ngoài ra, trong hệ thống XacMinhVanBang, hàm băm Keccak-256 còn được sử dụng để:

- Tính toán **MINTER_ROLE** = `keccak256("MINTER_ROLE")` để phân quyền quản trị viên trong smart contract.
- Xác định danh tính duy nhất của mỗi giao dịch thông qua **Transaction Hash** trên Ethereum.
- Đảm bảo tính toàn vẹn của metadata văn bằng lưu trên IPFS thông qua **Content Identifier (CID)**.

### 1.5. Hợp đồng thông minh (Smart Contracts) và cơ chế tự động hóa quy trình cấp bằng

**Hợp đồng thông minh (Smart Contract)** là các chương trình máy tính được lưu trữ và thực thi trực tiếp trên Blockchain. Chúng hoạt động theo nguyên tắc **"if-then"** (nếu-thì): khi các điều kiện được xác định trước được thỏa mãn, smart contract tự động thực thi các hành động đã được lập trình sẵn, không cần sự can thiệp của bên thứ ba.

**Đặc điểm của Smart Contract:**

- **Tự động thực thi (Self-executing):** Khi điều kiện được đáp ứng, hợp đồng tự động chạy mà không cần phê duyệt thủ công.
- **Tính bất biến (Immutable):** Sau khi triển khai lên Blockchain, mã nguồn của smart contract không thể bị sửa đổi.
- **Minh bạch (Transparent):** Mã nguồn và trạng thái của smart contract có thể được kiểm tra công khai bởi bất kỳ ai.
- **Không cần trung gian (Trustless):** Các bên tham gia không cần tin tưởng lẫn nhau — họ chỉ cần tin tưởng vào mã nguồn của smart contract.

**Ngôn ngữ Solidity và Ethereum Virtual Machine (EVM):**

Smart contract trên Ethereum được viết bằng ngôn ngữ lập trình **Solidity** — một ngôn ngữ bậc cao, hướng đối tượng, được thiết kế đặc biệt cho việc phát triển smart contract. Mã Solidity được biên dịch thành bytecode và thực thi trên **Ethereum Virtual Machine (EVM)** — một môi trường máy ảo hoàn chỉnh Turing, đảm bảo mã được thực thi nhất quán trên tất cả các nút trong mạng lưới.

**Ứng dụng trong quy trình cấp bằng tự động:**

Trong hệ thống XacMinhVanBang, smart contract **SoulboundDegreeV2** tự động hóa toàn bộ quy trình cấp bằng thông qua cơ chế máy trạng thái (State Machine):

1. **Admin tạo yêu cầu:** Gọi hàm `createRequest(student, uri)` → Smart contract tự động tạo một DegreeRequest với trạng thái PENDING, thiết lập thời hạn 30 ngày.

2. **Sinh viên xác nhận:** Gọi hàm `confirmAndMint(requestId)` kèm 0.3 ETH → Smart contract tự động kiểm tra: (a) người gọi có phải là sinh viên được chỉ định? (b) yêu cầu còn hiệu lực? (c) số tiền thanh toán chính xác? Nếu tất cả điều kiện thỏa mãn → tự động mint SBT và chuyển phí vào treasury.

3. **Xác minh tự động:** Bất kỳ ai gọi hàm `tokenURI(tokenId)` hoặc `ownerOf(tokenId)` → Smart contract tự động trả về thông tin văn bằng mà không cần bất kỳ sự can thiệp nào.

[Chèn hình: Sơ đồ State Machine của DegreeRequest — các trạng thái PENDING → CONFIRMED/REJECTED/EXPIRED/CANCELLED và các điều kiện chuyển đổi]

---

## Ứng dụng Blockchain trong quản lý và xác minh văn bằng tốt nghiệp

### 2.1. Xác thực nguồn gốc văn bằng đầu cuối (End-to-End Verification)

Một trong những giá trị cốt lõi của Blockchain trong quản lý văn bằng là khả năng **xác thực nguồn gốc đầu cuối** (End-to-End Verification) — tức là có thể truy vết toàn bộ vòng đời của một văn bằng từ lúc được tạo ra cho đến khi được xác minh, mà không cần qua bất kỳ trung gian nào.

**Quy trình xác thực đầu cuối trong hệ thống SBT:**

- **Nguồn gốc (Origin):** Văn bằng chỉ có thể được tạo bởi tài khoản có quyền MINTER_ROLE trên smart contract. Quyền này được cấp khi triển khai contract và chỉ có thể thay đổi bởi DEFAULT_ADMIN_ROLE. Điều này đảm bảo chỉ cơ sở đào tạo được ủy quyền mới có thể tạo yêu cầu cấp bằng.

- **Xác nhận (Confirmation):** Sinh viên phải tự xác nhận thông tin bằng cách ký giao dịch bằng khóa riêng (private key) của ví MetaMask. Chữ ký số này là bằng chứng không thể chối bỏ (non-repudiation) rằng chính sinh viên đó đã đồng ý nhận bằng.

- **Lưu trữ (Storage):** Metadata văn bằng (tên, ngành, xếp loại, ảnh bằng) được lưu trên IPFS — hệ thống lưu trữ phi tập trung — với Content Identifier (CID) duy nhất. URI của metadata được ghi lên Blockchain, tạo liên kết bất biến giữa token và dữ liệu.

- **Xác minh (Verification):** Bất kỳ ai nhập địa chỉ ví hoặc Token ID vào trang xác minh → hệ thống truy vấn trực tiếp smart contract → trả về thông tin văn bằng gốc từ Blockchain + IPFS. Không thể giả mạo vì dữ liệu đến trực tiếp từ smart contract.

### 2.2. Chống giả mạo văn bằng và đảm bảo tính toàn vẹn dữ liệu

**Các cơ chế chống giả mạo trong hệ thống SBT:**

**a) Soulbound — Không thể chuyển nhượng:**

Khác với NFT thông thường có thể mua bán và chuyển nhượng, Soulbound Token được thiết kế để **gắn vĩnh viễn** với ví của người nhận. Trong smart contract SoulboundDegreeV2, cơ chế này được thực thi bằng cách override hàm `_update()`:

```solidity
function _update(address to, uint256 tokenId, address auth)
    internal override(ERC721, ERC721Enumerable)
    returns (address)
{
    address from = _ownerOf(tokenId);
    if (from != address(0) && to != address(0)) {
        revert SBTTransferNotAllowed();
    }
    return super._update(to, tokenId, auth);
}
```

Hàm này cho phép mint (from = address(0)) và burn (to = address(0)), nhưng chặn hoàn toàn mọi hành vi transfer giữa hai ví. Điều này phản ánh đúng bản chất của văn bằng tốt nghiệp: chỉ thuộc về người được cấp, không thể bán hay cho người khác.

**b) Kiểm soát quyền truy cập (Access Control):**

Smart contract sử dụng OpenZeppelin AccessControl để phân quyền rõ ràng:
- `DEFAULT_ADMIN_ROLE`: Quản trị tối cao, có quyền cấp/thu hồi vai trò.
- `MINTER_ROLE`: Quyền tạo yêu cầu cấp bằng, hủy yêu cầu, thu hồi bằng.

Chỉ tài khoản có MINTER_ROLE mới có thể gọi các hàm `createRequest()`, `cancelRequest()`, `revoke()`. Người ngoài hệ thống không thể tự tạo văn bằng giả.

**c) Thu hồi bằng (Revocation):**

Trong trường hợp phát hiện sai phạm, admin có thể thu hồi (burn) bằng bằng hàm `revoke(tokenId)`. Token bị thu hồi sẽ không còn tồn tại trên Blockchain, và hàm `exists(tokenId)` sẽ trả về `false`. Điều này đảm bảo hệ thống có cơ chế "tự sửa lỗi" khi cần.

### 2.3. Soulbound Token (SBT) — Khái niệm, đặc điểm và ưu thế so với NFT truyền thống

**Khái niệm Soulbound Token (SBT):**

Thuật ngữ "Soulbound" được lấy cảm hứng từ các vật phẩm "soulbound" trong trò chơi World of Warcraft — những vật phẩm khi được nhặt lên sẽ gắn vĩnh viễn với nhân vật và không thể giao dịch. Khái niệm này được Vitalik Buterin (đồng sáng lập Ethereum) chính thức đề xuất trong bài nghiên cứu **"Decentralized Society: Finding Web3's Soul"** (tháng 5/2022), cùng với các tác giả E. Glen Weyl và Puja Ohlhaver.

SBT được định nghĩa là một loại token **không thể chuyển nhượng** (non-transferable) được gắn với một "linh hồn" (soul) — tức một tài khoản/ví đại diện cho một cá nhân hoặc tổ chức. SBT đại diện cho các cam kết, thông tin xác thực và liên kết xã hội mà bản chất không nên được mua bán: bằng cấp, chứng chỉ, giấy phép, thành viên, danh tiếng.

**So sánh SBT với NFT truyền thống:**

| Tiêu chí | NFT truyền thống | Soulbound Token (SBT) |
|---|---|---|
| Chuyển nhượng | Có thể mua bán, trao đổi | Không thể chuyển nhượng |
| Mục đích | Đại diện quyền sở hữu tài sản số | Đại diện danh tính, uy tín, bằng cấp |
| Giá trị | Phụ thuộc thị trường (speculative) | Giá trị nội tại (intrinsic) |
| Ví dụ | Ảnh NFT, game item, artwork | Văn bằng, chứng chỉ, giấy phép |
| Tiêu chuẩn | ERC-721, ERC-1155 | ERC-721 (custom non-transferable) |
| Phù hợp cho văn bằng | Không (có thể bán bằng giả) | Có (gắn vĩnh viễn với chủ sở hữu) |

**Ưu thế của SBT trong quản lý văn bằng:**

- **Chống giao dịch bằng giả:** Vì không thể chuyển nhượng, một người không thể "mua" SBT văn bằng của người khác.
- **Xác minh danh tính:** SBT gắn với địa chỉ ví, đóng vai trò như một chứng minh danh tính số trên Blockchain.
- **Tích lũy uy tín:** Theo thời gian, một "linh hồn" (ví) có thể tích lũy nhiều SBT (bằng đại học, chứng chỉ, giải thưởng), tạo thành một hồ sơ uy tín số phi tập trung.

[Chèn hình: Infographic so sánh trực quan NFT vs SBT — với icon minh họa tính chuyển nhượng vs không chuyển nhượng]

---

## Thách thức khi ứng dụng Blockchain trong lĩnh vực giáo dục

### 3.1. Rào cản về chi phí triển khai và đồng bộ hóa với hệ thống quản lý đào tạo hiện hành (Legacy Systems)

Việc triển khai hệ thống Blockchain trong giáo dục đòi hỏi đầu tư đáng kể về cả tài chính và nhân lực:

- **Chi phí Gas fee:** Mỗi giao dịch trên Ethereum Mainnet phải trả phí gas bằng ETH. Trong giai đoạn mạng lưới tắc nghẽn, chi phí này có thể lên tới hàng chục USD cho một giao dịch đơn lẻ. Với quy mô hàng nghìn văn bằng mỗi năm, tổng chi phí gas có thể trở thành gánh nặng tài chính cho cơ sở đào tạo.

- **Chi phí phát triển và bảo trì:** Phát triển smart contract đòi hỏi đội ngũ kỹ sư chuyên môn cao về Solidity, bảo mật Blockchain và kiến trúc hệ thống phi tập trung — nguồn nhân lực này còn rất khan hiếm tại Việt Nam.

- **Đồng bộ với Legacy Systems:** Các trường đại học hiện đang sử dụng nhiều hệ thống quản lý đào tạo khác nhau (LMS, hệ thống tín chỉ, phần mềm quản lý sinh viên). Việc tích hợp Blockchain vào hệ sinh thái hiện có đòi hỏi xây dựng các lớp trung gian (middleware/API bridge) phức tạp, đồng thời phải đảm bảo không gián đoạn quy trình vận hành hiện tại.

### 3.2. Nút thắt về sự đồng thuận và tham gia của toàn bộ hệ sinh thái (Cơ sở đào tạo, Sinh viên, Nhà tuyển dụng)

Hệ thống xác minh văn bằng Blockchain chỉ phát huy tối đa hiệu quả khi có sự tham gia đồng bộ của tất cả các bên liên quan:

- **Cơ sở đào tạo:** Cần cam kết chuyển đổi quy trình cấp bằng sang nền tảng số, đào tạo nhân sự và đầu tư hạ tầng công nghệ. Tuy nhiên, nhiều trường còn e ngại về tính pháp lý và rủi ro công nghệ.

- **Sinh viên:** Cần có ví điện tử (MetaMask), hiểu biết cơ bản về Blockchain và sẵn sàng thanh toán phí bằng cryptocurrency. Đây là rào cản lớn với đa số sinh viên chưa quen thuộc với công nghệ Web3.

- **Nhà tuyển dụng:** Cần chấp nhận và tin tưởng văn bằng số trên Blockchain. Nếu nhà tuyển dụng vẫn yêu cầu bằng giấy bản cứng, giá trị của hệ thống Blockchain sẽ bị hạn chế.

### 3.3. Thách thức về quy chuẩn ghi nhận dữ liệu văn bằng vật lý lên không gian số (Mã QR, IPFS, On-chain Metadata)

Quá trình chuyển đổi văn bằng từ vật lý sang số (digitization) đặt ra nhiều thách thức về tiêu chuẩn hóa:

- **Chuẩn hóa metadata:** Hiện chưa có một tiêu chuẩn thống nhất về định dạng metadata cho văn bằng số trên Blockchain. Mỗi hệ thống sử dụng schema riêng (EAS, Blockcerts, custom JSON), gây khó khăn cho việc tương tác liên hệ thống (interoperability).

- **Mã QR và nhận dạng:** Việc gắn mã QR chứa thông tin xác minh lên bằng giấy đòi hỏi quy trình in ấn bổ sung và tiêu chuẩn hóa kích thước, vị trí đặt mã QR. Đồng thời cần đảm bảo mã QR không bị hỏng, mờ theo thời gian.

- **Lưu trữ IPFS và tính bền vững:** IPFS là hệ thống lưu trữ phi tập trung dựa trên nội dung (content-addressable). Tuy nhiên, dữ liệu trên IPFS chỉ tồn tại khi có ít nhất một nút (node) "pin" nó. Nếu dịch vụ pinning (như Pinata) ngừng hoạt động hoặc không thanh toán phí, dữ liệu metadata có thể bị mất, dù URI vẫn còn trên Blockchain. Đây là thách thức về tính bền vững dài hạn của hệ thống.

- **Pháp lý và công nhận:** Tại Việt Nam, văn bằng số trên Blockchain chưa được công nhận chính thức bởi Bộ Giáo dục và Đào tạo. Cần có khung pháp lý rõ ràng để văn bằng SBT có giá trị pháp lý tương đương văn bằng giấy.

[Chèn hình: Sơ đồ minh họa thách thức "Digital Gap" — khoảng cách giữa văn bằng vật lý và văn bằng số, các yếu tố cần cầu nối: Mã QR, IPFS, On-chain data, Pháp lý]
# CHƯƠNG II. NGHIÊN CỨU KINH NGHIỆM THỰC TIỄN ÁP DỤNG BLOCKCHAIN TRONG QUẢN LÝ VĂN BẰNG TRÊN THẾ GIỚI

## 1. Lĩnh vực giáo dục đại học: Ứng dụng Blockchain trong cấp bằng số và xác minh học vị (Bài học từ MIT, University of Bahrain, Singapore)

### a) Massachusetts Institute of Technology (MIT) — Hoa Kỳ

MIT là một trong những trường đại học tiên phong trong việc cấp bằng số trên Blockchain. Từ năm 2017, MIT Media Lab đã phối hợp với Learning Machine phát triển nền tảng **Blockcerts** — một tiêu chuẩn mã nguồn mở cho phép phát hành và xác minh chứng chỉ số trên Blockchain Bitcoin.

**Mô hình hoạt động:**
- MIT sử dụng ứng dụng di động **Blockcerts Wallet** để cấp bằng số cho sinh viên tốt nghiệp.
- Mỗi văn bằng được biểu diễn dưới dạng JSON-LD, ký số bằng khóa riêng của MIT và ghi hash lên Blockchain Bitcoin.
- Sinh viên có thể chia sẻ bằng số với nhà tuyển dụng qua link hoặc file JSON, và bên thứ ba có thể xác minh tức thì mà không cần liên hệ MIT.

**Bài học kinh nghiệm:**
- Tách biệt dữ liệu nhạy cảm (chỉ lưu hash trên chain, dữ liệu chi tiết ngoài chain) giúp cân bằng giữa minh bạch và quyền riêng tư.
- Giao diện người dùng đơn giản, thân thiện là yếu tố quyết định mức độ chấp nhận của sinh viên.
- Sử dụng tiêu chuẩn mở (Blockcerts) giúp tăng tính tương tác giữa các hệ thống.

[Chèn hình: Giao diện ứng dụng Blockcerts Wallet của MIT — hiển thị bằng số trên điện thoại]

### b) University of Bahrain — Bahrain

University of Bahrain trở thành trường đại học đầu tiên trên thế giới cấp **toàn bộ** bằng tốt nghiệp trên Blockchain vào năm 2019. Trường hợp tác với công ty Bahrain FinTech Bay để triển khai hệ thống sử dụng nền tảng Ethereum.

**Đặc điểm nổi bật:**
- Toàn bộ sinh viên tốt nghiệp từ năm 2019 đều nhận được bằng số trên Blockchain song song với bằng giấy truyền thống.
- Nhà tuyển dụng có thể quét mã QR in trên bằng giấy để xác minh tức thì trên Blockchain.
- Hệ thống giúp giảm 95% thời gian xác minh bằng (từ 2 tuần xuống còn vài giây).

**Bài học kinh nghiệm:**
- Cấp song song bằng giấy và bằng số trong giai đoạn chuyển đổi giúp giảm sự kháng cự từ các bên liên quan.
- Mã QR là cầu nối hiệu quả giữa thế giới vật lý (bằng giấy) và thế giới số (Blockchain).
- Sự hỗ trợ chính sách từ chính phủ Bahrain là yếu tố then chốt giúp triển khai thành công.

### c) National University of Singapore (NUS) và các trường đại học Singapore

Singapore — một trong những quốc gia đi đầu về chuyển đổi số — đã triển khai hệ thống chứng chỉ số **OpenCerts** dựa trên Blockchain Ethereum từ năm 2019. Hệ thống được Bộ Giáo dục Singapore (MOE) và GovTech phối hợp phát triển, áp dụng cho 18 cơ sở giáo dục bao gồm NUS, NTU, SMU và các trường bách khoa.

**Mô hình OpenCerts:**
- Sử dụng Ethereum Mainnet để lưu hash của chứng chỉ.
- Mỗi chứng chỉ là một file `.opencert` (JSON) chứa đầy đủ thông tin và có thể xác minh offline.
- Trang web https://opencerts.io cho phép bất kỳ ai upload file `.opencert` để xác minh.

**Bài học kinh nghiệm:**
- Triển khai ở quy mô quốc gia đòi hỏi sự phối hợp giữa chính phủ, cơ sở đào tạo và đơn vị công nghệ.
- Định dạng file chuẩn hóa (`.opencert`) giúp đảm bảo tính tương tác giữa các trường.
- Tách biệt giữa lớp lưu trữ (Blockchain) và lớp hiển thị (Web) giúp hệ thống linh hoạt và dễ bảo trì.

---

## 2. Lĩnh vực chứng chỉ nghề nghiệp: Quản lý hồ sơ chứng chỉ, bằng cấp chuyên môn và chứng nhận kỹ năng số (Bài học từ IBM, Coursera)

### a) IBM Digital Credentials

IBM đã phát triển hệ thống **IBM Digital Credentials** sử dụng công nghệ Blockchain để cấp chứng chỉ cho các khóa đào tạo nội bộ và chương trình học trực tuyến. Hệ thống được xây dựng trên nền tảng Hyperledger Fabric.

**Đặc điểm:**
- Nhân viên và học viên IBM nhận chứng chỉ số sau khi hoàn thành khóa học, được ghi nhận trên Blockchain.
- Chứng chỉ có thể chia sẻ lên LinkedIn, cho phép nhà tuyển dụng xác minh trực tiếp.
- Sử dụng Private Blockchain (Hyperledger Fabric) để kiểm soát quyền truy cập và bảo mật thông tin nhân sự.

### b) Coursera và các nền tảng EdTech

Các nền tảng giáo dục trực tuyến như Coursera, edX đã bắt đầu tích hợp Blockchain để xác minh chứng chỉ hoàn thành khóa học. Coursera sử dụng dịch vụ của **Accredible** — một nền tảng chứng chỉ số hỗ trợ Blockchain verification.

**Xu hướng:**
- Chứng chỉ số có thể xác minh (verifiable credentials) đang trở thành tiêu chuẩn trong ngành giáo dục trực tuyến.
- Mô hình "học suốt đời" (lifelong learning) cần một hệ thống tích lũy chứng chỉ phi tập trung — chính là ứng dụng phù hợp nhất cho SBT.

---

## 3. Lĩnh vực y tế và pháp lý: Minh bạch hóa nguồn gốc bằng cấp hành nghề và đảm bảo tiêu chuẩn xác thực khắt khe

Trong lĩnh vực y tế, việc xác minh bằng cấp hành nghề của bác sĩ, dược sĩ, điều dưỡng là yêu cầu bắt buộc và vô cùng nghiêm ngặt. Một bác sĩ với bằng giả có thể gây ra hậu quả nghiêm trọng đến tính mạng bệnh nhân.

**Ứng dụng Blockchain trong xác minh bằng cấp y tế:**

- **ProCredEx (Hoa Kỳ):** Nền tảng Blockchain cho phép các bệnh viện và cơ sở y tế chia sẻ và xác minh thông tin chứng chỉ hành nghề của bác sĩ. Giảm thời gian xác minh từ 60-90 ngày xuống còn vài phút.

- **Hashed Health:** Sử dụng Blockchain để quản lý toàn bộ vòng đời chứng chỉ y tế — từ cấp phát, gia hạn đến thu hồi — tạo "nguồn sự thật duy nhất" cho thông tin bằng cấp hành nghề.

**Bài học cho hệ thống văn bằng:**
- Cơ chế thu hồi (revocation) là yêu cầu bắt buộc cho bất kỳ hệ thống chứng chỉ số nào. Hệ thống SoulboundDegreeV2 đã tích hợp tính năng này thông qua hàm `revoke()`.
- Metadata cần có cấu trúc chuẩn hóa để tương tác giữa các hệ thống khác nhau.

---

## 4. Nền tảng Blockchain giáo dục toàn cầu: Blockcerts, Ethereum Attestation Service (EAS), và mô hình Soulbound Token của Vitalik Buterin

### a) Blockcerts

**Blockcerts** là một bộ công cụ mã nguồn mở được phát triển bởi MIT Media Lab và Learning Machine (nay là Hyland Credentials). Blockcerts cung cấp:

- **Blockcerts Issuer:** Công cụ cho cơ sở đào tạo tạo và phát hành chứng chỉ số.
- **Blockcerts Verifier:** Trang web xác minh chứng chỉ công khai.
- **Blockcerts Wallet:** Ứng dụng di động cho người nhận quản lý chứng chỉ.

Blockcerts sử dụng tiêu chuẩn **W3C Verifiable Credentials** và hỗ trợ nhiều Blockchain: Bitcoin, Ethereum.

### b) Ethereum Attestation Service (EAS)

**EAS** là một giao thức trên Ethereum cho phép tạo các attestation (chứng thực) on-chain và off-chain. EAS cung cấp:

- **Schema Registry:** Đăng ký các cấu trúc dữ liệu chuẩn cho attestation.
- **Attestation:** Tạo chứng thực gắn với địa chỉ ví, có thể revocable.
- **Resolver:** Logic tùy chỉnh khi attestation được tạo hoặc thu hồi.

EAS phù hợp cho các ứng dụng chứng thực nhẹ (lightweight attestation) nhưng thiếu tính trực quan và khả năng tùy biến so với smart contract tự phát triển.

### c) Mô hình Soulbound Token (SBT) của Vitalik Buterin

Trong bài nghiên cứu **"Decentralized Society: Finding Web3's Soul"** (2022), Vitalik Buterin cùng E. Glen Weyl và Puja Ohlhaver đã đề xuất khái niệm **Decentralized Society (DeSoc)** — một xã hội phi tập trung nơi mà danh tính, uy tín và quan hệ xã hội được biểu diễn thông qua SBT.

**Các ý tưởng cốt lõi:**
- **Soul:** Một ví (account) đại diện cho một cá nhân hoặc tổ chức.
- **SBT:** Token không chuyển nhượng được phát hành bởi các Soul khác, đại diện cho bằng cấp, chứng chỉ, thành viên, v.v.
- **Community Recovery:** Cơ chế khôi phục SBT khi mất ví, dựa vào cộng đồng xung quanh.
- **Decentralized Society (DeSoc):** Một xã hội nơi SBT tạo nền tảng cho quản trị phi tập trung, chống sybil, và xây dựng danh tiếng.

**Ảnh hưởng đến đề tài:**

Hệ thống XacMinhVanBang được thiết kế theo đúng triết lý SBT của Vitalik Buterin:
- Văn bằng SBT gắn vĩnh viễn với ví sinh viên (soul).
- Chỉ cơ sở đào tạo (admin soul) mới có thể phát hành SBT văn bằng.
- Sinh viên phải tự xác nhận — thể hiện "sự đồng thuận" giữa hai soul.
- SBT tích lũy theo thời gian, tạo hồ sơ uy tín phi tập trung.

[Chèn hình: Sơ đồ mô hình Decentralized Society — các Soul liên kết qua SBT, minh họa với use case văn bằng đại học]

---

## 5. Bài học kinh nghiệm đúc kết cho các cơ sở giáo dục và nhà quản lý đào tạo tại Việt Nam

Từ việc phân tích các case study quốc tế, có thể rút ra những bài học quan trọng sau:

### Bài học 1: Bắt đầu với mô hình lai (Hybrid Model)

Kinh nghiệm từ University of Bahrain cho thấy việc cấp song song bằng giấy và bằng số trong giai đoạn đầu giúp giảm sự kháng cự và tạo thời gian cho các bên liên quan thích nghi. Mã QR in trên bằng giấy là cầu nối tự nhiên giữa hai thế giới.

### Bài học 2: Chuẩn hóa metadata là yếu tố sống còn

Kinh nghiệm từ OpenCerts (Singapore) và Blockcerts (MIT) cho thấy việc sử dụng tiêu chuẩn mở, chuẩn hóa định dạng metadata giúp đảm bảo tính tương tác giữa các hệ thống. Việt Nam cần xây dựng một schema chuẩn cho metadata văn bằng số ngay từ đầu.

### Bài học 3: Hỗ trợ chính sách là yếu tố then chốt

Thành công của OpenCerts tại Singapore phần lớn nhờ sự hỗ trợ trực tiếp từ Bộ Giáo dục và GovTech. Tại Việt Nam, cần vận động xây dựng khung pháp lý công nhận giá trị pháp lý của văn bằng số trên Blockchain.

### Bài học 4: Giao diện người dùng quyết định sự thành bại

Dù công nghệ Blockchain phía sau phức tạp đến đâu, người dùng cuối (sinh viên, nhà tuyển dụng) cần một giao diện đơn giản, trực quan. Kinh nghiệm từ MIT Blockcerts cho thấy ứng dụng di động thân thiện là yếu tố quyết định mức độ chấp nhận.

### Bài học 5: Soulbound Token là mô hình phù hợp nhất cho văn bằng

So với NFT truyền thống, EAS attestation hay Blockcerts, mô hình SBT cung cấp cơ chế chống chuyển nhượng tự nhiên nhất — phản ánh đúng bản chất của văn bằng tốt nghiệp. Đây là lý do hệ thống XacMinhVanBang chọn SBT làm nền tảng.

| Case Study | Blockchain | Mô hình | Bài học chính |
|---|---|---|---|
| MIT Blockcerts | Bitcoin | Mã nguồn mở, hash on-chain | Chuẩn mở, UX đơn giản |
| Univ. of Bahrain | Ethereum | Bằng giấy + QR + Blockchain | Hybrid model, QR bridge |
| OpenCerts (Singapore) | Ethereum | Quốc gia, `.opencert` file | Chính sách + chuẩn hóa |
| IBM Digital Credentials | Hyperledger | Private, nội bộ doanh nghiệp | Bảo mật + kiểm soát |
| EAS | Ethereum | Attestation protocol | Nhẹ, linh hoạt |
| **XacMinhVanBang** | **Ethereum** | **SBT + IPFS + 2-step flow** | **Chống chuyển nhượng + xác nhận 2 bước** |

[Chèn hình: Bảng timeline phát triển các giải pháp Blockchain trong giáo dục từ 2017 (MIT Blockcerts) đến 2026 (XacMinhVanBang SBT)]
# CHƯƠNG III. THIẾT KẾ VÀ TRIỂN KHAI HỆ THỐNG CẤP VÀ XÁC MINH VĂN BẰNG SỬ DỤNG SBT TẠI VIỆT NAM

## Thực trạng hệ thống quản lý văn bằng tại Việt Nam hiện nay

### 1.1. Đặc thù quy trình cấp bằng, lưu trữ hồ sơ và cơ sở hạ tầng công nghệ hiện hành

Tại Việt Nam, quy trình cấp và quản lý văn bằng tốt nghiệp hiện nay vẫn chủ yếu dựa trên phương thức truyền thống:

**Quy trình cấp bằng truyền thống:**

1. **Xét tốt nghiệp:** Phòng Đào tạo xét điều kiện tốt nghiệp dựa trên hệ thống quản lý đào tạo nội bộ.
2. **Trình duyệt:** Danh sách sinh viên đủ điều kiện được trình lãnh đạo nhà trường phê duyệt.
3. **In bằng:** Bằng tốt nghiệp được in trên phôi bằng do Bộ GD&ĐT quy định, với các yếu tố bảo mật cơ bản (hoa văn, con dấu nổi, chữ ký tươi).
4. **Phát bằng:** Sinh viên đến trường nhận bằng gốc (bản cứng), ký nhận vào sổ.
5. **Lưu trữ:** Hồ sơ cấp bằng được lưu trữ dưới dạng văn bản giấy và/hoặc file Excel tại Phòng Đào tạo.

**Cơ sở hạ tầng công nghệ:**

Hiện nay, phần lớn các trường đại học tại Việt Nam sử dụng phần mềm quản lý đào tạo nội bộ (như UniSoft, EduSoft, hoặc phần mềm tự phát triển) để quản lý hồ sơ sinh viên. Tuy nhiên, các hệ thống này thường:

- Hoạt động độc lập, không liên thông giữa các trường.
- Lưu trữ dữ liệu tập trung trên máy chủ nội bộ, phụ thuộc vào cơ sở hạ tầng CNTT của từng trường.
- Thiếu API mở để tích hợp với các hệ thống bên ngoài.
- Chưa áp dụng công nghệ Blockchain hay bất kỳ giải pháp phi tập trung nào.

### 1.2. Những khó khăn, bất cập: Rủi ro giả mạo văn bằng, xác minh thủ công tốn thời gian và rào cản chi phí trung gian

**a) Tình trạng giả mạo văn bằng:**

Nạn bằng giả tại Việt Nam diễn ra phức tạp với nhiều hình thức tinh vi:

- **Bằng giả hoàn toàn:** In phôi bằng giả với đầy đủ con dấu, chữ ký, số hiệu giả mạo. Với công nghệ in ấn hiện đại, bằng giả có thể đạt mức độ giống thật lên đến 90-95%.
- **Bằng thật nhưng kiến thức giả:** Mua bằng từ các đường dây "học hộ, thi hộ" hoặc các cơ sở đào tạo không đảm bảo chất lượng.
- **Sử dụng bằng của người khác:** Mạo danh, sử dụng bằng tốt nghiệp của người khác với hồ sơ cá nhân được sửa đổi.

**b) Xác minh thủ công:**

Quy trình xác minh văn bằng hiện tại đòi hỏi nhà tuyển dụng phải:

1. Gửi công văn đề nghị xác minh đến cơ sở đào tạo đã cấp bằng.
2. Chờ Phòng Đào tạo tra cứu hồ sơ lưu trữ (thường là sổ sách, file Excel).
3. Nhận phản hồi bằng công văn trả lời — thời gian trung bình từ 5 đến 15 ngày làm việc.
4. Đối với bằng cấp nước ngoài, thời gian xác minh có thể kéo dài hàng tháng.

Quy trình này tốn thời gian, chi phí và phụ thuộc vào sự hợp tác của cơ sở đào tạo. Trong nhiều trường hợp, cơ sở đào tạo đã giải thể hoặc không còn lưu trữ hồ sơ, khiến việc xác minh trở nên bất khả thi.

**c) Chi phí trung gian:**

Một số dịch vụ xác minh bằng cấp trực tuyến đã xuất hiện tại Việt Nam, nhưng chúng hoạt động như trung gian, thu phí xác minh và vẫn phụ thuộc vào dữ liệu tập trung của các trường. Mô hình này không giải quyết được vấn đề gốc rễ: thiếu một "nguồn sự thật duy nhất" (Single Source of Truth) độc lập và không thể thao túng.

### 1.3. Hướng giải quyết mang tính chiến lược: Đổi mới kiến trúc quản lý văn bằng từ tập trung sang phi tập trung

Để giải quyết triệt để các bất cập nêu trên, cần một sự chuyển đổi mang tính kiến trúc: từ hệ thống **tập trung** (centralized) — nơi mỗi trường tự quản lý dữ liệu bằng cấp — sang hệ thống **phi tập trung** (decentralized) — nơi dữ liệu văn bằng được ghi nhận trên Blockchain công khai, có thể xác minh bởi bất kỳ ai, bất kỳ lúc nào.

Hệ thống **XacMinhVanBang** được thiết kế theo hướng này, với các nguyên tắc cốt lõi:

- **Blockchain là nguồn sự thật duy nhất:** Tất cả văn bằng đều được ghi nhận trên Ethereum Blockchain dưới dạng Soulbound Token.
- **IPFS là kho lưu trữ phi tập trung:** Metadata và hình ảnh bằng được lưu trên IPFS, đảm bảo dữ liệu không phụ thuộc vào bất kỳ máy chủ nào.
- **Smart Contract là bộ quy tắc tự động:** Toàn bộ quy trình cấp bằng được mã hóa trong smart contract, loại bỏ can thiệp thủ công và giảm thiểu sai sót.
- **Giao diện web là cổng truy cập:** Người dùng tương tác với hệ thống thông qua giao diện web thân thiện, không cần kiến thức chuyên sâu về Blockchain.

---

## Thiết kế và triển khai hệ thống XacMinhVanBang

### 2.1. Kiến trúc tổng thể hệ thống (Frontend — Smart Contract — IPFS — Blockchain)

Hệ thống XacMinhVanBang được thiết kế theo kiến trúc **DApp (Decentralized Application)** 3 lớp:

[Chèn hình: Sơ đồ kiến trúc tổng thể hệ thống XacMinhVanBang — 3 lớp: Presentation Layer (Next.js), Business Logic Layer (Smart Contract trên Ethereum), Storage Layer (IPFS/Pinata)]

**Lớp 1 — Presentation Layer (Giao diện người dùng):**
- **Công nghệ:** Next.js 14 (React framework), CSS tùy chỉnh
- **Chức năng:** Cung cấp giao diện web cho 3 nhóm người dùng: Admin, Sinh viên, Người xác minh
- **Kết nối Blockchain:** Thông qua thư viện Ethers.js v6 và ví MetaMask
- **Triển khai:** Vercel (serverless deployment)

**Lớp 2 — Business Logic Layer (Hợp đồng thông minh):**
- **Công nghệ:** Solidity 0.8.22, OpenZeppelin Contracts v5
- **Chức năng:** Xử lý toàn bộ logic nghiệp vụ: tạo yêu cầu, xác nhận, mint SBT, thu phí, thu hồi
- **Triển khai:** Ethereum Sepolia Testnet
- **Công cụ phát triển:** Hardhat, Hardhat Ignition

**Lớp 3 — Storage Layer (Lưu trữ phi tập trung):**
- **Công nghệ:** IPFS (InterPlanetary File System), Pinata (IPFS pinning service)
- **Chức năng:** Lưu trữ metadata JSON và hình ảnh văn bằng
- **Truy cập:** Thông qua IPFS Gateway (gateway.pinata.cloud)

**Bảng công nghệ chi tiết:**

| Thành phần | Công nghệ | Phiên bản | Vai trò |
|---|---|---|---|
| Frontend Framework | Next.js | 14.x | Server-side rendering, routing |
| UI Library | React | 18.x | Component-based UI |
| Blockchain Library | Ethers.js | 6.x | Tương tác smart contract |
| Smart Contract | Solidity | 0.8.22 | Logic nghiệp vụ on-chain |
| Contract Framework | OpenZeppelin | 5.x | ERC-721, AccessControl |
| Development Tool | Hardhat | 2.x | Compile, test, deploy |
| Storage | IPFS/Pinata | — | Lưu trữ phi tập trung |
| Wallet | MetaMask | — | Ký giao dịch, quản lý ví |
| Blockchain Network | Ethereum Sepolia | — | Testnet triển khai |
| Hosting | Vercel | — | Frontend deployment |
| QR Code | html5-qrcode | — | Tạo/quét mã QR |

### 2.2. Thiết kế Smart Contract SoulboundDegreeV2 (State Machine, AccessControl, Request Flow)

Smart contract **SoulboundDegreeV2** là trái tim của hệ thống, kế thừa từ các contract chuẩn của OpenZeppelin:

```
SoulboundDegreeV2
├── ERC721 (Token chuẩn NFT)
├── ERC721URIStorage (Lưu metadata URI)
├── ERC721Enumerable (Liệt kê token theo owner)
└── AccessControl (Phân quyền)
```

**Cấu trúc dữ liệu DegreeRequest:**

```solidity
struct DegreeRequest {
    address student;        // Địa chỉ ví sinh viên
    string metadataURI;     // URI metadata trên IPFS
    uint256 createdAt;      // Thời điểm tạo yêu cầu
    uint256 expiresAt;      // Thời hạn (30 ngày)
    RequestStatus status;   // Trạng thái yêu cầu
    uint256 tokenId;        // Token ID sau khi mint
    string rejectionReason; // Lý do từ chối (nếu có)
}
```

**Enum RequestStatus:**

```solidity
enum RequestStatus {
    PENDING,    // 0 - Đang chờ sinh viên xác nhận
    CONFIRMED,  // 1 - Đã xác nhận & mint SBT
    EXPIRED,    // 2 - Hết hạn (quá 30 ngày)
    REJECTED,   // 3 - Sinh viên từ chối
    CANCELLED   // 4 - Admin hủy yêu cầu
}
```

[Chèn hình: Sơ đồ State Machine đầy đủ của DegreeRequest — PENDING ở trung tâm, các mũi tên chỉ đến CONFIRMED, REJECTED, EXPIRED, CANCELLED với điều kiện chuyển đổi]

**Các hàm chính của smart contract:**

| Hàm | Quyền | Mô tả |
|---|---|---|
| `createRequest(student, uri)` | MINTER_ROLE | Tạo yêu cầu cấp bằng mới |
| `createBatchRequests(students[], uris[])` | MINTER_ROLE | Tạo hàng loạt yêu cầu |
| `confirmAndMint(requestId)` | Sinh viên | Xác nhận & thanh toán 0.3 ETH → mint SBT |
| `rejectRequest(requestId, reason)` | Sinh viên | Từ chối yêu cầu với lý do |
| `cancelRequest(requestId)` | MINTER_ROLE | Admin hủy yêu cầu |
| `cleanExpired(requestId)` | Bất kỳ ai | Đánh dấu yêu cầu hết hạn |
| `revoke(tokenId)` | MINTER_ROLE | Thu hồi bằng đã cấp |
| `getStats()` | Bất kỳ ai | Xem thống kê tổng quan |
| `getStudentRequests(student)` | Bất kỳ ai | Xem danh sách yêu cầu của sinh viên |
| `getPendingRequests(student)` | Bất kỳ ai | Xem yêu cầu đang chờ |

**Cơ chế Soulbound (chống chuyển nhượng):**

Tính năng cốt lõi của SBT được thực thi bằng cách override hàm `_update()` của ERC721:

```solidity
function _update(address to, uint256 tokenId, address auth)
    internal override(ERC721, ERC721Enumerable)
    returns (address)
{
    address from = _ownerOf(tokenId);
    // Chỉ cho phép mint (from=0) và burn (to=0)
    // Chặn mọi transfer giữa 2 ví
    if (from != address(0) && to != address(0)) {
        revert SBTTransferNotAllowed();
    }
    return super._update(to, tokenId, auth);
}
```

**Cơ chế thu phí:**

Khi sinh viên gọi `confirmAndMint()`, smart contract yêu cầu gửi kèm chính xác 0.3 ETH (`MINT_FEE = 0.3 ether`). Số tiền này được chuyển tự động vào địa chỉ `treasury` thông qua lệnh `payable`. Cơ chế này đảm bảo:

- Nguồn thu minh bạch, mọi giao dịch phí đều được ghi nhận on-chain.
- Không có trung gian giữ tiền — phí được chuyển trực tiếp trong cùng giao dịch mint.
- Có thể audit (kiểm toán) bất kỳ lúc nào bằng cách truy vấn Blockchain.

### 2.3. Thiết kế lưu trữ phi tập trung trên IPFS (Pinata) — Metadata Schema

**IPFS (InterPlanetary File System)** là hệ thống lưu trữ phi tập trung dựa trên nội dung (content-addressable). Thay vì truy cập file qua đường dẫn (location-based), IPFS sử dụng **Content Identifier (CID)** — mã băm duy nhất được tính từ nội dung file — để định danh và truy xuất dữ liệu.

**Quy trình lưu trữ metadata văn bằng:**

1. Admin nhập thông tin sinh viên và upload ảnh bằng → Frontend upload ảnh lên Pinata → nhận CID ảnh.
2. Frontend tạo JSON metadata chứa thông tin bằng + CID ảnh → upload JSON lên Pinata → nhận CID metadata.
3. CID metadata được truyền vào hàm `createRequest()` dưới dạng `ipfs://CID` → được ghi vĩnh viễn trên Blockchain.

**Cấu trúc Metadata JSON:**

```json
{
  "name": "Nguyễn Văn A",
  "description": "Văn bằng tốt nghiệp Đại học — Hệ thống cấp bằng SBT",
  "image": "ipfs://QmXxx...yyy",
  "attributes": {
    "studentId": "20110001",
    "major": "Công nghệ thông tin",
    "year": "2025",
    "classification": "gioi",
    "issueDate": "2025-06-15T00:00:00Z"
  }
}
```

**Ưu điểm của IPFS trong hệ thống:**

- **Content-addressable:** Cùng một nội dung luôn cho ra cùng CID → đảm bảo tính toàn vẹn.
- **Phi tập trung:** Dữ liệu được phân tán trên nhiều node, không phụ thuộc máy chủ trung tâm.
- **Bất biến:** Thay đổi nội dung file sẽ tạo ra CID mới → phát hiện ngay giả mạo.
- **Pinata pinning:** Dịch vụ Pinata đảm bảo dữ liệu luôn sẵn sàng bằng cách "pin" trên mạng IPFS.

[Chèn hình: Sơ đồ luồng upload metadata lên IPFS — từ form nhập liệu → upload ảnh → tạo JSON → upload JSON → ghi URI lên Blockchain]

### 2.4. Thiết kế giao diện người dùng (Admin, Student, Verify, Landing Page)

Hệ thống XacMinhVanBang cung cấp 4 trang giao diện chính:

**a) Trang chủ (Landing Page — `/`):**
- Giới thiệu tổng quan về hệ thống
- Thống kê real-time từ Blockchain (tổng bằng đã cấp, tổng phí thu)
- Các nút điều hướng đến các chức năng chính
- Hiệu ứng gradient animation, glassmorphism

[Chèn hình: Screenshot trang chủ XacMinhVanBang — giao diện dark mode với gradient, thống kê blockchain]

**b) Trang quản trị (Admin — `/admin`):**
- Yêu cầu kết nối ví MetaMask với quyền MINTER_ROLE
- Tab "Tạo yêu cầu": Form nhập thông tin sinh viên, upload ảnh bằng, tạo yêu cầu cấp bằng
- Tab "Tạo hàng loạt": Upload file CSV chứa danh sách sinh viên, tạo batch request
- Tab "Quản lý": Dashboard thống kê, danh sách tất cả yêu cầu với status badge, nút hủy/thu hồi

[Chèn hình: Screenshot trang Admin — tab tạo yêu cầu với form nhập liệu và preview metadata]

**c) Trang sinh viên (Student — `/student`):**
- Kết nối ví MetaMask để xem bằng của mình
- Hiển thị danh sách yêu cầu đang chờ xác nhận (PENDING) với countdown timer
- Nút "Xác nhận & Thanh toán 0.3 ETH" — gọi `confirmAndMint()` kèm thanh toán
- Nút "Từ chối" — gọi `rejectRequest()` với lý do
- Hiển thị danh sách bằng đã nhận (SBT) dưới dạng DegreeCard với mã QR

[Chèn hình: Screenshot trang Student — hiển thị pending request với countdown và nút xác nhận]

**d) Trang xác minh (Verify — `/verify`):**
- Tìm kiếm theo địa chỉ ví hoặc Token ID
- Quét mã QR từ camera thiết bị
- Hiển thị kết quả xác minh: thông tin bằng, xếp loại, ngày cấp, link Etherscan
- Banner xác thực: "BẰNG CHÍNH QUY — ĐÃ ĐƯỢC XÁC THỰC" (xanh) hoặc "KHÔNG TÌM THẤY" (đỏ)

[Chèn hình: Screenshot trang Verify — kết quả xác minh thành công với DegreeCard và badge xác thực]

### 2.5. Quy trình hoạt động: Admin tạo yêu cầu → Sinh viên xác nhận & thanh toán → Mint SBT → Xác minh QR

**Quy trình cấp bằng 2 bước (Two-Step Minting Process):**

[Chèn hình: Sơ đồ tuần tự (Sequence Diagram) đầy đủ quy trình cấp bằng — Admin, Frontend, Smart Contract, IPFS, Student, Verifier]

**Bước 1 — Admin tạo yêu cầu:**

1. Admin kết nối ví MetaMask (có MINTER_ROLE) tại trang `/admin`.
2. Admin nhập thông tin sinh viên: họ tên, MSSV, ngành, khóa, xếp loại, địa chỉ ví, ảnh bằng.
3. Frontend upload ảnh bằng lên IPFS/Pinata → nhận CID ảnh.
4. Frontend tạo JSON metadata → upload lên IPFS/Pinata → nhận CID metadata.
5. Frontend gọi `contract.createRequest(studentWallet, ipfs://CID)`.
6. Smart contract tạo DegreeRequest với status = PENDING, expiresAt = now + 30 ngày.
7. Event `RequestCreated` được emit → giao dịch được ghi lên Blockchain.

**Bước 2 — Sinh viên xác nhận & thanh toán:**

1. Sinh viên kết nối ví MetaMask tại trang `/student`.
2. Hệ thống hiển thị danh sách yêu cầu PENDING gắn với ví sinh viên.
3. Sinh viên xem thông tin bằng (tên, ngành, xếp loại) từ IPFS metadata.
4. Sinh viên nhấn "Xác nhận & Thanh toán 0.3 ETH".
5. MetaMask hiển thị popup xác nhận giao dịch với giá trị 0.3 ETH.
6. Sinh viên ký giao dịch → Frontend gọi `contract.confirmAndMint(requestId, {value: 0.3 ETH})`.
7. Smart contract kiểm tra: (a) msg.sender == student, (b) status == PENDING, (c) chưa hết hạn, (d) msg.value == 0.3 ETH.
8. Smart contract mint SBT → gắn tokenURI → chuyển 0.3 ETH vào treasury → update status = CONFIRMED.
9. Event `RequestConfirmed` được emit → SBT xuất hiện trong ví sinh viên.

**Bước 3 — Xác minh văn bằng:**

1. Bất kỳ ai truy cập trang `/verify`.
2. Nhập địa chỉ ví sinh viên hoặc Token ID, hoặc quét mã QR.
3. Frontend truy vấn smart contract qua read-only provider (Alchemy RPC).
4. Smart contract trả về tokenURI → Frontend fetch metadata từ IPFS.
5. Hiển thị thông tin văn bằng + badge xác thực + link Etherscan.

### 2.6. Kết quả kiểm thử và Demo hệ thống

**a) Kiểm thử tự động (Automated Testing):**

Hệ thống sử dụng **Hardhat** để viết và chạy bộ kiểm thử tự động cho smart contract. Tổng cộng **45 test cases** bao phủ toàn bộ chức năng:

| Nhóm test | Số lượng | Kết quả |
|---|---|---|
| Deployment & Initialization | 5 | ✅ Pass |
| Create Request | 8 | ✅ Pass |
| Confirm & Mint | 10 | ✅ Pass |
| Reject Request | 5 | ✅ Pass |
| Cancel Request | 4 | ✅ Pass |
| Expire & Clean | 4 | ✅ Pass |
| Soulbound (Anti-transfer) | 3 | ✅ Pass |
| Revoke | 3 | ✅ Pass |
| View Functions & Stats | 3 | ✅ Pass |
| **Tổng** | **45** | **✅ All Pass** |

[Chèn hình: Screenshot kết quả chạy test — terminal hiển thị "45 passing" với thời gian chạy]

**b) Demo trên Sepolia Testnet:**

Hệ thống đã được triển khai và demo thành công trên Ethereum Sepolia Testnet:

- **Contract Address:** Được deploy tại địa chỉ cụ thể trên Sepolia.
- **Frontend:** Triển khai trên Vercel, truy cập qua URL công khai.
- **Giao dịch mẫu:** Đã thực hiện thành công các thao tác: tạo yêu cầu, xác nhận & mint, xác minh, thu hồi.

[Chèn hình: Screenshot giao dịch mint SBT thành công trên Etherscan Sepolia — hiển thị From, To, Token ID, Gas Used]

[Chèn hình: Screenshot mã QR văn bằng và kết quả xác minh thành công trên trang Verify]

---

## Đề xuất thúc đẩy ứng dụng Blockchain trong quản lý văn bằng tại Việt Nam

### 3.1. Thiết lập kiến trúc mạng lưới liên minh (Consortium Blockchain) cho các cụm trường đại học/hiệp hội giáo dục

Để triển khai hệ thống xác minh văn bằng Blockchain ở quy mô quốc gia, mô hình **Consortium Blockchain** là lựa chọn phù hợp nhất:

- **Thành viên mạng lưới:** Các trường đại học, cao đẳng được Bộ GD&ĐT công nhận sẽ đóng vai trò là các node validators.
- **Quản trị:** Một ban quản trị gồm đại diện Bộ GD&ĐT, các hiệp hội giáo dục và chuyên gia công nghệ sẽ quản lý network.
- **Quyền cấp bằng:** Mỗi trường được cấp MINTER_ROLE riêng, chỉ có thể tạo yêu cầu cấp bằng cho sinh viên của trường mình.
- **Xác minh công khai:** Bất kỳ ai (nhà tuyển dụng, tổ chức) đều có thể xác minh văn bằng mà không cần quyền đặc biệt.

### 3.2. Tích hợp sâu rộng Blockchain với hệ thống quản lý đào tạo (LMS) và Cổng thông tin sinh viên để tự động hóa cấp bằng

Đề xuất xây dựng **middleware/API bridge** kết nối hệ thống quản lý đào tạo hiện có của các trường với smart contract:

- **Tự động tạo yêu cầu:** Khi sinh viên đủ điều kiện tốt nghiệp trên hệ thống LMS → middleware tự động gọi `createRequest()` trên smart contract.
- **Thông báo tự động:** Sinh viên nhận email/SMS thông báo có yêu cầu cấp bằng → truy cập trang student để xác nhận.
- **Đồng bộ dữ liệu:** Metadata văn bằng được tạo tự động từ dữ liệu trên hệ thống LMS, giảm thiểu nhập liệu thủ công.

### 3.3. Ứng dụng Trí tuệ nhân tạo (AI) kết hợp dữ liệu chuỗi khối để phát hiện gian lận và cảnh báo văn bằng giả

AI có thể được tích hợp để tăng cường khả năng bảo mật:

- **Phát hiện anomaly:** Thuật toán ML phân tích các pattern giao dịch bất thường (cấp bằng hàng loạt trong thời gian ngắn, cùng metadata cho nhiều sinh viên, v.v.).
- **OCR và so sánh:** Sử dụng Computer Vision để so sánh bằng giấy với metadata trên Blockchain, phát hiện bằng giả vật lý.
- **Knowledge Graph:** Xây dựng đồ thị quan hệ giữa các trường, ngành học, thời gian cấp bằng để phát hiện các pattern đáng ngờ.

### 3.4. Thí điểm mô hình Token hóa văn bằng (Soulbound Token) để chứng thực quyền sở hữu cho các bằng cấp có giá trị cao

Đề xuất **thí điểm** hệ thống SBT tại một số trường đại học lớn trước khi nhân rộng:

- **Giai đoạn 1 (1-2 năm):** Thí điểm tại 3-5 trường đại học top, cấp song song bằng giấy và SBT.
- **Giai đoạn 2 (2-3 năm):** Mở rộng ra 20-30 trường, hoàn thiện quy trình và pháp lý.
- **Giai đoạn 3 (3-5 năm):** Áp dụng toàn quốc, SBT trở thành tiêu chuẩn bắt buộc.

### 3.5. Xây dựng tiêu chuẩn chung về định dạng dữ liệu văn bằng số (Mã QR, IPFS URI, On-chain Metadata) và đào tạo nguồn nhân lực số

**a) Tiêu chuẩn dữ liệu:**

Đề xuất Bộ GD&ĐT ban hành tiêu chuẩn quốc gia cho metadata văn bằng số, bao gồm:

- **Schema JSON chuẩn:** Định nghĩa các trường bắt buộc (tên, MSSV, ngành, xếp loại, ngày cấp, trường cấp) và trường tùy chọn.
- **Chuẩn mã QR:** Quy định nội dung mã QR (URL xác minh + Token ID), kích thước, vị trí in trên bằng giấy.
- **Chuẩn IPFS URI:** Quy định format URI (`ipfs://CID`), dịch vụ pinning tối thiểu, thời gian lưu trữ.

**b) Đào tạo nguồn nhân lực:**

- Đưa Blockchain vào chương trình giảng dạy CNTT tại các trường đại học.
- Tổ chức workshop, bootcamp về phát triển DApp và Smart Contract.
- Xây dựng đội ngũ kỹ thuật chuyên trách Blockchain tại các trường đại học lớn.
- Hợp tác với doanh nghiệp công nghệ (FPT, Viettel, v.v.) để đào tạo và chuyển giao công nghệ.

[Chèn hình: Roadmap 5 năm triển khai hệ thống SBT văn bằng tại Việt Nam — từ thí điểm đến áp dụng toàn quốc]
# KẾT LUẬN

## 1. Kết quả đạt được

Sau quá trình nghiên cứu và triển khai, đề tài **"Hệ thống cấp và xác minh văn bằng tốt nghiệp sử dụng Soulbound Token (SBT) trên Ethereum Blockchain"** đã đạt được những kết quả sau:

**Về mặt lý luận:**

- Hệ thống hóa các kiến thức nền tảng về công nghệ Blockchain, hàm băm mật mã, hợp đồng thông minh và tiêu chuẩn token ERC-721 trên Ethereum.
- Phân tích và so sánh Soulbound Token (SBT) với NFT truyền thống, chứng minh SBT là mô hình phù hợp nhất cho việc token hóa văn bằng tốt nghiệp nhờ tính chất không thể chuyển nhượng.
- Nghiên cứu các case study quốc tế (MIT Blockcerts, University of Bahrain, OpenCerts Singapore, EAS) và rút ra bài học kinh nghiệm áp dụng cho Việt Nam.
- Phân tích thực trạng quản lý văn bằng tại Việt Nam, nhận diện các bất cập về giả mạo, xác minh thủ công và thiếu "nguồn sự thật duy nhất".

**Về mặt thực tiễn:**

- Thiết kế và triển khai thành công smart contract **SoulboundDegreeV2** trên Ethereum Sepolia Testnet với đầy đủ chức năng: tạo yêu cầu, xác nhận 2 bước, thu phí tự động, thu hồi, quản lý trạng thái.
- Xây dựng ứng dụng web hoàn chỉnh với 4 trang chức năng: Landing Page, Admin, Student, Verify — đáp ứng nhu cầu của cả 3 nhóm người dùng.
- Tích hợp thành công IPFS/Pinata để lưu trữ metadata và hình ảnh văn bằng phi tập trung.
- Triển khai chức năng xác minh đa phương thức: theo địa chỉ ví, Token ID và quét mã QR.
- Đạt **45/45 test cases** pass trong bộ kiểm thử tự động, bao phủ toàn bộ logic nghiệp vụ của smart contract.
- Deploy thành công frontend lên Vercel, tạo bản demo công khai có thể truy cập từ bất kỳ đâu.

**Về mặt đóng góp:**

- Đề xuất quy trình cấp bằng 2 bước (two-step minting) — một cải tiến so với các hệ thống hiện có — cho phép sinh viên tự xác nhận thông tin trước khi bằng được mint, tăng tính chính xác và đồng thuận.
- Đề xuất roadmap 5 năm triển khai hệ thống SBT văn bằng tại Việt Nam, từ thí điểm đến áp dụng toàn quốc.

## 2. Hạn chế

Bên cạnh những kết quả đạt được, đề tài vẫn còn một số hạn chế:

- Hệ thống mới được triển khai trên **Sepolia Testnet**, chưa triển khai trên Ethereum Mainnet. Chi phí gas trên Mainnet có thể là rào cản khi áp dụng thực tế.
- Giao diện người dùng đòi hỏi phải cài đặt ví **MetaMask** — một rào cản đối với người dùng chưa quen thuộc với Web3.
- Hệ thống chưa tích hợp với các hệ thống quản lý đào tạo (LMS) hiện có của các trường đại học.
- Dữ liệu trên IPFS phụ thuộc vào dịch vụ pinning (Pinata). Nếu dịch vụ ngừng hoạt động, metadata có thể bị mất dù URI vẫn còn trên Blockchain.
- Chưa có khung pháp lý chính thức tại Việt Nam công nhận giá trị pháp lý của văn bằng số trên Blockchain.

## 3. Hướng phát triển

Để hoàn thiện và mở rộng hệ thống, nhóm đề xuất các hướng phát triển tiếp theo:

- **Triển khai trên Layer 2:** Sử dụng các giải pháp Layer 2 như Polygon, Arbitrum hoặc Base để giảm chi phí gas đáng kể, phù hợp cho triển khai quy mô lớn.
- **Xây dựng ứng dụng di động:** Phát triển app iOS/Android cho phép sinh viên quản lý SBT, nhà tuyển dụng quét QR xác minh nhanh chóng.
- **Tích hợp Wallet Abstraction:** Sử dụng Account Abstraction (ERC-4337) để loại bỏ yêu cầu cài đặt MetaMask, cho phép đăng nhập bằng email/Google như ứng dụng Web2 thông thường.
- **Multi-chain deployment:** Triển khai smart contract trên nhiều Blockchain (Ethereum, Polygon, BNB Chain) để tăng khả năng tiếp cận.
- **Tích hợp AI:** Áp dụng Machine Learning để phát hiện anomaly trong giao dịch cấp bằng, cảnh báo gian lận tự động.
- **Xây dựng Consortium Network:** Thiết lập mạng lưới Blockchain liên minh cho các trường đại học Việt Nam, với sự phối hợp của Bộ GD&ĐT.
- **Arweave/Filecoin storage:** Sử dụng các giải pháp lưu trữ vĩnh viễn thay cho IPFS pinning, đảm bảo metadata tồn tại mãi mãi.

---

# TÀI LIỆU THAM KHẢO

## Tài liệu tiếng Việt

[1] Bộ Giáo dục và Đào tạo (2019), *Thông tư số 21/2019/TT-BGDĐT ban hành Quy chế quản lý bằng tốt nghiệp trung học cơ sở, bằng tốt nghiệp trung học phổ thông, văn bằng giáo dục đại học và chứng chỉ của hệ thống giáo dục quốc dân*, Hà Nội.

[2] Quốc hội nước CHXHCN Việt Nam (2018), *Luật Giáo dục Đại học sửa đổi, bổ sung (Luật số 34/2018/QH14)*, Hà Nội.

[3] Nguyễn Thị Hương và cộng sự (2021), "Ứng dụng công nghệ Blockchain trong quản lý chứng chỉ số tại Việt Nam — Cơ hội và thách thức", *Tạp chí Khoa học và Công nghệ*, số 45, tr. 67-78.

## Tài liệu tiếng Anh

[4] Buterin, V., Weyl, E.G., & Ohlhaver, P. (2022), "Decentralized Society: Finding Web3's Soul", *SSRN Electronic Journal*, Available at: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4105763.

[5] Nakamoto, S. (2008), "Bitcoin: A Peer-to-Peer Electronic Cash System", Available at: https://bitcoin.org/bitcoin.pdf.

[6] Buterin, V. (2014), "A Next-Generation Smart Contract and Decentralized Application Platform", *Ethereum Whitepaper*, Available at: https://ethereum.org/whitepaper.

[7] Grech, A. & Camilleri, A.F. (2017), *Blockchain in Education*, JRC Science for Policy Report, European Commission.

[8] Turkanović, M., Hölbl, M., Košič, K., Heričko, M. & Kamišalić, A. (2018), "EduCTX: A Blockchain-Based Higher Education Credit Platform", *IEEE Access*, vol. 6, pp. 5112-5127.

[9] MIT Media Lab & Learning Machine (2017), "Blockcerts: The Open Standard for Blockchain Credentials", Available at: https://www.blockcerts.org/.

[10] OpenZeppelin (2024), *OpenZeppelin Contracts v5.0 Documentation*, Available at: https://docs.openzeppelin.com/contracts/5.x/.

[11] Ethereum Foundation (2024), *Solidity Documentation v0.8.22*, Available at: https://docs.soliditylang.org/.

[12] Hardhat Development Environment (2024), *Hardhat Documentation*, Available at: https://hardhat.org/docs.

[13] Protocol Labs (2024), *IPFS Documentation*, Available at: https://docs.ipfs.tech/.

[14] Pinata (2024), *Pinata API Documentation*, Available at: https://docs.pinata.cloud/.

[15] Next.js by Vercel (2024), *Next.js Documentation*, Available at: https://nextjs.org/docs.

[16] Ethers.js (2024), *Ethers.js v6 Documentation*, Available at: https://docs.ethers.org/v6/.

[17] Sharples, M. & Domingue, J. (2016), "The Blockchain and Kudos: A Distributed System for Educational Record, Reputation and Reward", *Adaptive and Adaptable Learning*, Springer, pp. 490-496.

[18] Arenas, R. & Fernandez, P. (2018), "CredenceLedger: A Permissioned Blockchain for Verifiable Academic Credentials", *2018 IEEE International Conference on Engineering, Technology and Innovation*, pp. 1-6.

[19] GovTech Singapore (2019), "OpenCerts — An Easy Way to Check and Verify Your Certificates", Available at: https://opencerts.io/.

[20] Ethereum Attestation Service (2023), "EAS Documentation", Available at: https://attest.sh/docs.
