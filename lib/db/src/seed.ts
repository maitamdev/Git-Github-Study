import { db, coursesTable, modulesTable, lessonsTable, challengesTable } from "./index.js";
import { sql } from "drizzle-orm";

async function runSeed() {
  console.log("🌱 Bắt đầu tạo dữ liệu...");

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
      description: "Học quản lý phiên bản từ con số 0 với các bài thực hành tương tác trên Terminal ảo. Phù hợp cho người mới bắt đầu.",
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
        content: `# Git là gì?

**Git** là một hệ thống quản lý phiên bản phân tán (Distributed Version Control System - DVCS) được tạo bởi **Linus Torvalds** vào năm 2005.

## Tại sao cần dùng Git?

Hãy tưởng tượng bạn đang viết một bài luận văn. Bạn có thể:
- Lưu file \`luanvan_v1.docx\`, \`luanvan_v2.docx\`, \`luanvan_final.docx\`, \`luanvan_final_final.docx\`... 😵
- Hoặc dùng Git để theo dõi **mọi thay đổi** một cách thông minh!

### Lợi ích của Git:
1. **Theo dõi lịch sử**: Xem lại mọi thay đổi đã từng thực hiện
2. **Làm việc nhóm**: Nhiều người cùng code trên 1 dự án mà không xung đột
3. **Branching**: Tạo nhánh riêng để thử nghiệm mà không ảnh hưởng code chính
4. **Backup**: Code được lưu trữ an toàn, không sợ mất

### Thuật ngữ cơ bản:
- **Repository (Repo)**: Kho chứa code và lịch sử thay đổi
- **Commit**: Một "bản chụp" (snapshot) của code tại thời điểm nhất định
- **Branch**: Một nhánh phát triển song song
- **Merge**: Gộp các nhánh lại với nhau`,
        hasPractice: "false",
        order: 1,
      },
      {
        moduleId: mod1_1.id,
        title: "Cài đặt và cấu hình Git",
        content: `# Cài đặt Git

## Trên Windows
1. Tải Git từ [git-scm.com](https://git-scm.com/download/win)
2. Chạy file cài đặt, nhấn Next cho tới khi hoàn tất
3. Mở **Git Bash** hoặc **Terminal** để kiểm tra

## Trên macOS
\`\`\`bash
brew install git
\`\`\`

## Trên Linux (Ubuntu/Debian)
\`\`\`bash
sudo apt-get install git
\`\`\`

## Cấu hình Git lần đầu

Sau khi cài đặt, bạn **bắt buộc** phải thiết lập tên và email:

\`\`\`bash
git config --global user.name "Tên của bạn"
git config --global user.email "email@example.com"
\`\`\`

### Kiểm tra cấu hình:
\`\`\`bash
git config --list
\`\`\`

> 💡 **Mẹo**: Tên và email này sẽ xuất hiện trong mỗi commit bạn tạo.`,
        hasPractice: "false",
        order: 2,
      },
      {
        moduleId: mod1_1.id,
        title: "Thực hành: Tạo Commit đầu tiên",
        content: `# Tạo Commit đầu tiên 🎯

Trong bài này, bạn sẽ thực hành trên Terminal ảo bên dưới.

## Mục tiêu:
Sử dụng lệnh \`git add\` và \`git commit\` để tạo commit đầu tiên.

## Hướng dẫn từng bước:

### Bước 1: Thêm file vào staging area
\`\`\`bash
git add .
\`\`\`
Lệnh này thêm **tất cả** file thay đổi vào "vùng chuẩn bị" (staging area).

### Bước 2: Tạo commit
\`\`\`bash
git commit -m "Commit đầu tiên"
\`\`\`
Lệnh này tạo một "bản chụp" với thông điệp mô tả.

## Thử ngay bên dưới! 👇
Hãy nhập các lệnh trên vào Terminal ảo, rồi bấm **Kiểm tra** để xem kết quả.`,
        hasPractice: "true",
        order: 3,
      },
    ]).returning();

    // Challenge cho lesson 3
    const baseState1 = {
      branches: { main: ["C1"] },
      commits: { C1: { id: "C1", message: "Initial commit", parent: null, parents: [], timestamp: new Date().toISOString() } },
      HEAD: "main",
      currentCommit: "C1",
      stagedFiles: [],
      workingFiles: ["readme.md"],
    };
    const expectedState1 = JSON.parse(JSON.stringify(baseState1));
    expectedState1.commits["C2"] = { id: "C2", message: "Commit đầu tiên", parent: "C1", parents: ["C1"] };
    expectedState1.branches.main.push("C2");
    expectedState1.currentCommit = "C2";

    await db.insert(challengesTable).values({
      lessonId: lesson1_1_3.id,
      goal: "Dùng 'git add .' rồi 'git commit -m \"Commit đầu tiên\"' để lưu thay đổi.",
      hints: ["Gõ 'git add .' trước", "Sau đó gõ 'git commit -m \"Commit đầu tiên\"'"],
      initialState: JSON.stringify(baseState1),
      expectedState: JSON.stringify(expectedState1),
    });

    // Module 1.2: Các lệnh Git cơ bản
    const [mod1_2] = await db.insert(modulesTable).values({
      courseId: course1.id,
      title: "Các lệnh Git cơ bản",
      order: 2,
    }).returning();

    const [lesson1_2_1, lesson1_2_2, lesson1_2_3, lesson1_2_4] = await db.insert(lessonsTable).values([
      {
        moduleId: mod1_2.id,
        title: "git init, git status, git log",
        content: `# Khởi tạo và kiểm tra Repository

## git init - Khởi tạo repo mới
\`\`\`bash
mkdir du-an-moi
cd du-an-moi
git init
\`\`\`
Lệnh \`git init\` tạo một thư mục ẩn \`.git/\` chứa toàn bộ lịch sử.

## git status - Kiểm tra trạng thái
\`\`\`bash
git status
\`\`\`
Lệnh này cho biết:
- File nào đã được sửa đổi
- File nào đang ở staging area
- File nào chưa được theo dõi (untracked)

### Các trạng thái file:
| Trạng thái | Ý nghĩa |
|-----------|---------|
| Untracked | File mới, Git chưa biết |
| Modified | File đã sửa nhưng chưa add |
| Staged | File đã add, sẵn sàng commit |
| Committed | File đã được lưu vào lịch sử |

## git log - Xem lịch sử commit
\`\`\`bash
git log
git log --oneline    # Rút gọn
git log --graph      # Hiển thị dạng cây
\`\`\``,
        hasPractice: "false",
        order: 1,
      },
      {
        moduleId: mod1_2.id,
        title: "git add và git commit chuyên sâu",
        content: `# Hiểu sâu về Add và Commit

## Staging Area là gì?

Staging Area (hay Index) là "vùng trung gian" giữa Working Directory và Repository.

\`\`\`
Working Directory  →  Staging Area  →  Repository
    (git add)           (git commit)
\`\`\`

## Các cách dùng git add:
\`\`\`bash
git add file.txt          # Thêm 1 file cụ thể
git add *.js              # Thêm tất cả file .js
git add .                 # Thêm tất cả thay đổi
git add -p                # Thêm từng phần (interactive)
\`\`\`

## Viết commit message tốt:
\`\`\`bash
# ❌ Sai
git commit -m "fix"
git commit -m "update"

# ✅ Đúng
git commit -m "Sửa lỗi hiển thị menu trên mobile"
git commit -m "Thêm tính năng đăng nhập bằng Google"
\`\`\`

### Quy tắc viết commit message:
1. Bắt đầu bằng động từ: Thêm, Sửa, Xóa, Cập nhật...
2. Ngắn gọn nhưng đủ ý (dưới 72 ký tự)
3. Mô tả **cái gì** đã thay đổi, không phải **tại sao**`,
        hasPractice: "false",
        order: 2,
      },
      {
        moduleId: mod1_2.id,
        title: "git diff và so sánh thay đổi",
        content: `# So sánh thay đổi với git diff

## Xem thay đổi chưa staged:
\`\`\`bash
git diff
\`\`\`

## Xem thay đổi đã staged (sắp commit):
\`\`\`bash
git diff --staged
\`\`\`

## So sánh giữa 2 commit:
\`\`\`bash
git diff abc123 def456
\`\`\`

## Đọc output của git diff:
\`\`\`diff
--- a/file.txt
+++ b/file.txt
@@ -1,3 +1,4 @@
 Dòng không đổi
-Dòng bị xóa (màu đỏ)
+Dòng được thêm (màu xanh)
+Dòng mới hoàn toàn
\`\`\`

- Dòng bắt đầu bằng \`-\` → đã bị **xóa**
- Dòng bắt đầu bằng \`+\` → đã được **thêm**
- Dòng không có ký hiệu → **không đổi**`,
        hasPractice: "false",
        order: 3,
      },
      {
        moduleId: mod1_2.id,
        title: "Thực hành: Tạo nhiều commit",
        content: `# Thực hành: Tạo nhiều commit 🎯

Trong bài này, bạn sẽ thực hành tạo nhiều commit liên tiếp.

## Mục tiêu:
Tạo **2 commit** trên nhánh main.

## Hướng dẫn:

### Commit 1:
\`\`\`bash
git add .
git commit -m "Thêm trang chủ"
\`\`\`

### Commit 2:
\`\`\`bash
git add .
git commit -m "Thêm trang giới thiệu"
\`\`\`

Quan sát **Git Graph** bên phải để thấy chuỗi commit hình thành! 👇`,
        hasPractice: "true",
        order: 4,
      },
    ]).returning();

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
      hints: ["Gõ 'git add .' rồi 'git commit -m \"Thêm trang chủ\"'", "Lặp lại thêm 1 lần với message khác"],
      initialState: JSON.stringify(baseState2),
      expectedState: JSON.stringify(expectedState2),
    });

    // Module 1.3: Branch và Merge
    const [mod1_3] = await db.insert(modulesTable).values({
      courseId: course1.id,
      title: "Nhánh (Branch) và Gộp (Merge)",
      order: 3,
    }).returning();

    const [lesson1_3_1, lesson1_3_2, lesson1_3_3] = await db.insert(lessonsTable).values([
      {
        moduleId: mod1_3.id,
        title: "Hiểu về Branch trong Git",
        content: `# Branch - Nhánh trong Git

## Branch là gì?
Branch (nhánh) cho phép bạn **phát triển tính năng mới** mà không ảnh hưởng code chính.

Hãy tưởng tượng nhánh như **phiên bản song song** của dự án:

\`\`\`
main ────●────●────●  (code ổn định)
              \\
feature ───────●────●  (code đang phát triển)
\`\`\`

## Các lệnh quan trọng:

### Xem danh sách nhánh:
\`\`\`bash
git branch           # Liệt kê nhánh local
git branch -a        # Liệt kê cả nhánh remote
\`\`\`

### Tạo nhánh mới:
\`\`\`bash
git branch feature-login
\`\`\`

### Chuyển sang nhánh khác:
\`\`\`bash
git checkout feature-login
# hoặc (Git mới)
git switch feature-login
\`\`\`

### Tạo + chuyển nhánh cùng lúc:
\`\`\`bash
git checkout -b feature-login
# hoặc
git switch -c feature-login
\`\`\`

> 💡 **Quy tắc đặt tên nhánh**: Dùng tiền tố như \`feature/\`, \`fix/\`, \`hotfix/\` để phân loại.`,
        hasPractice: "false",
        order: 1,
      },
      {
        moduleId: mod1_3.id,
        title: "Merge - Gộp nhánh",
        content: `# Merge - Gộp nhánh lại

## Khi nào cần merge?
Khi bạn đã hoàn thành tính năng trên nhánh riêng và muốn đưa code vào nhánh chính.

## Cách merge:
\`\`\`bash
# 1. Chuyển về nhánh chính
git checkout main

# 2. Gộp nhánh feature vào
git merge feature-login
\`\`\`

## Các loại merge:

### Fast-forward merge (gộp nhanh):
Khi nhánh chính **không có commit mới** kể từ khi tạo nhánh:
\`\`\`
Trước:  main ●────●
              \\
        feat   ●────●

Sau:    main ●────●────●────●
\`\`\`

### 3-way merge (gộp 3 bước):
Khi **cả hai nhánh đều có commit mới**:
\`\`\`
Trước:  main ●────●────●
              \\
        feat   ●────●

Sau:    main ●────●────●────⬤ (merge commit)
              \\           /
        feat   ●────●────
\`\`\`

## Xử lý xung đột (Conflict):
Khi cùng 1 dòng code bị sửa ở 2 nhánh, Git sẽ báo conflict:
\`\`\`
<<<<<<< HEAD
Code từ nhánh hiện tại
=======
Code từ nhánh được merge
>>>>>>> feature-login
\`\`\`
Bạn cần **chọn giữ code nào** rồi commit lại.`,
        hasPractice: "false",
        order: 2,
      },
      {
        moduleId: mod1_3.id,
        title: "Thực hành: Tạo và gộp nhánh",
        content: `# Thực hành: Branch & Merge 🎯

## Mục tiêu:
Tạo nhánh mới, commit trên đó, rồi gộp lại vào main.

## Các bước:

### Bước 1: Tạo nhánh mới
\`\`\`bash
git checkout -b feature
\`\`\`

### Bước 2: Commit trên nhánh mới
\`\`\`bash
git add .
git commit -m "Thêm tính năng mới"
\`\`\`

### Bước 3: Quay lại main và merge
\`\`\`bash
git checkout main
git merge feature
\`\`\`

Quan sát Git Graph thay đổi ở mỗi bước! 👇`,
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
      hints: ["Gõ 'git checkout -b feature'", "Gõ 'git add .' rồi 'git commit -m \"Thêm tính năng mới\"'", "Gõ 'git checkout main' rồi 'git merge feature'"],
      initialState: JSON.stringify(baseState3),
    });

    // =============================================
    // KHÓA HỌC 2: GitHub và Làm Việc Nhóm
    // =============================================
    const [course2] = await db.insert(coursesTable).values({
      title: "GitHub - Làm Việc Nhóm Hiệu Quả",
      description: "Tìm hiểu GitHub, Push/Pull, Pull Request và quy trình làm việc nhóm chuyên nghiệp.",
      level: "intermediate",
      imageUrl: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      order: 2,
    }).returning();
    console.log(`✅ Tạo khóa học: ${course2.title}`);

    // Module 2.1: GitHub cơ bản
    const [mod2_1] = await db.insert(modulesTable).values({
      courseId: course2.id,
      title: "Làm quen GitHub",
      order: 1,
    }).returning();

    await db.insert(lessonsTable).values([
      {
        moduleId: mod2_1.id,
        title: "GitHub là gì? Repository trên cloud",
        content: `# GitHub là gì?

**GitHub** là nền tảng lưu trữ code trên cloud, sử dụng Git làm nền tảng.

## GitHub vs Git:
| | Git | GitHub |
|--|-----|--------|
| Loại | Phần mềm | Dịch vụ web |
| Chạy ở | Máy tính cá nhân | Cloud (Internet) |
| Mục đích | Quản lý phiên bản | Chia sẻ & Cộng tác |
| Giá | Miễn phí mãi mãi | Miễn phí + Có gói trả phí |

## Tạo tài khoản GitHub:
1. Vào [github.com](https://github.com)
2. Bấm **Sign up**
3. Nhập email, password, username
4. Xác nhận email

## Tạo Repository trên GitHub:
1. Bấm nút **+** → **New repository**
2. Đặt tên repo
3. Chọn Public hoặc Private
4. Có thể thêm README, .gitignore
5. Bấm **Create repository**

> 💡 **Public** = ai cũng xem được | **Private** = chỉ bạn và người được mời`,
        hasPractice: "false",
        order: 1,
      },
      {
        moduleId: mod2_1.id,
        title: "git clone, git push, git pull",
        content: `# Clone, Push, Pull - Ba lệnh cốt lõi

## git clone - Tải repo về máy
\`\`\`bash
git clone https://github.com/username/repo.git
\`\`\`
Clone = tải **toàn bộ** repo (code + lịch sử) về máy tính.

## git push - Đẩy code lên GitHub
\`\`\`bash
git push origin main
\`\`\`
Push = đẩy các commit **từ máy lên** GitHub.

## git pull - Kéo code mới về
\`\`\`bash
git pull origin main
\`\`\`
Pull = kéo các commit **từ GitHub xuống** máy.

## Quy trình làm việc:
\`\`\`
1. git pull     ← Cập nhật code mới nhất
2. Code, sửa, thêm...
3. git add .    ← Thêm thay đổi
4. git commit   ← Lưu thay đổi
5. git push     ← Đẩy lên GitHub
\`\`\`

## Remote là gì?
Remote = địa chỉ server lưu code (thường là GitHub).
\`\`\`bash
git remote -v                    # Xem remote hiện tại
git remote add origin URL        # Thêm remote mới
\`\`\``,
        hasPractice: "false",
        order: 2,
      },
      {
        moduleId: mod2_1.id,
        title: "Pull Request là gì?",
        content: `# Pull Request (PR)

## Pull Request là gì?
PR là **yêu cầu gộp code** từ nhánh của bạn vào nhánh chính. Đây là cách làm việc nhóm **chuyên nghiệp** nhất.

## Quy trình Pull Request:

### 1. Tạo nhánh và code
\`\`\`bash
git checkout -b feature/them-navbar
# ... code ...
git add .
git commit -m "Thêm navbar responsive"
git push origin feature/them-navbar
\`\`\`

### 2. Mở PR trên GitHub
1. Vào trang repo trên GitHub
2. Bấm **"Compare & pull request"**
3. Viết tiêu đề và mô tả
4. Chọn người review
5. Bấm **"Create pull request"**

### 3. Review code
- Đồng đội xem code, để comment
- Thảo luận, sửa đổi nếu cần
- Approve khi đã ổn

### 4. Merge PR
- Bấm **"Merge pull request"**
- Code được gộp vào nhánh chính
- Xóa nhánh feature (tùy chọn)

> 💡 **PR giúp code sạch hơn** vì bắt buộc phải review trước khi merge!`,
        hasPractice: "false",
        order: 3,
      },
    ]);

    // Module 2.2: Làm việc nhóm
    const [mod2_2] = await db.insert(modulesTable).values({
      courseId: course2.id,
      title: "Quy trình làm việc nhóm",
      order: 2,
    }).returning();

    await db.insert(lessonsTable).values([
      {
        moduleId: mod2_2.id,
        title: "Git Flow - Quy trình chuẩn",
        content: `# Git Flow - Quy Trình Làm Việc Chuẩn

## Các nhánh chính:
- **main** (hoặc master): Code đang chạy trên production
- **develop**: Code đang phát triển, chưa release

## Các nhánh phụ:
- **feature/***: Phát triển tính năng mới
- **hotfix/***: Sửa lỗi khẩn cấp trên production
- **release/***: Chuẩn bị release phiên bản mới

## Quy trình:
\`\`\`
1. Tạo nhánh feature từ develop
2. Code tính năng trên nhánh feature
3. Tạo PR từ feature → develop
4. Review và merge PR
5. Khi đủ tính năng, tạo nhánh release
6. Test trên release branch
7. Merge release → main (và develop)
8. Tag version trên main
\`\`\`

## Ví dụ thực tế:
\`\`\`bash
# 1. Bắt đầu tính năng mới
git checkout develop
git checkout -b feature/dang-nhap

# 2. Code và commit
git add .
git commit -m "Thêm form đăng nhập"
git push origin feature/dang-nhap

# 3. Tạo Pull Request trên GitHub
# 4. Sau khi review → Merge vào develop
\`\`\``,
        hasPractice: "false",
        order: 1,
      },
      {
        moduleId: mod2_2.id,
        title: ".gitignore và quản lý file",
        content: `# .gitignore - Bỏ qua file không cần thiết

## .gitignore là gì?
File \`.gitignore\` nói cho Git biết những file/thư mục nào **không cần theo dõi**.

## Tạo .gitignore:
Tạo file \`.gitignore\` ở thư mục gốc dự án:
\`\`\`
# Dependencies
node_modules/
vendor/

# Build output
dist/
build/

# Environment variables (BÍ MẬT!)
.env
.env.local

# IDE settings
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
\`\`\`

## Tại sao cần .gitignore?
1. **Bảo mật**: Không push mật khẩu, API key lên GitHub
2. **Dung lượng**: node_modules có thể nặng hàng trăm MB
3. **Sạch sẽ**: Chỉ theo dõi code thực sự quan trọng

> ⚠️ **QUAN TRỌNG**: File \`.env\` chứa mật khẩu, API key. **TUYỆT ĐỐI** không push lên GitHub!`,
        hasPractice: "false",
        order: 2,
      },
    ]);

    // =============================================
    // KHÓA HỌC 3: Git Nâng Cao
    // =============================================
    const [course3] = await db.insert(coursesTable).values({
      title: "Git Nâng Cao - Kỹ Năng Pro",
      description: "Rebase, Cherry-pick, Stash, Reset và các kỹ thuật Git nâng cao dành cho developer chuyên nghiệp.",
      level: "advanced",
      imageUrl: "https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png",
      order: 3,
    }).returning();
    console.log(`✅ Tạo khóa học: ${course3.title}`);

    const [mod3_1] = await db.insert(modulesTable).values({
      courseId: course3.id,
      title: "Các lệnh nâng cao",
      order: 1,
    }).returning();

    await db.insert(lessonsTable).values([
      {
        moduleId: mod3_1.id,
        title: "git rebase - Viết lại lịch sử",
        content: `# Git Rebase

## Rebase vs Merge:
- **Merge**: Giữ nguyên lịch sử, tạo merge commit
- **Rebase**: "Di chuyển" nhánh lên đầu nhánh khác, lịch sử thẳng hàng

## Cách dùng:
\`\`\`bash
# Đang ở nhánh feature
git rebase main
\`\`\`

### Trước rebase:
\`\`\`
main     ●────●────●
              \\
feature        ●────●
\`\`\`

### Sau rebase:
\`\`\`
main     ●────●────●
                    \\
feature              ●────●
\`\`\`

## Interactive Rebase:
\`\`\`bash
git rebase -i HEAD~3   # Chỉnh sửa 3 commit gần nhất
\`\`\`
Cho phép:
- **pick**: Giữ nguyên commit
- **reword**: Sửa message
- **squash**: Gộp vào commit trước
- **drop**: Xóa commit

> ⚠️ **KHÔNG rebase commit đã push** lên remote! Sẽ gây rối cho đồng đội.`,
        hasPractice: "false",
        order: 1,
      },
      {
        moduleId: mod3_1.id,
        title: "git stash - Cất code tạm",
        content: `# Git Stash - Cất Tạm Thay Đổi

## Khi nào cần stash?
Bạn đang code dở nhưng cần chuyển sang nhánh khác gấp.

## Cách dùng:
\`\`\`bash
# Cất tạm thay đổi
git stash

# Xem danh sách stash
git stash list

# Lấy lại thay đổi gần nhất
git stash pop

# Lấy lại nhưng không xóa khỏi stash
git stash apply

# Xóa stash
git stash drop
\`\`\`

## Stash với message:
\`\`\`bash
git stash push -m "Đang làm dở form đăng nhập"
\`\`\`

## Thực tế:
\`\`\`bash
# 1. Đang code tính năng A
# 2. Sếp bảo sửa bug gấp!
git stash
git checkout hotfix
# 3. Sửa bug xong
git checkout feature
git stash pop
# 4. Tiếp tục code tính năng A
\`\`\``,
        hasPractice: "false",
        order: 2,
      },
      {
        moduleId: mod3_1.id,
        title: "git reset và git revert",
        content: `# Hoàn tác thay đổi

## git reset - Quay lại commit trước
\`\`\`bash
# Soft: giữ thay đổi ở staging area
git reset --soft HEAD~1

# Mixed (mặc định): giữ thay đổi ở working directory
git reset HEAD~1

# Hard: XÓA HOÀN TOÀN thay đổi ⚠️
git reset --hard HEAD~1
\`\`\`

## git revert - Tạo commit ngược
\`\`\`bash
git revert abc123
\`\`\`
Revert **tạo commit mới** để đảo ngược thay đổi, **an toàn hơn** reset.

## So sánh Reset vs Revert:

| | Reset | Revert |
|--|-------|--------|
| Cách hoạt động | Xóa commit | Tạo commit mới đảo ngược |
| Lịch sử | Bị thay đổi | Được giữ nguyên |
| Dùng khi | Chưa push | Đã push lên remote |
| An toàn | ⚠️ Nguy hiểm | ✅ An toàn |

> 💡 **Quy tắc**: Đã push → dùng \`revert\`. Chưa push → dùng \`reset\`.`,
        hasPractice: "false",
        order: 3,
      },
    ]);

    console.log("🎉 Tạo dữ liệu hoàn tất!");
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
