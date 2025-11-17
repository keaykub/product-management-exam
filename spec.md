ระบบจัดการสินค้า (Product Management) Full-stack developer


Requirement

Front-end (Vue.js หรือ Nuxt.js)
ระบบจะมี 2 เมนู คือ สินค้า และหมวดหมู่
แสดงรายละเอียดสินค้าในรูปแบบตาราง
แสดงรายละเอียดหมวดหมู่ในรูปแบบตาราง
สามารถเข้าดูข้อมูลสินค้า และหมวดหมู่
มีฟอร์มเพิ่มสินค้า โดยที่สามารถเลือกหมวดหมู่ได้
มีฟอร์มเพิ่มหมวดหมู่
สามารถกด “edit” เพื่อแก้ไขสินค้า และหมวดหมู่
สามารถกด “delete” เพื่อลบสินค้า และหมวดหมู่
มีระบบ validate เบื้องต้น เช่น ช่องว่างห้ามว่าง

 Back-end (Node.js Express)
RESTful API - Product
1.1 GET	/products – ดึงรายการสินค้าทั้งหมดแบบ pagination
1.2 GET	/product/:id – ดึงข้อมูลสินค้า
1.3 POST	/product – เพิ่มสินค้าใหม่
1.4 PUT	/product/:id – แก้ไขข้อมูลสินค้า
1.5 DELETE	/product/:id – ลบสินค้า (soft หรือ hard delete ได้ตามต้องการ)
RESTful API - Category
2.1 GET	/categories – ดึงรายการหมวดหมู่ทั้งหมดแบบ pagination
2.2 GET	/category/:id – ดึงข้อมูลหมวดหมู่
2.3 POST	/category – เพิ่มหมวดหมู่ใหม่
2.4 PUT	/category/:id – แก้ไขข้อมูลหมวดหมู่
2.5 DELETE	/category/:id – ลบหมวดหมู่ (soft หรือ hard delete ได้ตามต้องการ)
สามารถ search สินค้า และหมวดหมู่ แบบ regular expression (RegEX) ได้
ใช้ฐานข้อมูล MongoDB โดยที่ product เก็บ categoryId เป็น ObjectId
ควรมีการแยก controllers/services



Note
อัปโหลดโค้ดขึ้น Git Repository เช่น GitLab หรือ GitHub (ตั้งค่าเป็น public)
แนบคำแนะนำการติดตั้ง (เขียนไว้ใน README.md หรือ document อื่น ๆ)

