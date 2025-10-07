# Hybrid-Work

นางสาว ชฎาพร พินิจสัย 653450281-9

คุณสมบัติหลักของระบบ
- เข้าสู่ระบบ (ไม่มีสมัครสมาชิก): หน้า Sign In เรียก `POST /signin` ด้วย `x-api-key` เพื่อรับ JWT แล้วเก็บไว้ใช้งาน
- ฟีดสถานะ (Feed):
  - ดูโพสต์ทั้งหมด `GET /status`
  - โพสต์ข้อความใหม่ `POST /status`
  - กดไลค์/ยกเลิกไลค์ `POST /like` และ `DELETE /like` (สำรอง `DELETE /unlike`)
  - คอมเมนต์โพสต์ `POST /comment`
- แสดงชื่อผู้โพสต์/ผู้คอมเมนต์: ใช้อีเมลจากฟิลด์ `createdBy.email` ที่มากับ API
- นับจำนวนไลค์/คอมเมนต์จากข้อมูลจริง: ไลค์นับจากความยาวของ `like[]`
- ดูสมาชิกตามชั้นปี: ปุ่ม “สมาชิก” มุมขวาบน ไปหน้า `GET /class/{ปีที่ศึกษา}` และมีช่องกรอกปี (ค่าเริ่มต้นจาก `profile.education.enrollmentYear` หากมี)

โครงสร้างและไฟล์สำคัญ
- `App.js` — ควบคุม flow ระหว่าง SignIn, Feed และหน้า สมาชิกชั้นปี (มีปุ่ม “สมาชิก/กลับ” บนขวา)
- `src/api/client.js` — ฟังก์ชันเรียก API: signin, profile, status, like/unlike, comment, class by year
- `src/screens/SignInScreen.js` — หน้าล็อกอิน
- `src/screens/FeedScreen.js` — หน้า Feed (โพสต์/ไลค์/คอมเมนต์ พร้อมอัปเดตแบบ optimistic)
- `src/screens/ClassMembersScreen.js` — หน้าแสดงสมาชิกตามปีที่ศึกษา
- `src/components/StatusItem.js`, `src/components/StatusComposer.js`, `src/components/Avatar.js` — คอมโพเนนต์แยกส่วนของโพสต์/อินพุต/รูปโปรไฟล์
- `CIS-Classroom-API.md`, `API_DOCUMENTATION.md` — สรุปและอ้างอิงเอกสาร API

การตั้งค่าและรัน
1) ตั้งค่าไฟล์ `.env`
```
API_BASE_URL=https://cis.kku.ac.th/api/classroom
API_KEY=<ใส่ค่า x-api-key ของคุณ>
```
2) ติดตั้งและรัน
```
npm install
npm run start   # หรือ npm run android / ios / web
```
3) แคชมีปัญหาให้เคลียร์ด้วย `expo start -c`

หมายเหตุด้าน API
- ระบบใช้ Header ผสม: `x-api-key` และ `Authorization: Bearer <token>`
- บางสภาพแวดล้อมรองรับ `DELETE /like` สำหรับ unlike แต่มีสำรองไป `DELETE /unlike` หากจำเป็น