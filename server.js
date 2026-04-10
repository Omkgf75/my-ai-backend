const express = require('express');
const cors = require('cors');

const app = express();

// السماح للواجهة الأمامية (Frontend) بالاتصال بهذا الخادم
app.use(cors());
// السماح للخادم بقراءة البيانات المرسلة بصيغة JSON
app.use(express.json());

// المنفذ الذي سيعمل عليه الخادم (Render سيقوم بتحديده تلقائياً)
const PORT = process.env.PORT || 3000;

// 1. مسار شرح الكود (Explain Code)
app.post('/api/explain', async (req, res) => {
  const { code, language } = req.body;

  try {
    console.log(`Received request to explain ${language} code.`);
    
    const explanation = `مرحباً! هذا رد تجريبي من خادمك الخاص 🚀\n\nلقد طلبت شرح كود مكتوب بلغة: ${language}\n\nالكود الخاص بك هو:\n${code}`;

    // إرسال الرد إلى التطبيق
    res.json({ explanation: explanation });
  } catch (error) {
    console.error("Error in /api/explain:", error);
    res.status(500).json({ error: "حدث خطأ داخلي في الخادم" });
  }
});

// 2. مسار إصلاح الكود (Fix Code)
app.post('/api/fix', async (req, res) => {
  const { code, error, language } = req.body;

  try {
    console.log(`Received request to fix ${language} code.`);
    
    const fix = `مرحباً! هذا رد تجريبي من خادمك الخاص 🚀\n\nلقد طلبت إصلاح خطأ في لغة: ${language}\nالخطأ هو: ${error}`;

    res.json({ fix: fix });
  } catch (err) {
    console.error("Error in /api/fix:", err);
    res.status(500).json({ error: "حدث خطأ داخلي في الخادم" });
  }
});

// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
