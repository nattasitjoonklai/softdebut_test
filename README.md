## Requirements (สิ่งที่ต้องมี)

- **Node.js** (แนะนำ LTS version)  
  - ตรวจสอบเวอร์ชันได้โดยเปิด Terminal หรือ Command Prompt แล้วพิมพ์:  
    node -v
    

- เอกสาร Testcase  :TestScenario_OrageHRM.xlsx
- หลักฐานการรันทดสอบ (Evidence)
  - ZIP: test-result
  
  - ภาพหน้าจอ (Screenshot) ผลการทดสอบ:test-results/<ลำดับตัวทดสอบ>/<testname>/
 
  - วิดีโอ (Video Recording) ผลการทดสอบ:test-results/<testname>/video.webm
- หมายเหตุสำคัญ
  
  - เนื่องจากเว็บไซต์ที่ใช้ทดสอบมีการปรับปรุงเป็นระยะ ซึ่งอาจส่งผลให้อิลิเมนต์บางส่วนมีการเปลี่ยนแปลง และทำให้การรันทดสอบไม่เสถียรในบางช่วงเวลา
ดังนั้น จึงมีการ บันทึกผลการทดสอบเป็นวิดีโอ เพื่อใช้เป็น หลักฐานประกอบการทดสอบ โดยไฟล์ชื่อ Test_File.Mp4
  
 
  
  
## ขั้นตอนการใช้งาน

### 1. Clone โปรเจค
```bash
git clone "https://github.com/nattasitjoonklai/softdebut_test.git"
cd softdebut_test\tests\
===================================================================
2.ติดตั้ง Dependencies
npm install
npx playwright install
===================================================================
3. รันทดสอบทั้งหมด
npx playwright test
===================================================================
4. ดูผลลัพธ์หลังรันทดสอบ
npx playwright show-report
===================================================================
5.ข้อมูลบันทึกไฟล์รูปภาพและวิดีโอ
Screenshots และ Video จะถูกเก็บในโฟลเดอร์:
สำหรับรูปภาพ: test-results/<ลำดับตัวทดสอบ>/<testname>/
สำหรับวิดีโอ:test-results/<testname>/video.webm





