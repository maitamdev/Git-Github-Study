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
        videoUrl: "https://www.youtube.com/watch?v=0fKg7e37bQE",
        content: `# Git là gì?

**Git** là một hệ thống quản lý phiên bản phân tán (Distributed Version Control System - DVCS).

## Tại sao cần dùng Git?
1. **Theo dõi lịch sử**: Xem lại mọi thay đổi đã từng thực hiện
2. **Làm việc nhóm**: Nhiều người cùng code trên 1 dự án mà không xung đột
3. **Branching**: Tạo nhánh riêng để thử nghiệm mà không ảnh hưởng code chính
4. **Backup**: Code được lưu trữ an toàn, không sợ mất`,
        hasPractice: "false",
        order: 1,
      },
      {
        moduleId: mod1_1.id,
        title: "Cài đặt và cấu hình Git",
        videoUrl: "https://www.youtube.com/watch?v=0fKg7e37bQE",
        content: `# Cài đặt Git

## Cấu hình Git lần đầu

Sau khi cài đặt, bạn **bắt buộc** phải thiết lập tên và email:

\`\`\`bash
git config --global user.name "Tên của bạn"
git config --global user.email "email@example.com"
\`\`\`

### Kiểm tra cấu hình:
\`\`\`bash
git config --list
\`\`\``,
        hasPractice: "false",
        order: 2,
      },
      {
        moduleId: mod1_1.id,
        title: "Thực hành: Tạo Commit đầu tiên",
        videoUrl: "https://www.youtube.com/watch?v=0fKg7e37bQE",
        content: `# Tạo Commit đầu tiên 🎯

Trong bài này, bạn sẽ thực hành khởi tạo project.

### Bước 1: Khởi tạo Repo
\`\`\`bash
git init
\`\`\`

### Bước 2: Thêm file vào staging area
\`\`\`bash
git add .
\`\`\`

### Bước 3: Tạo commit
\`\`\`bash
git commit -m "Commit đầu tiên"
\`\`\`

## Thử ngay bên dưới! 👇`,
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
      hints: ["Gõ 'git init'", "Gõ 'git add .'", "Gõ 'git commit -m \"Commit đầu tiên\"'"],
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
        videoUrl: "https://www.youtube.com/watch?v=8JJ101D3knE",
        content: `# Khởi tạo và kiểm tra Repository

## git status - Kiểm tra trạng thái
\`\`\`bash
git status
\`\`\`
Lệnh này cho biết file đang ở trạng thái nào.

## git log - Xem lịch sử commit
\`\`\`bash
git log
git log --oneline
\`\`\``,
        hasPractice: "true",
        order: 1,
      },
      {
        moduleId: mod1_2.id,
        title: "git add và git commit chuyên sâu",
        videoUrl: "https://www.youtube.com/watch?v=8JJ101D3knE",
        content: `# Hiểu sâu về Add và Commit

## Staging Area là gì?
Staging Area (hay Index) là "vùng trung gian" giữa Working Directory và Repository.

## Các cách dùng git add:
\`\`\`bash
git add file.txt          # Thêm 1 file cụ thể
git add .                 # Thêm tất cả thay đổi
\`\`\``,
        hasPractice: "false",
        order: 2,
      },
      {
        moduleId: mod1_2.id,
        title: "git diff và so sánh thay đổi",
        videoUrl: "https://www.youtube.com/watch?v=8JJ101D3knE",
        content: `# So sánh thay đổi với git diff

## Xem thay đổi chưa staged:
\`\`\`bash
git diff
\`\`\`

## Xem thay đổi đã staged (sắp commit):
\`\`\`bash
git diff --staged
\`\`\``,
        hasPractice: "false",
        order: 3,
      },
      {
        moduleId: mod1_2.id,
        title: "Thực hành: Tạo nhiều commit",
        videoUrl: "https://www.youtube.com/watch?v=8JJ101D3knE",
        content: `# Thực hành: Tạo nhiều commit 🎯

Trong bài này, bạn sẽ thực hành tạo nhiều commit liên tiếp.

### Commit 1:
\`\`\`bash
git add .
git commit -m "Thêm trang chủ"
\`\`\`

### Commit 2:
\`\`\`bash
git add .
git commit -m "Thêm trang giới thiệu"
\`\`\``,
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
      hints: ["Gõ 'git status' để xem các file chưa được add.", "Gõ 'git log' để xem lịch sử 2 commit."],
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
      hints: ["Gõ 'git add .' rồi 'git commit -m \"Thêm trang chủ\"'", "Lặp lại: 'git add .' và 'git commit -m \"Thêm trang giới thiệu\"'"],
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
        videoUrl: "https://www.youtube.com/watch?v=Jte2Bnheys0",
        content: `# Branch - Nhánh trong Git

## Branch là gì?
Branch (nhánh) cho phép bạn **phát triển tính năng mới** mà không ảnh hưởng code chính.

## Các lệnh quan trọng:

### Mở/Tạo nhánh:
\`\`\`bash
git branch feature
git checkout feature
# Hoặc
git switch -c feature
\`\`\``,
        hasPractice: "false",
        order: 1,
      },
      {
        moduleId: mod1_3.id,
        title: "Merge - Gộp nhánh",
        videoUrl: "https://www.youtube.com/watch?v=Jte2Bnheys0",
        content: `# Merge - Gộp nhánh lại

## Cách merge:
\`\`\`bash
# 1. Chuyển về nhánh chính
git checkout main

# 2. Gộp nhánh feature vào
git merge feature
\`\`\``,
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
        videoUrl: "https://www.youtube.com/watch?v=RGOj5yH7evk",
        content: `# GitHub là gì?

**GitHub** là nền tảng lưu trữ code trên cloud, sử dụng Git làm nền tảng.

## GitHub vs Git:
| | Git | GitHub |
|--|-----|--------|
| Loại | Phần mềm | Dịch vụ web |
| Chạy ở | Máy tính cá nhân | Cloud (Internet) |
| Mục đích | Quản lý phiên bản | Chia sẻ & Cộng tác |`,
        hasPractice: "false",
        order: 1,
      },
      {
        moduleId: mod2_1.id,
        title: "git clone, git push, git pull",
        videoUrl: "https://www.youtube.com/watch?v=RGOj5yH7evk",
        content: `# Clone, Push, Pull - Ba lệnh cốt lõi

## Kéo mã về máy
\`\`\`bash
git pull origin main
\`\`\`

## Đẩy code lên GitHub
\`\`\`bash
git push origin main
\`\`\``,
        hasPractice: "true",
        order: 2,
      },
      {
        moduleId: mod2_1.id,
        title: "Pull Request là gì?",
        videoUrl: "https://www.youtube.com/watch?v=RGOj5yH7evk",
        content: `# Pull Request (PR)

PR là **yêu cầu gộp code** từ nhánh của bạn vào nhánh chính.`,
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
    
    // Tìm lesson 2.1.2 bằng cách query
    const [lessonPush] = await db.select().from(lessonsTable).where(sql`${lessonsTable.title} = 'git clone, git push, git pull'`).limit(1);
    if(lessonPush) {
      await db.insert(challengesTable).values({
        lessonId: lessonPush.id,
        goal: "Đẩy code mới của bạn lên GitHub.",
        hints: ["Gõ 'git push origin main'"],
        initialState: JSON.stringify(baseStatePush),
      });
    }

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

    // Module 2.3: Xử lý xung đột & Open Source
    const [mod2_3] = await db.insert(modulesTable).values({
      courseId: course2.id,
      title: "Xử lý xung đột & Open Source",
      order: 3,
    }).returning();

    await db.insert(lessonsTable).values([
      {
        moduleId: mod2_3.id,
        title: "Merge Conflict - Kẻ thù hay Người bạn?",
        content: `# Xử Lý Xung Đột (Merge Conflict)

## Tại sao có Conflict?
Conflict xảy ra khi 2 nhánh cùng sửa một dòng code, Git không biết chọn cái nào nên để lại các marker cảnh báo.

## Cách giải quyết
1. Mở file bị lỗi, tìm các dấu \`<<<<<<<\`, \`=======\`, \`>>>>>>>\`.
2. Giữ lại phần đúng, xóa các dòng đánh dấu của Git.
3. Chạy lệnh:
\`\`\`bash
git add file_da_sua.txt
git commit -m "Fix merge conflict"
\`\`\`
`,
        hasPractice: "false",
        order: 1,
      },
      {
        moduleId: mod2_3.id,
        title: "Đóng góp Open Source (Fork & PR)",
        content: `# Phân Nhánh Dự Án Bằng Fork

## Fork là gì?
Tạo một bản sao dự án của người khác về tài khoản của mình.

## Đóng góp mã nguồn:
1. Fork dự án gốc
2. Clone repo vừa Fork về
3. Sửa code, Push lên repo của bạn
4. Tạo Pull Request sang repo gốc!`,
        hasPractice: "false",
        order: 2,
      }
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
      {
        moduleId: mod3_1.id,
        title: "git cherry-pick - Lấy commit bất kì",
        content: `# Nhặt Lấy Commit Với git cherry-pick

## Công dụng
Thêm một commit cụ thể vào nhánh hiện tại, rất tốt để lấy đúng một tính năng hoặc bản vá lỗi ở nhánh khác mà không cần merge cả nhánh.

## Cú pháp
\`\`\`bash
git cherry-pick <commit-hash>
\`\`\`
`,
        hasPractice: "false",
        order: 4,
      },
      {
        moduleId: mod3_1.id,
        title: "git reflog - Bùa hồi sinh",
        content: `# Khôi Phục Dữ Liệu Với git reflog

## Reflog là gì?
Git Reference Log - Lịch sử của mọi thay đổi xảy ra đối với con trỏ HEAD.

## Cú pháp
\`\`\`bash
git reflog
\`\`\`

Bạn có thể tìm lại bất cứ thay đổi nào, kể cả những commit đã bị xóa khi thực hiện \`git reset --hard\`!
`,
        hasPractice: "false",
        order: 5,
      },
      {
        moduleId: mod3_1.id,
        title: "git bisect - Truy tìm lỗi lầm",
        content: `# Tìm Bug Cực Nhanh Bằng git bisect

## Nguyên lý
Bisect sử dụng thuật toán tìm kiếm nhị phân để duyệt qua lịch sử commit và giúp bạn cô lập xem commit nào đã làm hỏng code.

## Cách chạy
\`\`\`bash
git bisect start
git bisect bad         # Phiên bản hiện tại bị lỗi
git bisect good v1.0   # Phiên bản v1.0 chắc chắn chạy tốt
\`\`\`

Sau đó Git tự động checkout các commit ở giữa, bạn chỉ việc kiểm tra và báo cáo git nó bad hay good!
`,
        hasPractice: "false",
        order: 6,
      }
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
