# Classroom API (cis.kku.ac.th)

ภาพรวมอย่างย่อของเอกสาร API จาก https://cis.kku.ac.th/api/docs เพื่อให้เข้าใจและใช้งานได้เร็วขึ้น

## Overview
- Title: Classroom API
- Version: 1.0.0
- Base URLs:
  - Development: `http://localhost:3000/api/classroom`
  - Production: `https://cis.kku.ac.th/api/classroom`
- ขอบเขตการใช้งาน: จัดการข้อมูลห้องเรียน/ชุมชน เช่น สถานะโพสต์ ไลค์ คอมเมนต์ โปรไฟล์ ผู้สอน โรงเรียน บริษัท ฯลฯ

## Authentication
- ใช้แบบผสมตาม `security` ของแต่ละ endpoint:
  - `ApiKeyAuth` — ส่งคีย์ใน Header: `x-api-key: <your-api-key>`
  - `BearerAuth` — ส่ง JWT ใน Header: `Authorization: Bearer <access_token>`
- ส่วนใหญ่ต้องใช้ทั้งสองแบบ ยกเว้น `/signin` ที่ใช้เฉพาะ `ApiKeyAuth`

ตัวอย่าง Header ที่มักต้องใช้ร่วมกัน
```
Authorization: Bearer <token>
x-api-key: <your-api-key>
Content-Type: application/json
```

## Errors
- โครงสร้าง error พื้นฐาน: `{ "error": string }` (ดู `ErrorResponse`)
- อาจพบ: 400 (Bad request), 401 (Unauthorized), 404 (Not found), 500 (Internal server error)

## การล็อกอิน
- POST `/signin` (Authentication)
  - Auth: `ApiKeyAuth`
  - Request body (JSON):
    - `email` (string, required)
    - `password` (string, required)
  - Response 200: `SignInResponse`
    - ตัวอย่างจะมี `data.token` (JWT), และข้อมูลผู้ใช้เบื้องต้น

ตัวอย่าง curl
```
curl -X POST "https://cis.kku.ac.th/api/classroom/signin" \
  -H "x-api-key: <your-api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

## โปรไฟล์ (Profile)
- GET `/profile`
  - Auth: `ApiKeyAuth`, `BearerAuth`
  - Response 200: `ProfileResponse` (ห่อ `User`)
- PATCH `/profile`
  - Auth: `ApiKeyAuth`, `BearerAuth`
  - Request body (JSON): `ProfileUpdateRequest`
    - `firstname` (string)
    - `lastname` (string)
    - `studentId` (string)
  - หมายเหตุ: ระบบคำนวณ `enrollmentYear` อัตโนมัติหาก `studentId` ยาว 10–11 ตัวอักษร
  - Response 200: `ProfileResponse`

## สถานะ (Status)
- GET `/status`
  - ดึงรายการสถานะทั้งหมด
  - Auth: `ApiKeyAuth`, `BearerAuth`
  - Response 200: `StatusListResponse`
- POST `/status`
  - สร้างสถานะใหม่
  - Auth: `ApiKeyAuth`, `BearerAuth`
  - Request body: `StatusCreateRequest`
    - `content` (string, required)
  - Response 200: `StatusResponse`
- GET `/status/{id}`
  - ดึงสถานะตาม ID
  - Auth: `ApiKeyAuth`, `BearerAuth`
  - Response 200: `StatusResponse`
- DELETE `/status/{id}`
  - ลบสถานะตาม ID
  - Auth: `ApiKeyAuth`, `BearerAuth`
  - Response 200: วัตถุว่าง (object)

## ไลค์ (Like)
- POST `/like`
  - กดไลค์สถานะ
  - Auth: `ApiKeyAuth`, `BearerAuth`
  - Request body: `LikeRequest`
    - `statusId` (string, required)
- DELETE `/like`
  - ยกเลิกไลค์สถานะ (รูปแบบเดียวกับ `unlike`)
  - Auth: `ApiKeyAuth`, `BearerAuth`
  - Request body: `LikeRequest`
- DELETE `/unlike`
  - ยกเลิกไลค์สถานะ
  - Auth: `ApiKeyAuth`, `BearerAuth`
  - Request body: `LikeRequest`
  - Response 200: `StatusResponse`

## คอมเมนต์ (Comment)
- POST `/comment`
  - เพิ่มคอมเมนต์ในสถานะ
  - Auth: `ApiKeyAuth`, `BearerAuth`
  - Request body: `CommentCreateRequest`
    - `content` (string, required)
    - `statusId` (string, required)
  - Response 200: `StatusResponse`
- DELETE `/comment/{id}`
  - ลบคอมเมนต์ตาม ID
  - Auth: `ApiKeyAuth`, `BearerAuth`
  - Request body: `CommentDeleteRequest` (ตามสเปคกำหนดไว้ แม้จะเป็น DELETE)
  - Response 200: วัตถุว่าง (object)

## บริษัท (Company)
- GET `/company`
  - ดึงรายชื่อบริษัททั้งหมด
  - Auth: `ApiKeyAuth`, `BearerAuth`
  - Response 200: `CompanyListResponse`
- GET `/company/{id}`
  - ดึงข้อมูลบริษัทตาม ID
  - Auth: `ApiKeyAuth`, `BearerAuth`
  - Response 200: `CompanyResponse`

## โรงเรียน (School)
- GET `/school`
  - ดึงรายชื่อโรงเรียนทั้งหมด
  - Auth: `ApiKeyAuth`, `BearerAuth`
  - Response 200: `SchoolListResponse`
- GET `/school/{id}`
  - ดึงข้อมูลโรงเรียนตาม ID
  - Auth: `ApiKeyAuth`, `BearerAuth`
  - Response 200: `SchoolResponse`

## ผู้สอน (Teacher)
- GET `/teacher`
  - ดึงรายชื่อผู้สอนทั้งหมด
  - Auth: `ApiKeyAuth`, `BearerAuth`
  - Response 200: `TeacherListResponse`

## ชั้นปี/รุ่น (Class)
- GET `/class/{id}`
  - ดึงผู้ใช้ตามปีที่เข้าศึกษา (enrollment year)
  - Auth: `ApiKeyAuth`, `BearerAuth`
  - Response 200: `ClassResponse` (array ของ `User`)

---

## โครงสร้างข้อมูลสำคัญ (Schemas)
- `User`
  - คีย์หลัก: `_id`, `firstname`, `lastname`, `email`, `role`, `type`, `confirmed`, `education`, `job[]`, `image`, `createdAt`, `updatedAt`
- `Status`
  - คีย์หลัก: `_id`, `content`, `createdBy`, `comment[]`, `like[]`, `likeCount`, `hasLiked`, `createdAt`, `updatedAt`
- `Company` / `School`
  - คีย์หลัก: `_id`, `name`, `province`, `logo`, `createdAt`, `updatedAt`
- `Teacher`
  - คีย์หลัก: `_id`, `name`, `email`, `no`, `image`, `createdAt`, `updatedAt`
- Request payloads
  - `SignInRequest` — `email`, `password`
  - `ProfileUpdateRequest` — `firstname`, `lastname`, `studentId`
  - `StatusCreateRequest` — `content`
  - `LikeRequest` — `statusId`
  - `CommentCreateRequest` — `content`, `statusId`

## แนวทางการใช้งานทั่วไป
1) เรียก `POST /signin` พร้อม `x-api-key` เพื่อรับ JWT
2) เก็บ `token` จาก response แล้วส่งใน `Authorization: Bearer <token>` สำหรับทุก endpoint ถัดไป และแนบ `x-api-key` เสมอ
3) ใช้ `GET /status` เพื่อดึงฟีด, `POST /status` เพื่อโพสต์, `POST /like`/`DELETE /unlike` เพื่อจัดการไลค์, `POST /comment` เพื่อคอมเมนต์
4) ข้อมูลองค์ประกอบ (catalog) เช่น บริษัท/โรงเรียน/ผู้สอน ใช้ `GET /company|/school|/teacher`

หมายเหตุ: เนื้อหาอ้างอิงจากสเปค OpenAPI ที่ฝังในหน้า `/api/docs` ซึ่งอาจมีการปรับปรุงได้ตามระบบจริง โปรดตรวจสอบสถานะล่าสุดที่หน้าเอกสารเดิมเมื่อใช้งานจริง
