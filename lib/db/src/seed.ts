import { db, coursesTable, modulesTable, lessonsTable, challengesTable } from "./index.js";
import { sql } from "drizzle-orm";

async function runSeed() {
  console.log("🌱 Bắt đầu tạo dữ liệu với nội dung siêu chi tiết...");

  try {
    // Xóa dữ liệu cũ (theo thứ tự FK)
    await db.delete(challengesTable);
    await db.delete(lessonsTable);
    await db.delete(modulesTable);
    await db.delete(coursesTable);
    console.log("🧹 Đã xóa dữ liệu cũ");

    // =============================================
    // KHÓA HỌC 1: Git Cơ Bản
    // =============================================
    const [course1] = await db.insert(coursesTable).values({
      title: "Git Cơ Bản - Từ Zero Đến Hero",
      description: "Học quản lý phiên bản từ con số 0 với các bài thực hành tương tác trên Terminal ảo. Phù hợp tuyệt đối cho người mới bắt đầu.",
      level: "beginner",
      imageUrl: "https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png",
      order: 1,
    }).returning();
    console.log(`✅ Tạo khóa học: ${course1.title}`);

    // Module 1.1: Giới thiệu Git
    const [mod1_1] = await db.insert(modulesTable).values({
      courseId: course1.id,
      title: "Giới thiệu về Git",
      order: 1,
    }).returning();

    const [lesson1_1_1, lesson1_1_2, lesson1_1_3] = await db.insert(lessonsTable).values([
      {
        moduleId: mod1_1.id,
        title: "Git là gì? Tại sao cần dùng?",
        videoUrl: "https://www.youtube.com/watch?v=0fKg7e37bQE",
        content: `# 🚀 Chào mừng bạn đến với thế giới của Git!

Bạn có bao giờ làm đồ án hoặc viết báo cáo mà cách quản lý file của bạn trông giống như thế này không:
- 📄 \`Tai_lieu_chuan.docx\`
- 📄 \`Tai_lieu_chuan_final.docx\`
- 📄 \`Tai_lieu_chuan_final_that_su_roi.docx\`
- 📄 \`Tai_lieu_chuan_final_cua_final_nua_la_chet.docx\`

Chắc chắn là có đúng không? Quản lý file theo kiểu này thực sự là một **cơn ác mộng** khi bạn làm lập trình. Bạn sẽ loạn vì không biết file nào mới nhất, ai là người sửa nó vào đêm hôm qua, và lỡ ấn "Xóa" một đoạn code quan trọng thì coi như "khóc thét"! 😭

Đó là lúc **Git** xuất hiện như một vị cứu tinh!

## 🤖 Git thực chất là gì?

**Git** là một **Hệ thống quản lý phiên bản phân tán** (Distributed Version Control System - DVCS). Nghe có vẻ phức tạp, nhưng cứ tưởng tượng Git giống như một **"cỗ máy thời gian"** kết hợp với **"camera an ninh"** cho code của bạn.

Mỗi khi bạn làm xong một chức năng, bạn có thể lưu nó lại thành một cột mốc (phiên bản). Git sẽ chụp một "bức ảnh" (snapshot) cục code của bạn tại thời điểm đó và cất đi.

## 🌟 4 Lý Do Lập Trình Viên KHÔNG THỂ Sống Thiếu Git

1. **🕵️ Theo dõi lịch sử y như Camera an ninh:** 
   Giống như một cuốn nhật ký vô cùng chi tiết, Git ghi lại MỌI SỰ THAY ĐỔI dù là nhỏ nhất (thêm một dấu phẩy, sửa một chữ). Nếu phần mềm lỗi, bạn có thể tra ngay: Ai là người viết ra dòng code lỗi đó? Viết lúc mấy giờ? Và tại sao lại viết vậy?
   
2. **🤝 Làm việc nhóm không 'đấm nhau' (Teamwork vô đối):** 
   Hãy tưởng tượng 10 người cùng gõ code vào một file. Cơn ác mộng đúng không? Nhưng với Git, nó cho phép 10 người copy file ra làm việc độc lập. Khi xong việc, Git tự động "gộp" (merge) siêu thông minh các thay đổi lại với nhau mà không xóa hay đè lên nỗ lực thay đổi của bất kì ai.

3. **🌱 Phân nhánh (Branching) cực kỳ linh hoạt:** 
   Ví dụ bạn đang code tính năng *Giỏ Hàng*, thì sếp gọi: "E ơi lỗi *Thanh Toán*, sửa khẩn cấp!". Với Git, bạn chỉ cần tạo một "nhánh" sao chép toàn bộ dự án, sửa lỗi bên nhánh mới, mà không hề làm hỏng vỡ cái phần *Giỏ Hàng* bạn đang code dở. Sửa lỗi xong thì quay lại viết tiếp như chưa từng có chuyện gì xảy ra!

4. **🔒 Trạm Backup Cứu Hộ Máy Tính An Toàn Nhất:** 
   Nghĩ đến cảnh máy tính bạn lỡ bị vào nước hay bị con chó cắn hư ổ cứng. Mất sạch code? Không hề! Code của bạn được đồng bộ liên tục lên máy chủ (như GitHub - ta sẽ học sau độ). Lấy ngay một máy khác về, gõ 1 lệnh là toàn bộ code lại y nguyên ở đó.

> **💡 Tóm lại:** Git không chỉ là một công cụ, nó là "hơi thở và phép văn minh" của một lập trình viên hiện đại. Bạn bắt buộc phải giỏi Git nếu muốn vào nghề.

Chắc hẳn bạn đang rất hào hứng rồi đúng không? Hãy bấm nút **Tiếp tục** để đến với bài thiết lập cỗ máy thời gian này nhé! 👉`,
        hasPractice: "false",
        order: 1,
      },
      {
        moduleId: mod1_1.id,
        title: "Cài đặt và cấu hình Git",
        videoUrl: "https://www.youtube.com/watch?v=0fKg7e37bQE",
        content: `# 🛠️ Cài đặt và cấu hình Git

Sau khi hiểu được sức mạnh to lớn của Git ở bài trước, giờ là lúc chúng ta cài đặt và cấu hình nó cho máy tính của bạn.

## 1. Cài đặt Git trên các hệ điều hành

| Hệ Điều Hành | Cách Cài Đặt |
| :--- | :--- |
| **Windows** | Tải file cài từ [trang chủ Git](https://git-scm.com/download/win), và cứ bấm \`Next\` liên tục là xong. Rất đơn giản! |
| **macOS** | Nếu bạn đã cài Homebrew, mở Terminal gõ: \`brew install git\`. Hoặc bạn có thể cài Xcode Command Line Tools: \`xcode-select --install\`. |
| **Linux (Ubuntu)** | Mở Terminal và gõ: \`sudo apt-get update\` sau đó gõ \`sudo apt-get install git\`. |

> **Làm sao biết mình đã cài xong?**
> Hãy mở \`Terminal\` (hoặc \`Git Bash\` trên Windows), gõ dòng lệnh sau:
> \`\`\`bash
> git --version
> \`\`\`
> Nếu hiển thị \`git version 2.4X.0\` thì tức là bạn đã cài đặt thành công! 🎉

---

## 2. Khai báo danh tính (Cấu hình lần đầu tiên)

Khi bạn viết một cuốn sổ nhật ký, bạn cần phải ghi tên mình vào bìa để người sau biết ai là tác giả đúng không? Git cũng vậy, nó luôn đi theo nguyên tắc: **"Bạn phải chịu trách nhiệm về những dòng code mình tạo ra"**.

Chính vì thế, Git luôn bắt buộc nhận dạng xem ai là người đang thực hiện những thay đổi trong máy tính này. Các hệ thống như GitLab, GitHub... sẽ dựa vào cấu hình này để tính điểm hoạt động (contribution) cho bạn!

### Hãy gõ 2 lệnh sau trên Terminal (thay bằng thông tin thật của bạn):

\`\`\`bash
# Lệnh 1: Khai báo tên đầy đủ của bạn
git config --global user.name "Nguyen Van A"

# Lệnh 2: Khai báo email cá nhân (Thường dùng email bạn sẽ tạo nick GitHub)
git config --global user.email "nguyenvana_1999@example.com"
\`\`\`

*(💡 Kí hiệu \`--global\` có nghĩa là thiết lập này sẽ áp dụng cho toàn bộ các project trong máy tính của bạn. Xong một lần là xong mãi mãi.)*

### Làm thế nào để kiểm tra lại?
Rất dễ, nếu bạn lỡ quên mình đã cấu hình đúng hay chưa, hãy gõ:
\`\`\`bash
git config --list
\`\`\`
Lúc này Terminal sẽ liệt kê ra toàn bộ cài đặt của Git tính đến thời điểm hiện tại. Bạn sẽ thấy \`user.name\` và \`user.email\` mà mình vừa nhập ở cuối.

Chuẩn bị sẵn sàng chưa? Ở bài tiếp theo, bạn sẽ được tự tay "chụp" bức ảnh đầu tiên cho mã nguồn của chính mình!`,
        hasPractice: "false",
        order: 2,
      },
      {
        moduleId: mod1_1.id,
        title: "Thực hành: Tạo Commit đầu tiên",
        videoUrl: "https://www.youtube.com/watch?v=0fKg7e37bQE",
        content: `# 🎯 Thực Hành: Tạo Commit Đầu Tiên Nhé!

Bây giờ bạn sẽ được trải nghiệm sức mạnh thực sự của Git! Mọi thứ luôn bắt đầu bằng 3 từ khóa phép thuật: **init**, **add**, và **commit**.

## Bước 1: Hô biến thư mục thường thành Thư mục Phép Thuật
Để bảo Git hãy bắt đầu "trông coi" thư mục này, ta hãy khởi tạo (initialize) nó:
\`\`\`bash
git init
\`\`\`
*Lúc này bên trong cùng của thư mục sẽ xuất hiện một thư mục ẩn tên là \`.git\`. Git đã bắt đầu ngồi canh gác cẩn thận mọi biến động rồi đấy!*

## Bước 2: Bỏ đồ vào "Giỏ hàng chuẩn bị tính tiền"
Bạn mới viết xong file \`readme.md\`. Git thấy nó rồi, nhưng Git KHÔNG lưu lại nếu bạn không rõ ràng ra lệnh. 

Hãy tưởng tượng bạn dọn hàng ra tính tiền siêu thị, bạn dùng lệnh \`git add\` để thảy từng file vào giỏ hàng:
\`\`\`bash
git add .
\`\`\`
*(Dấu \`.\` mang ý nghĩa là "bỏ TẤT CẢ các file mới thay đổi vào giỏ hàng cho tao")*

## Bước 3: In hóa đơn và chụp ảnh kỉ niệm!
Đây là lúc lưu dữ liệu vĩnh viễn vào hệ thống Git, được gọi là **Commit**.
Bạn phải đính kèm một câu mô tả ngắn gọn xem ở khoảnh khắc này bạn đã làm cái gì:
\`\`\`bash
git commit -m "Commit đầu tiên"
\`\`\`
*(Chữ \`-m\` viết tắt cho 'message'. Lời nhắn này rất quan trọng để đồng đội đọc và hiểu ý nghĩa lần thay đổi này).*

---
**Bây giờ đến lượt bạn!** Khung bên phải đã có sẵn file \`readme.md\` cho bạn. Hãy gõ 3 dòng lệnh theo thứ tự ở trên xem điều rực rỡ gì sẽ diễn ra nhé! 👇`,
        hasPractice: "true",
        order: 3,
      },
    ]).returning();

    // Challenge cho lesson 3
    const baseState1 = {
      branches: { main: [] },
      commits: {},
      HEAD: "main",
      currentCommit: "",
      stagedFiles: [],
      workingFiles: ["readme.md"],
    };
    const expectedState1 = JSON.parse(JSON.stringify(baseState1));
    expectedState1.commits["C1"] = { id: "C1", message: "Commit đầu tiên", parent: null, parents: [] };
    expectedState1.branches.main.push("C1");
    expectedState1.currentCommit = "C1";

    await db.insert(challengesTable).values({
      lessonId: lesson1_1_3.id,
      goal: "Khởi tạo repo, thêm file và tạo commit đầu tiên.",
      hints: ["Gõ 'git init' để bắt đầu", "Gõ 'git add .' để thêm tất cả tệp", "Gõ 'git commit -m \"Commit đầu tiên\"' để chụp ảnh"],
      initialState: JSON.stringify(baseState1),
      expectedState: JSON.stringify(expectedState1),
    });

    // Module 1.2: Các lệnh Git cơ bản
    const [mod1_2] = await db.insert(modulesTable).values({
      courseId: course1.id,
      title: "Các lệnh Git cốt lõi",
      order: 2,
    }).returning();

    const [lesson1_2_1, lesson1_2_2, lesson1_2_3, lesson1_2_4] = await db.insert(lessonsTable).values([
      {
        moduleId: mod1_2.id,
        title: "Dò la tĩnh tại: git status và git log",
        videoUrl: "https://www.youtube.com/watch?v=8JJ101D3knE",
        content: `# 🕵️ Kiểm Tra Trạng Thái Của Repository

Trong quá trình code, bạn sẽ nhiều lần quên mất là mình đang thêm file nào, sửa đổi ra sao, và đã commit bao nhiêu lần rồi. Đừng lo, Git cung cấp "ống nhòm" quan sát rất mạnh.

## Lệnh \`git status\` - Chuyện gì đang xảy ra?
Giúp bạn kiểm tra ngay trạng thái hiện tại. Cú pháp rất đơn giản:
\`\`\`bash
git status
\`\`\`
Nếu trả về màu đỏ: là các file bạn mới sửa nhưng chưa add (đang ở ngoài).
Nếu trả về màu xanh: là các file đã được add vào giỏ (Staging area), chỉ chờ commit!

## Lệnh \`git log\` - Cuốn sổ lịch sử thời gian
Mỗi lần \`commit\`, Git đều rải một "vết bánh mì" kỉ niệm. Bạn có thể xem ngay lịch sử đó bằng:
\`\`\`bash
git log
\`\`\`
Lệnh này sẽ trả ra một danh sách dài thườn thượt. Ai thích ngắn gọn thì thêm tùy chọn \`--oneline\`:
\`\`\`bash
git log --oneline
\`\`\`
Nó sẽ chỉ hiển thị: Mã Code Ngắn + Lời nhắn (Message). Siêu dễ nhìn!

> **Khuất màn thực hành:** Ô terminal bên phải đã có sẵn nhiều commit. Bạn thử gọi các lệnh dọ mìn này ra xem thử hệ thống trả lời thế nào nhé!`,
        hasPractice: "true",
        order: 1,
      },
      {
        moduleId: mod1_2.id,
        title: "Hiểu sâu Add & Commit: Vòng đời file",
        videoUrl: "https://www.youtube.com/watch?v=8JJ101D3knE",
        content: `# 🔄 Vòng Đời Của Một File Trong Git

Người mới dùng Git thường rất thắc mắc "Tại sao cần tận 2 lệnh Add và Commit? Dùng 1 lệnh lưu thẳng không được sao?".
Để hiểu được tâm ý của người tạo ra Git, hãy làm quen với khái niệm **Staging Area**.

## 1. 3 Khu Vực Trong Triết Lý Của Git

Khi một thư mục dùng Git, nó chia không gian làm ba khu:
1. **Working Directory (Thư mục đang làm):** Là mớ hỗn độn nơi bạn đang gõ code mỗi ngày. File vừa lưu trên VS Code sẽ nằm ngay đây. Git thấy, nhưng nó không thèm quan tâm.
2. **Staging Area (Khu chờ diễn):** Đây là khu vực "chờ". Code nào xong rồi thì được đưa vào phòng chờ này bằng lệnh \`git add\`. Giống như phòng thay đồ của người mẫu trước khi lên sân khấu.
3. **Repository (.git directory):** Sân khấu chính. Mọi thứ trên phòng chờ (Staged) sẽ được chính thức cho lưu lại ở Cột Mốc Thời Gian thông qua lệnh \`git commit\`.

## 2. Cách Chọn Mặt Gửi Vàng Khi Dùng \`git add\`

Rất nhiều sinh viên chỉ hay dùng quen lệnh \`git add .\` để đẩy tất cả vào. **Ngưng nha!** Quá nguy hiểm khi lỡ thảy cả file mật khẩu vào. 
Hãy chọn lọc:
\`\`\`bash
# Chỉ add duy nhất 1 file tên là index.html
git add index.html

# Add nhiều file cụ thể
git add styles.css script.js

# Nếu bạn TỰ TIN là mình code đúng tất cả:
git add .
\`\`\`

Hãy ghi nhớ: **Đừng commit những gì chưa hoàn thiện, nhưng một khi đã thêm tính năng có ý nghĩa thì Commit luôn cho nóng!**`,
        hasPractice: "false",
        order: 2,
      },
      {
        moduleId: mod1_2.id,
        title: "Soi xét thay đổi với git diff",
        videoUrl: "https://www.youtube.com/watch?v=8JJ101D3knE",
        content: `# 🔍 So Sánh Thay Đổi Từng Chữ Chữ - Git Diff

Trong lập trình, sếp bảo "Anh thấy bản hôm qua web chạy rất ngon mà sao bản hôm nay em thêm có xíu mà nó xanh lè thế?".
Bạn cần bằng chứng! Thế là lôi \`git diff\` ra để đối chất.

## Xem ngay phần đang hì hục sửa đổi
Khi bạn vừa gõ thêm thư viện bên file \`app.js\`, nhưng bạn chưa \`git add\`. Bạn rất muốn biết chính xác mình vừa thêm/bớt cái gì (màu đỏ là bớt, màu xanh là thêm):
\`\`\`bash
git diff
\`\`\`

## Xem những phần đã đưa vào "phòng chờ" chuẩn bị commit
Đôi khi bạn cẩn thận add rồi (\`git add .\`), nhưng trước khi nhắm mắt ấn Enter dòng \`git commit\`, bạn suy nghĩ lại và muốn kiểm tra lại toàn bộ giỏ hàng của mình có gì. Lúc này hãy dùng:
\`\`\`bash
git diff --staged
# HOẶC
git diff --cached
\`\`\`

> **Làm việc sành điệu:** Đa phần các IDE hiện đại như VS Code hay IntelliJ đều tích hợp sẵn UI Diff này vào bên trong IDE cho bạn. Nên sau khi hiểu nguyên lý gốc rễ, các bạn chỉ việc click chuột xài IDE thôi nhé!`,
        hasPractice: "false",
        order: 3,
      },
      {
        moduleId: mod1_2.id,
        title: "Thực hành: Dải nén nhiều commit",
        videoUrl: "https://www.youtube.com/watch?v=8JJ101D3knE",
        content: `# 🎯 Thực hành: Build Cả 1 Dự Án Thông Qua Các Commit

Bây giờ chúng ta sẽ vào vai một Developer nhận task của ngày hôm nay. Quy tắc Vàng: **Mỗi commit là một mốc ý nghĩa trọn vẹn**. Đừng commit tất cả vào một khối khổng lồ nha.

Trong dự án ảo này, có 2 file là \`index.html\` và \`about.html\`.
Hãy thực hiện các commit liên tiếp!

### 💻 Hành Động 1: Tạo trang chủ
Bạn hãy add và gửi commit với message mô tả việc thêm trang chủ:
\`\`\`bash
git add .
git commit -m "Thêm trang chủ"
\`\`\`

### 💻 Hành Động 2: Tạo trang giới thiệu
Sếp giao tiếp làm trang about, bạn làm xong và tiếp tục commit lịch sử lại:
\`\`\`bash
git add .
git commit -m "Thêm trang giới thiệu"
\`\`\`

*Bạn hãy thử qua terminal và làm từng thao tác một để chứng kiến đồ thị rẽ nhánh ở trên hình thành nha.*`,
        hasPractice: "true",
        order: 4,
      },
    ]).returning();

    // Challenge lesson 1.2.1
    const baseStateLog = {
      branches: { main: ["C1", "C2"] },
      commits: { 
        C1: { id: "C1", message: "Initial", parent: null, parents: [], timestamp: new Date().toISOString() },
        C2: { id: "C2", message: "Update", parent: "C1", parents: ["C1"], timestamp: new Date().toISOString() }
      },
      HEAD: "main",
      currentCommit: "C2",
      stagedFiles: [],
      workingFiles: ["test.txt"],
    };
    await db.insert(challengesTable).values({
      lessonId: lesson1_2_1.id,
      goal: "Thực hành xem trạng thái và lịch sử commit.",
      hints: ["Gõ 'git status' để xem các file chưa được add.", "Gõ 'git log' hoặc 'git log --oneline' để xem lịch sử 2 commit."],
      initialState: JSON.stringify(baseStateLog),
    });

    // Challenge cho lesson 1.2.4
    const baseState2 = {
      branches: { main: ["C1"] },
      commits: { C1: { id: "C1", message: "Initial commit", parent: null, parents: [], timestamp: new Date().toISOString() } },
      HEAD: "main",
      currentCommit: "C1",
      stagedFiles: [],
      workingFiles: ["index.html", "about.html"],
    };
    const expectedState2 = JSON.parse(JSON.stringify(baseState2));
    expectedState2.commits["C2"] = { id: "C2", message: "Thêm trang chủ", parent: "C1", parents: ["C1"] };
    expectedState2.commits["C3"] = { id: "C3", message: "Thêm trang giới thiệu", parent: "C2", parents: ["C2"] };
    expectedState2.branches.main = ["C1", "C2", "C3"];
    expectedState2.currentCommit = "C3";

    await db.insert(challengesTable).values({
      lessonId: lesson1_2_4.id,
      goal: "Tạo 2 commit liên tiếp trên nhánh main.",
      hints: ["Gõ 'git add .' rồi 'git commit -m \"Thêm trang chủ\"'", "Tiếp tục: gõ lại 'git add .' và 'git commit -m \"Thêm trang giới thiệu\"'"],
      initialState: JSON.stringify(baseState2),
      expectedState: JSON.stringify(expectedState2),
    });

    // Module 1.3: Branch và Merge
    const [mod1_3] = await db.insert(modulesTable).values({
      courseId: course1.id,
      title: "Vũ Khí Hủy Diệt Của Git - Branch & Merge",
      order: 3,
    }).returning();

    const [lesson1_3_1, lesson1_3_2, lesson1_3_3] = await db.insert(lessonsTable).values([
      {
        moduleId: mod1_3.id,
        title: "Tạo Không Gian Chơi Riêng Với Branch",
        videoUrl: "https://www.youtube.com/watch?v=Jte2Bnheys0",
        content: `# 🌿 Branch - Phân Nhánh Quyền Năng

Có một quy tắc cực kì khắt khe khi đi làm công ty: **TUYỆT ĐỐI không bao giờ được viết code trực tiếp vào nhánh \`main\`**. Nhánh main (hay master) chứa mã nguồn đang được chạy trên Server cho khách hàng thực dùng. Sai 1 li là mất tiền tỷ!

Thế làm sao thêm tính năng mới mà để nhánh \`main\` sống thọ? Câu trả lời là **tạo một bản sao** (Branch).

## 1. Bản chất Branch
Nhánh thực chất y hệt như một Đa vũ trụ trong Marvel. Nó khởi đầu chia ra từ dòng Timeline Gốc (nhánh main), sau đó bạn tùy thích quậy phá, thêm xóa ở trên nhánh song song đó mà Timeline bên kia không hay biết.

## 2. Cách Tạo & Đổi Nhánh

### Cách truyền thống: Gồm 2 thao tác
Giả sử sếp giao lệnh làm tính năng "Gió Hàng". Bạn tạo nhánh tên là \`feat/cart\`:
\`\`\`bash
# 1. Tạo nhánh tên là feature
git branch feature

# 2. Xách vali chạy sang nhánh đó định cư
git checkout feature
\`\`\`

### Cách siêu ngầu mới nhất (Khuyên dùng)
Bạn muốn đi lối tắt? Tạo nhánh VÀ di chuyển sang đó cùng 1 nhịp thở:
\`\`\`bash
# Dùng flag -b (nghĩa là branch)
git checkout -b feature

# Ở các bản git mới nhất, họ ra mắt lệnh dễ hiểu hơn:
git switch -c feature
\`\`\`

Nếu muốn về lại ngôi nhà xưa \`main\`, rất dễ: \`git checkout main\` (hoặc \`git switch main\`). Thấy đỉnh chưa, bạn vừa nhảy xuyên không giữa 2 không gian mà dữ liệu trên ổ cứng tự đổi theo một cách vi diệu!`,
        hasPractice: "false",
        order: 1,
      },
      {
        moduleId: mod1_3.id,
        title: "Sáp nhập đa vũ trụ: Merge Nhánh",
        videoUrl: "https://www.youtube.com/watch?v=Jte2Bnheys0",
        content: `# 🔀 Merge - Gộp Nhánh, Thu Thành Quả

Sau cả tuần giam mình nơi hoang đảo trên nhánh \`feature\`, cuối cùng bạn cũng xong tính năng siêu ngầu chuẩn bị tung lên hệ thống. Đã đến lúc mang về báo công cho nhánh chính (\`main\`).

Hành động này trong Git gọi là **Merge** (Gộp).

## Nguyên Tắc 3 Bước Khi Merge

Giả sử bạn đang đứng ở nhánh \`feature\` và muốn đổ dòng chảy về \`main\`. Hãy ghi nhớ quy tắc: "Phải đứng ở nền móng vững chắc mới được nhận hàng đổ về!".

**Bước 1:** Bạn phải di chuyển về bản lề chính (nhánh đích).
\`\`\`bash
git checkout main
\`\`\`

**Bước 2:** Cập nhật bản chính mạnh nhất (Tùy chọn, để đảm bảo main đang mới nhất nếu team có nhiều người. Giờ thì chưa).

**Bước 3:** Ra hiệu lệnh HÚT nhánh phụ vào:
\`\`\`bash
git merge feature
\`\`\`

*A lê hấp,* tất cả file code mới toanh mà bạn viết bên kia đã nghiễm nhiên đi vào main, và đồ thị lịch sử của 2 cái nhanh chóng chập lại thành một mối.

> **💡 Lưu ý Cực Quan Trọng:** Rất nhiều bạn quên đoạn nhảy về \`main\`, mà đang đứng ở \`main\` vô tình \`git merge main\` vào \`feature\`. Kết quả là đi ngược dòng! Bạn cần đọc kĩ lệnh trên trước khi enter.`,
        hasPractice: "false",
        order: 2,
      },
      {
        moduleId: mod1_3.id,
        title: "Thực hành: Nhảy cóc Branch & Merge Đẳng Cấp",
        content: `# 🎯 Thực hành: Chuyên Gia Gộp Nhánh

Nói dài nói dở không bằng tự gõ chứng nhận. Đây là bài test bạn có hiểu đa vũ trụ của Branch hay không!

## Sứ mệnh:
Tạo nhánh mới \`feature\`, commit một bài thơ tính năng trên nhánh đó, đứng lên vươn vai rồi đi về gộp cho nhánh \`main\`.

## Hãy đánh máy thần tốc các dòng lệnh này:

**1️⃣ Bước nhảy xuyên không (Tạo mới và chuyển sang):**
\`\`\`bash
git checkout -b feature
\`\`\`

**2️⃣ Sáng tạo và kí giấy (Add & Commit trên nhánh mới):**
\`\`\`bash
git add .
git commit -m "Thêm tính năng siêu to khổng lồ"
\`\`\`

**3️⃣ Trở lại Trái Đất (Về lại nhánh chính):**
\`\`\`bash
git checkout main
\`\`\`

**4️⃣ Thâu tóm đa vũ trụ (Merge vào):**
\`\`\`bash
git merge feature
\`\`\`

*Bạn hãy nhìn xem giao diện đồ thị Graph rẽ đôi rồi tái hợp như thế nào nhé! Gõ đi nào!* 👇`,
        hasPractice: "true",
        order: 3,
      },
    ]).returning();

    // Challenge cho lesson 1.3.3
    const baseState3 = {
      branches: { main: ["C1"] },
      commits: { C1: { id: "C1", message: "Initial commit", parent: null, parents: [], timestamp: new Date().toISOString() } },
      HEAD: "main",
      currentCommit: "C1",
      stagedFiles: [],
      workingFiles: ["feature.txt"],
    };

    await db.insert(challengesTable).values({
      lessonId: lesson1_3_3.id,
      goal: "Tạo nhánh 'feature', commit trên đó, rồi merge lại vào 'main'.",
      hints: [
        "Gõ 'git checkout -b feature' để mở nhánh mới", 
        "Gõ 'git add .' rồi 'git commit -m \"Thêm tính năng\"'", 
        "Gõ 'git checkout main' chạy về bờ và 'git merge feature' để nuốt gọn."
      ],
      initialState: JSON.stringify(baseState3),
    });

    // =============================================
    // KHÓA HỌC 2: GitHub và Làm Việc Nhóm
    // =============================================
    const [course2] = await db.insert(coursesTable).values({
      title: "GitHub - Làm Việc Nhóm Điêu Luyện",
      description: "Thoát ế với GitHub! Nền tảng chia sẻ code hàng đầu. Nắm vững Push/Pull, mở PR và chốt hợp tác nhóm mượt mà không chút 'xung đột'.",
      level: "intermediate",
      imageUrl: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      order: 2,
    }).returning();
    console.log(`✅ Tạo khóa học: ${course2.title}`);

    // Module 2.1: GitHub cơ bản
    const [mod2_1] = await db.insert(modulesTable).values({
      courseId: course2.id,
      title: "Lên Mây Với GitHub",
      order: 1,
    }).returning();

    await db.insert(lessonsTable).values([
      {
        moduleId: mod2_1.id,
        title: "GitHub có phải là Git không?",
        videoUrl: "https://www.youtube.com/watch?v=RGOj5yH7evk",
        content: `# ☁️ GitHub vs Git - Chuyện Tình Hai Người Họ G

Khi bắt đầu học IT, mọi người đều hay nhầm lẫn "GitHub là Git". Đây là nhầm lẫn lớn như củ khoai tây và củ khoai lang vậy!

## Bản chất vấn đề:
- **Git** là **CÔNG CỤ PHẦN MỀM** cài dưới gầm máy tính của BẠN. Nó không cần Internet cũng chạy rầm rầm.
- **GitHub** là **TRANG MẠNG DỊCH VỤ** thuộc sở hữu của con buôn khổng lồ Microsoft. Nó là một Website đóng vai trò cái Kho rỗng tuếch để mọi người đem cấu trúc Git đẩy lên kết nối với nhau.

Nói cho dễ hiểu: **Git là máy ảnh chụp phim, thì GitHub là quyển Album ảnh đặt trên Cloud (Đám mây) mang tên Facebook để đem khoe cho họ hàng xem.**

## GitHub Mang Lại Quyền Lực Gì?

1. **Portfolio cho Lập trình viên:** Đi xin việc khỏi cần nộp bằng Đại Học, gửi link cái GitHub đầy các dự án tự làm (xanh mướt) là nhà tuyển dụng mắt sáng chói.
2. **Nguồn Open Source (Mã Nguồn Mở) Vô Tận:** Các gã khổng lồ như Google (React, Angular), Facebook, Linux đều ném hết Code của nhân viên họ lên GitHub cho bạn học lỏm miễn phí.
3. **Luân chuyển Đội Nhóm:** Người ở Sài Gòn, kẻ ở Cà Mau vẫn làm chung 1 đồ án qua GitHub cực ngon lành.

Bắt đầu háo hức rồi chứ? Sang bài tiếp theo ta sẽ chơi Trò chơi Bắn Ném (Push & Pull) lên đám mây nhé!`,
        hasPractice: "false",
        order: 1,
      },
      {
        moduleId: mod2_1.id,
        title: "Ba Động Từ Quyền Năng: Clone - Push - Pull",
        videoUrl: "https://www.youtube.com/watch?v=RGOj5yH7evk",
        content: `# 🚀 Clone, Push, Pull - Dữ Liệu Bắt Đầu Bay Khỏi Bàn Phím

Đã đến lúc gắn kết chiếc máy tính quèn của bạn với đám mây vĩ đại. Dưới đây là 3 câu Thần chú thiết yếu:

## 1. Mượn Đồ Về Xài: \`git clone\`
Gặp đồ án của thầy hay quá trên GitHub, muốn bợ toàn bộ code về máy chạy thử? Lệnh \`clone\` là sinh ra cho bạn.
\`\`\`bash
git clone https://github.com/maitamdev/Git-Github-Study.git
\`\`\`
Lệnh này tải TẤT CẢ folder gốc, toàn bộ file, toàn bộ lịch sử commit về 1 thư mục mới toanh không lệch một li.

## 2. Giao Dịch Đẩy Lên: \`git push\`
Sau khi gõ 3 ngàn dòng code xịn xò, tạo commit thành công mỹ mãn... ở dưới máy! Người khác chưa xem được đâu.
Bạn cần đẩy (Gửi đi/Bắn đi) nó:
\`\`\`bash
git push origin main
\`\`\`
> Ở đây, từ khóa **\`origin\`** là tên gọi đại diện của "đám mây GitHub". Còn \`main\` là cái nhánh bạn đang muốn đẩy thông tin lên. Gõ xong nhớ gõ password/SSH và bùm... File đã chễm chệ trên trình duyệt.

## 3. Xin Ít Sức Mạnh Vũ Trụ: \`git pull\`
Hôm nay bạn vừa ngủ thì người đồng sáng lập của bạn miệt mài thức đến 3 giờ sáng code 1 đống và đẩy lên GitHub. Sáng hôm sau thức dậy, máy của bạn *quê mùa* quá, chưa có dòng code mới đó!
Kéo (Rút về/Lấy về) mã nguồn mới nhất bằng:
\`\`\`bash
git pull origin main
\`\`\`

Dễ ợt đúng không? Push là Đẩy, Pull là Kéo. Nhớ 2 từ vựng tiếng Anh này học sinh tiểu học cũng biết!`,
        hasPractice: "true",
        order: 2,
      },
      {
        moduleId: mod2_1.id,
        title: "Pull Request (PR) Là Cái Thể Thống Gì?",
        videoUrl: "https://www.youtube.com/watch?v=RGOj5yH7evk",
        content: `# 📝 Pull Request (PR) - Lời Cầu Xin Lịch Sự

Lại hỏi chuyện văn phòng: Khi một nhân sự cấp dưới (Intern) làm xong tính năng mới... sếp có cho phép anh ta tự động lấy code đẩy thẳng vào nhánh \`main\` dùng cho khách hàng đang nạp trăm đô mỗi giây không? Giao trứng cho ác đó! 😱

Để giải quyết, GitHub đẻ ra nút **Pull Request** nổi đình nổi đám (viết tắt là PR).

## PR - Không Phải Mối Quan Hệ Công Chúng Tiếng Anh Nha!
PR (Pull Request) dịch nôm na là: **"Sếp ơi, em xin tự tiện kéo (pull) đoạn code của em dán đè vào code xịn của công ty, sếp xem xong rồi nhấp (merge) giùm em".**

## Vòng Phủ Lý PR Nhộn Nhịp

1. **Người Tạo PR:** 
   Code xong bằng \`branch feature\` riêng của mình, sau đó **push** branch lẻ loi ấy lên GitHub. Lên Website bấm nút "Mở Pull Request".
   Ghi một cái mô tả thật dài và tâm huyết để chứng tỏ mình code giỏi.

2. **Người Duyệt PR (Reviewer):**
   Sếp Senior sẽ vào dòm xem dòng số 12 tên biến em đặt ngu quá, dòng 45 bị lặp vòng lặp vô tận. Sếp ghi bình luận vào và **"Yêu Cầu Sửa Đổi" (Request Changes)**. Đứa cấp dưới tự ái, code lại và nạp thêm.

3. **Chốt Đơn (Merge):**
   Khi không còn giọt sạn nào, sếp mỉm cười bấm một nút siêu bự màu xanh lá cây tên là **Merge Pull Request**. Đoạn code em thực sự chuyển giao sức mạnh chạy trên máy chủ sản phẩm thật!

Nhớ kĩ: Khi làm đội lớn, không bao giờ được chạm vào nhánh Chính. Cả cuộc đời kỹ sư gói gọn trong việc "Push lên nhắn tin Mở cái PR đi rảnh tao Merge cho!".`,
        hasPractice: "false",
        order: 3,
      },
    ]);

    // Challenge lesson 2.1.2 - push pull
    const baseStatePush = {
      branches: { main: ["C1", "C2"] },
      commits: { 
        C1: { id: "C1", message: "Initial", parent: null, parents: [], timestamp: new Date().toISOString() },
        C2: { id: "C2", message: "My new feature", parent: "C1", parents: ["C1"], timestamp: new Date().toISOString() }
      },
      HEAD: "main",
      currentCommit: "C2",
      stagedFiles: [],
      workingFiles: [],
    };
    
    // Tìm lesson 2.1.2
    const [lessonPush] = await db.select().from(lessonsTable).where(sql`title = 'Ba Động Từ Quyền Năng: Clone - Push - Pull'`).limit(1);
    if(lessonPush) {
      await db.insert(challengesTable).values({
        lessonId: lessonPush.id,
        goal: "Đẩy thẳng công trình xịn xò của bạn lên Máy Chủ Ảo GitHub (origin).",
        hints: ["Thần chú duy nhất: Gõ 'git push origin main' là code bay vào mây xanh"],
        initialState: JSON.stringify(baseStatePush),
      });
    }

    // Module 2.2: Làm việc nhóm
    const [mod2_2] = await db.insert(modulesTable).values({
      courseId: course2.id,
      title: "Luật Chơi Rừng Xanh: Git Flow",
      order: 2,
    }).returning();

    await db.insert(lessonsTable).values([
      {
        moduleId: mod2_2.id,
        title: "Binh Pháp Tôn Tử: Mô Hình Git Flow",
        content: `# 👑 Binh Pháp: Mô hình Git Flow Chuẩn Chỉnh

Giao việc cho 1 nhóm sinh viên 5 người, ai thích sao thì nhảy nhánh đó thì là một cái **Sở thú hỗn loạn**. Các tập đoàn lớn trên thế giới từ cả thập kỷ trước đã quy chuẩn lại cho chúng ta bằng Binh pháp mang tên **Git Flow**.

## Cây Cấp Bậc Các Nhánh (Sờ lọn xương sống)

🔥 **1. Nhánh Siêu Cấp (\`main\` hoặc \`master\`)** 
Đây là vương quốc hoàn hảo. **KHÔNG MỘT GIỌT MÃ LỖI** nào được lọt vào. Nhánh này kết nối tự động với hệ thống thật của khách (Production).

🧪 **2. Nhánh Xưởng Thí Nghiệm (\`develop\`)**
Thay vì đày đọa nhánh chính, kỹ sư lập đội gộp code vào nhánh có tên là \`develop\`. Mọi người đều tích luỹ thành quả mới vô đây chạy thử xem nó có đánh cãi cọ nhau hông.

🌱 **3. Nhánh Cày Thuê (\`feature/****\`)**
Đây là nơi bọn Culi bắt đầu bóc vác. Khai chi nhánh ra từ gốc \`develop\`. Code xong quăng cái Rầm 1 cái PR vô lại \`develop\`. (vd: \`feature/login-gg\`, \`feature/quen-pass\`)

🚑 **4. Xe Cấp Cứu Chợt Loé (\`hotfix/****\`)**
Lúc này lúc 12h khuya, khách hàng chửi rủa vì ko mua được vé trên nhánh \`main\`. Lôi nhánh \`hotfix\` đẻ từ \`main\` ra, sửa rẹt rẹt trong 3 nốt nhạc. Bơm code trực diện thẳng lên \`main\` kệ nội thằng \`develop\`. Sửa xong thì quay xuống báo cho \`develop\` vá ké luôn.

🌟 **Đó là triết lý, hãy áp dụng điều này cho mọi tổ chức.**`,
        hasPractice: "false",
        order: 1,
      },
      {
        moduleId: mod2_2.id,
        title: "Tấm Áo Tàng Hình: .gitignore",
        content: `# 👻 Tấm Áo Tàng Hình File .gitignore

## .gitignore Mệnh Danh Là Gì?
Hiểu sương sương, đây là tấm khiên vững chãi dặn vội Git: "Đám danh sách này mài coi như không khí giùm tao! Tuyệt đối không Tracking và không Bao giờ Add vào tụi nó!"

## Tại sao Cần Một Tờ .gitignore?

1. **Bảo mật mạng là trên hết:** Code xịn mà đem dán thẳng Mật khẩu DB (Database), Secret Key, mã API vào file \`.env\` rồi lỡ dại **push** lên GitHub Public thì Hacker nó xông vào hút cạn tiền Cloud trong 1 đêm! Tấm áo này sẽ che chữ .env lại kĩ càng.
2. **Khỏi bị dơ dặm rác thải:** Bạn tải nguyên cục \`node_modules\` bự nửa tỉ GB vào mạng. Code người khác chỉ cần \`package.json\` tải lại được ngay thì tội gì phải ôm thêm?

## Mẫu Khung Sườn Vàng Của .gitignore:
Tùy vào công nghệ bạn làm (Node, React, Java) mà bạn thả file này ở đầu thư mục ngay lúc tạo dự án ảo bằng Git Init:
\`\`\`
# Những cặn bẩn của NPM
node_modules/
npm-debug.log

# Rác của máy Mac hoặc Windows tụ tập
.DS_Store
Thumbs.db

# Output sinh ra khi build project (nặng trịch)
dist/
build/
.next/

# Kẻ hủy diệt cuộc đời, Tuyệt mật không tò mò!!! ⚠️⚠️⚠️
.env
.env.local
.env.production
\`\`\`

Luôn chuẩn bị kỹ và xem xét tấm áo choàng này trước khi làm ăn lớn nha!`,
        hasPractice: "false",
        order: 2,
      },
    ]);

    // Module 2.3: Xử lý xung đột & Open Source
    const [mod2_3] = await db.insert(modulesTable).values({
      courseId: course2.id,
      title: "Căng Buồm Giông Bão (Conflict)",
      order: 3,
    }).returning();

    await db.insert(lessonsTable).values([
      {
        moduleId: mod2_3.id,
        title: "Merge Conflict - Oan Gia Ngõ Hẹp",
        content: `# 🥊 Xung Đột Dòng Code (Merge Conflict)

Bạn đang merge nhánh A vào nhánh B. Mọi chuyện sẽ êm xuôi rạo rực nếu cả 2 sửa 2 file KHÁC NHAU. Git thông minh quá tự nó làm.
Nhưng... **Trời đánh tránh bữa ăn, 2 anh Em cùng nhúng chàm viết hàm TÍNH TỔNG tại File C ở cùng 1 dòng 24!** Git chịu cứng, báo loạn: "Tao ngu quá không biết nên chọn dòng của thằng A hay thằng B, mài là sếp mày vào can đi!". 
Đó chính là **Merge Conflict**.

## Hiện Trạng Chiến Trường

Khi bạn gõ lệnh merge, và bùm - Conflict. Git sẽ ngưng tự tay và ném các dấu mũi tên máu vào trong đoạn văn của bạn như sau:

\`\`\`javascript
function tinhTong(a, b) {
<<<<<<< HEAD (Nhánh Tương Lai đang đón)
  return a + b + "VNĐ";
=======
  return a + b + " Đồng Chí";
>>>>>>> feature/tieng-dia-phuong (Nhánh vừa lao tới)
}
\`\`\`

## 3 Bước Hòa Giải Conflict Tuyệt Đỉnh Nhất Quả Đất

1. **Vào Phân Tâm Phán Quyết:** Bạn quyết định chọn cái nào là đúng. Nếu IDE như VS Code thì nó xổ ngay nút: \`Accept Current Change\`, \`Accept Incoming Change\`.. hoặc \`Accept Both\`! Rất nhàn nhã!
2. **Dừng Cứu, Xong Rồi Xóa Dấu Tích:** Đừng để sót mấy cái dấu gạch chéo nham nhở kìa của Git nhé.
3. **Thảo Văn Mới Gắn Nữa Khắc Cốt Ghi Tâm:**
\`\`\`bash
git add file_chua_xung_dot.js
git commit -m "Fix merge xé cõi dòng 24"
\`\`\`
Trời yên mây tạnh, tiến tới chinh phục vũ trụ!`,
        hasPractice: "false",
        order: 1,
      },
      {
        moduleId: mod2_3.id,
        title: "Open Source - Tinh Thần Lấy Đuốc Soi Đường (Fork & PR)",
        content: `# 🌟 Khởi Đầu Với Mã Nguồn Mở

Làm sao bạn có thể lấy bài một thằng tây nào đó mà mình ko quen biết, chỉnh sửa Code cho nó ngầu hơn, rồi đẩy ngược lên hiến tế thành tựu cho họ? Đó là cách phát triển Open Source trên GitHub.
GitHub không cấp quyền Cấp Mức truy cập cho mọi dân đen vào sửa Code của 1 dự án (Nó phá sao!).

## Lối Đi Cho Vị Nho Sĩ Góp Code: Thao Tác Fork

"Fork" hình cái Nĩa. Ý nghĩa là chích đứt lìa mã nguồn của Repo gốc, tạo ra ngay một cái Clone vĩ đại nằm chết tại **Tài Khoản GitHub Cá Nhân Của Bạn**. Nó là vương quốc của bạn, bạn có thể tự sát hoặc phá hoại tùy ý.

## 4 Bước Góp Răng Lược Vào Lịch Sử 📖

1. **Tìm repo idol trên GitHub -> Click Nút \`Fork\` góc đỉnh phải.** 
   (Bùm! Nó hiện danh sách Repo trong nick của em).
2. **Clone repo em vừa Fork từ nick em lấy về máy cài vscode.**
   (A lê hấp, nó thành kho báu cục bộ \`git clone...\`).
3. **Sửa banh chành File Bug xong xuôi, em mạnh dạng Push phát lên GitHub CỦA MÌNH.**
   (\`git push origin main\` - Chắc chắn lên tài khoản mình!).
4. **Trở Ra Biển Lớn - Ấn mở PR!**
   Bạn điều hành trên GitHub qua repo thật, tạo Yêu cầu \`Pull Request\`. Xin so kè đối chiếu nhánh nick của bạn, sang Nhánh Nick của người lạ. Admin Repo gốc ngồi check ưng ưng -> Merge cái Đùng. 

🎉 Vậy là Avatar và tên của em đã ghi vào Contributors (Nhà đóng góp) trên cả màn diện thế giới. Oai chưa nào!`,
        hasPractice: "false",
        order: 2,
      }
    ]);

    // =============================================
    // KHÓA HỌC 3: Git Nâng Cao
    // =============================================
    const [course3] = await db.insert(coursesTable).values({
      title: "Git Pro - Quyền Năng Hiệp Sĩ Cứu Nguy",
      description: "Thăng hoa trình độ từ băm bổ thành kỹ sữ tinh hoa. Làm chủ cỗ máy Git thời gian hoàn toàn bằng Interactive Rebase, Cherry-Pick và Reflog Cứu Rỗi linh hồn.",
      level: "advanced",
      imageUrl: "https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png",
      order: 3,
    }).returning();
    console.log(`✅ Tạo khóa học: ${course3.title}`);

    const [mod3_1] = await db.insert(modulesTable).values({
      courseId: course3.id,
      title: "Bếp Trưởng Quản Lưu Trữ",
      order: 1,
    }).returning();

    await db.insert(lessonsTable).values([
      {
        moduleId: mod3_1.id,
        title: "Tái Sinh Hình Thể: git rebase",
        content: `# ✂️ Git Rebase - Viết Lại Lịch Sử Theo Ý Mình

Rebase là một kỹ năng phân biệt ranh giới Senior và Junior (Có rất nhiều thanh niên 3-4 năm đi làm mới vọc đến). Sức mạnh Rebase mạnh, nhưng chơi dao thì hay đứt tay.

## 1. Rebase Khác Merge Chỗ Nào?
Trong khi Merge tạo ra 1 cục Commit mới tinh lằng nhằng dính bầu nhánh phụ vào nhánh chính, làm gia phả đồ thị rối bù dích dắc hình xương cá... thì **REBASE** nó "Nhấc cmn" toàn bộ những lịch sử của nhánh phụ, cắt ra, đi đem cắt dán đắp nối dài thành một vệt **Thẳng Tắp** trên nhánh chính.

### 🖼️ Trực Quan:
**Trước Rebase:**
\`\`\`
main     ●────●────●
              \\
feature        ●────● (Con của mốc số 2)
\`\`\`

**Sau khi búng ngón tay \`git rebase main\` (đang đứng ở feature):**
\`\`\`
main     ●────●────●
                    \\
feature              ●────● (Rebase bay lên con số 3, thẳng tắp lịch sử!)
\`\`\`

## 2. Interactive Rebase (\`-i\`) - Dọn Sạch Lịch Sử Rác
Lý do Rebase đẳng cấp còn đến từ tính năng "Tiến Hóa Chỉnh Tay". Cú pháp:
\`\`\`bash
git rebase -i HEAD~3   # Trải hồn 3 commit gần nhất ra VIM để dọn dẹp
\`\`\`

Một trình chỉnh sửa văn bản sẽ mở ra cấp phát uy quyền xử trảm:
- Thay vì để mớ rác \`commit 1: css chữ đỏ\`, \`commit 2: test margin\`, \`commit 3: ok done\`. Bạn lôi Option **"Squash"** ra gộp dính chùm 3 cục làm 1: "Thêm giao diện Home Đỉnh Cao". 
Người review Code thấy Lịch Sử Đẹp Lộng Lẫy mà không biết bạn đã lén lút sửa lỗi tứa lưa bên dưới!

> ⚠️ CẢNH BÁO TỬ THẦN: **Bạn KHÔNG BAO GIỜ, TUYỆT ĐỐI KHÔNG BAO GIỜ REBASE những thay đổi rẽ nhánh ĐÃ ĐƯỢC PUSH HẲN LÊN KHÔNG GIAN GITHUB**. Hãy tôn trọng team. Lịch sử bị ghi đè sẽ gây "nổ" máy các Dev khác trong nhà!.`,
        hasPractice: "false",
        order: 1,
      },
      {
        moduleId: mod3_1.id,
        title: "Túi Không Gian Doraemon: git stash",
        content: `# 🎒 Git Stash - Túi Thần Kỳ Của Lập Trình Viên

## Tình Thế Áo Não Của Đời Thực:
Bạn đang code dở dang 400 dòng thuật toán tối tân siêu việt ở hàm Search thì sếp giậm điện thoại báo một góc ở Web chính đang hiển thị tên Sai của Khách hàng, sửa Bug cháy nhà!
Đau đớn thay, 400 dòng bạn cày nãy giờ là mã chết, chưa chạy được, chưa thể \`commit\`. Nhưng nếu check out nhánh cũ qua nhánh lỗi thì Git Báo Ầm Lên Cấm không cho đi vì dính code "Unstaged"! Không lẽ xóa code bốc hơi cày lại từ đầu? 😩

## Gặp Gỡ Túi Thần Kỳ
Bỏ toàn bộ đồ dang dở hốt vô giỏ giấu gậm giường:
\`\`\`bash
git stash
\`\`\`
Gõ cái bụp! Phù, không gian sạch bong sáng bóng như trinh nguyên. Máy nhẹ tênh. Bạn nhảy về nhánh \`hotfix/sua-ten\` sửa lỗi tung tóe, merge cứu lửa xịn xò xong quay lại nhánh thân thương cũ của bạn.

## Triệu Hồi Công Nghệ Trở Lại:
Lúc nhánh sạch, gõ nhẹ câu thần chú:
\`\`\`bash
git stash pop
\`\`\`
Boom! Toàn bộ 400 dòng thuật toán lòi ra ngay dòng đánh dở lúc nãy. Bạn tiếp tục làm việc nhàn rỗi chẳng tốn 1 giọt mồ hôi.

***Danh mục đệ tử của stash:***
* \`git stash list\`: Xem coi mình giấu mấy cục trong kho rồi
* \`git stash apply\`: Lôi ra thôi chứ không xóa cục rác ở ngăn giấu
* \`git stash drop\`: Đẩy luôn giỏ rác chìm vào cỏi tàn dư`,
        hasPractice: "false",
        order: 2,
      },
      {
        moduleId: mod3_1.id,
        title: "Pháp Thuật Ban Lại: Reset và Revert",
        content: `# ⏰ Hoàn Tác Cỗ Máy Thời Gian Ngược Về Quá Khứ

"Lỡ cất tay nhấn phím mà lỡ làm sập Cục Diện rồi. Em làm sao đưa Code về lại nửa tiếng trước đây Sếp?"

Có tới 2 vị anh hùng đảm nhận việc xé ngược khoảng không thế kỷ này. Ranh giới sử dụng thuộc dạng sinh tử!

## 1. Bí Dược Reset: \`git reset\` (Mạnh - Chưa Push)
Dùng khi mã lệnh dở chứng của bạn CHƯA tung rải rác lên mạng GitHub. Nó vĩnh viễn quét sạch bóng loáng một hay nhiều Cột mốc tựa như chưa từng sinh ra.
*   **Soft (\`--soft\`):** Giữ lại toàn bộ ruỗi rác trên bàn (Staging Area) chỉ diệt mỗi cột mốc History.
*   **Mixed:** (Mặc Định) Đưa toàn bộ phế tích rác ra hẳn ngoài không gian thư mục. Phải tự chia lại từ đầu.
*   **Hard (\`--hard\`):** ☠️ **TUYỆT ĐỐI XÓA SÁCH, TIÊU DIỆT TỪ NÃO LÝ THUYẾT TRONG Ổ CỨNG TRỰC TIẾP LÀ TRANG TRẮNG CỤT NGỦN**. Quá Khứ Bốc Hơi Vĩnh Viễn!

\`\`\`bash
# Diệt 1 cục cuối
git reset --hard HEAD~1
\`\`\`

## 2. Nghệ Sĩ Thượng Tôn: \`git revert\` (Mượt - Đã Push)
Điều kinh khủng nhất là code lỗi của em ĐÃ TRÊN GITHUB ai cũng chép về mảng to bự.
CẤM DÙNG RESET VÌ THAY ĐỔI LỊCH SỬ. Em phải dùng \`Revert\`. 

Hoạt động: Tạo ra hẳn **"MỘT Commit Mới"**, bản thân chức năng của cái Mới này là ĐI NGẬM NGHỊCH CHIỀU TIÊU DIỆT sạch tác dụng của Cục Cũ (Như 1 phép Trừ Phân Thức). Lịch sử nối dài văn minh tiến hóa tự nhiên ko ai đau thương khóc thét cả!

\`\`\`bash
git revert hash_of_bug_commit_xxyy
\`\`\`

> 💡 **Khắc Ghi Quy Tắc Lập Trình Viên Pro**: "Ở Nhà Thì Xài **Reset**, Ra Đường Chơi Chung Thì Xài **Revert**"`,
        hasPractice: "false",
        order: 3,
      },
      {
        moduleId: mod3_1.id,
        title: "Ké Kẹo Thông Minh: git cherry-pick",
        content: `# 🍒 Nhặt Quả Ngọt: Git Cherry-Pick Tiên Giao

Bạn đứng ở nhánh \`main\`. Đằng kia là nhánh \`dev\` đang có hỗn tạp gần 20 commit test tính năng chưa hoàn thiện và đứt mẻ đủ trò.
Sếp chỉ tay yêu cầu: "Trong nhánh dev đó có Cục Commit Cập Nhật Màu Sắc Form. Em bê nguyên xi cục đó qua đây cho hiện diện luôn. Khỏi bế hết đống rác còn lại rườm rà!"

Bạn sẽ làm tay coppy paste bằng notepad cực kỳ thủ công?
Không, sức mạnh Cherry-Pick của dũng sĩ Git ra đời:

\`\`\`bash
git cherry-pick <chép_cái_hash_ID_mã_nguồn_6_chữ_bỏ_vào_đây>
# Ví dụ: git cherry-pick ab75dj
\`\`\`

Lệnh Càn Quét ngay: Nhanh như Cắt, Git bốc khói dạo quanh bản đồ, lấy đi dòng code được gắn tại Cục đó và NÉM DÍNH NGAY LẬP TỨC thẳng thắn tạo 1 Commit Y hệt đè lên nhánh Hiện Tại mà ta đang đứng. Cực kỳ Diệu Kỳ, Sáng Suốt & Hiện Đại.

Cherry-Pick sử dụng nhiều khi cần Cứu rớt Lỗi HotFix hoặc Tách lọc ra riêng những phần chức năng Đơn. Kỹ tuýp vi diệu của kẻ sừng sỏ.`,
        hasPractice: "false",
        order: 4,
      },
      {
        moduleId: mod3_1.id,
        title: "Bùa Chú Hồi Sinh: git reflog",
        content: `# 🪦 Bùa Chú Hồi Sinh: Git Reflog Cực Cấp Cứu

Bạn hoảng loạn... Mồ hôi vã ròng ròng trên trán.
Bạn vừa lỡ gõ \`git reset --hard HEAD~5\` và ấn Enter quá nhanh (xóa nát vĩnh cửu đi 5 ngày lao lực vất vả trong tíc tắt). 
Bạn bật ngửa ra đằng ghế... Liệu ông trời có lấy đi sự nghiệp của mình ở vòng phỏng vấn này chăng? Xong Đời, Đuổi việc chắc!

### 👼 Khoan Đã, Chưa Kết Thúc Đâu!

Git thương cảm bạn lắm. Vẫn còn "Trạm Lưu Trú" cuối cùng không lưu đồ, mà lưu lại "Nhật Ký Cầm Chuột (Reference Log)" trỏ vào bất cứu hành tung vớ vẩn nào bạn thâm táng ở \`HEAD\`.

Hãy gõ liền:
\`\`\`bash
git reflog
\`\`\`
Màn hình xổ ra một vệt tăm dài đằng đặc lịch sử của những di biến. Ngay trên cùng bạn sẽ thấy dòng chữ đánh dấu \`HEAD@{1}\` nơi mà Con Trỏ đang đứng yên an tịnh nửa phút trước... trước khi bạn ấn lệnh Tử Hình!

Bạn tóm nhanh lấy Mã ID \`a3d0v8\` của phút huy hoàng đó và kéo cả Thế Kỷ Trở Ngược lại về nơi bình yên:
\`\`\`bash
git reset --hard HEAD@{1}
\`\`\`

Bụi rơi, sấm sét ngưng hoạt động. Mã Source lại xuất hiện sừng sững! Phép màu của \`Reflog\` đã đánh lừa cái chết. 
> *"Hễ Git có Reflog, chư vị chớ hoang mang vô tận!"* 🧙‍♂️`,
        hasPractice: "false",
        order: 5,
      },
      {
        moduleId: mod3_1.id,
        title: "Truy Tìm Mầm Lỗi: git bisect",
        content: `# 🔎 Nét Giao Thuật Nhị Phân - Cán Cân Chống Lỗi (Git Bisect)

Cuốc đời có những sự thật đau lòng: Mã nguồn Web sáng nay tự đứt bóng không hiện chữ To. Sếp gầm rú bắt bạn truy ra Lỗi phát sinh lúc nào? 
Dự án thì có hơn **15,000 cái Commit** đang chồng chéo từ 6 tháng trước do 12 thằng kỹ sư luân phiên gõ.
Bạn sẽ tìm kiếm dòng Test bằng việc Check Check Chờ Check 15 ngàn lần???? Chắc cúp điện chạy lên Sao hỏa là vừa! 😱

## Siêu Phép Diệt Yêu "Bisect"
Git Bisect ra đời để làm trò cắt bánh chia đôi tàn nhẫn tìm bug. Nó dùng "Tìm Kiếm Nhị Phân (Binary Search)".

**Bước 1: Kêu Thằng Đệ Ra**
\`\`\`bash
git bisect start
\`\`\`
**Bước 2: Chỉ Cho Nó Sự Khốn Đốn Này Là Xảy Ra Cuối Cùng (Bản Lỗi Chót)**
\`\`\`bash
git bisect bad
\`\`\`
**Bước 3: Chỉ cho nó Tọa Độ Ánh Sáng Quá Khứ - Nơi Tốt Lành Hoàn Toàn (ví dụ version 1.0 chạy mướt rượt ngàn năm)**
\`\`\`bash
git bisect good v1.0
\`\`\`

Ngay Lập Tức! Bằng nhát dao chuẩn xác, Git Tự Cắt giữa trung tâm lịch sử nhặt ra cái Điểm Chính Giữ (Mốc 7,500) vứt thẳng ra mặt và hỏi bạn: "Sếp check thử cái chỗ đoạn này xem có bị Chữ To hay Bình Thường?".
- Bị Lỗi Tiếp: Gõ \`git bisect bad\`
- Bình Thường Yên Ôn: Gõ \`git bisect good\`

Git tiếp tục Cắt Chia Đôi phần mảng rò rỉ kia nhặt ra con số 3,250.
Cứ Thế, sau vỏn vẹn **chưa tới 10 phát gõ tay** (2^13 > 8000), bạn ghim trúng tim thằng Thủ Phạm Nào Mấy Tháng Trước Đã Code láo. Bạn cap màn hình Đàn Áp Tội Đồ và chốt Bug!

Thật Sự Xứng Đáng Là Thám Tử Conan của Git Phải Không! 🕵️`,
        hasPractice: "false",
        order: 6,
      }
    ]);

    console.log("🎉 Tạo dữ liệu SIÊU CHI TIẾT hoàn tất!");
    process.exit(0);

  } catch (err) {
    console.error("❌ Lỗi:", err);
    process.exit(1);
  }
}

if (process.env.DATABASE_URL) {
  runSeed();
} else {
  console.log("⚠️ DATABASE_URL chưa được thiết lập.");
}
