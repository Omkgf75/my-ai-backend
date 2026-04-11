const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();
// السماح للتطبيق بالاتصال بالسيرفر
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: GROQ_API_KEY });

const PORT = process.env.PORT || 3000;

app.post('/api/explain', async (req, res) => {
  const { code, language } = req.body;

  try {
    console.log(`Asking Groq to explain ${language} code...`);
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "أنت مبرمج خبير. اشرح الكود البرمجي التالي للمبتدئين بطريقة واضحة ومبسطة باللغة العربية."
        },
        {
          role: "user",
          content: `Explain this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``
        }
      ],
      model: "llama-3.3-70b-versatile", 
      temperature: 0.7,
    });

    const explanation = chatCompletion.choices[0]?.message?.content || "عذراً، لم أتمكن من شرح الكود.";
    res.json({ explanation: explanation });
  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({ error: "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي." });
  }
});

app.post('/api/fix', async (req, res) => {
  const { code, error, language } = req.body;

  try {
    console.log(`Asking Groq to fix ${language} code...`);
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "أنت مبرمج خبير. قم بإصلاح الخطأ في الكود التالي واشرح سبب الخطأ وكيفية حله باللغة العربية."
        },
        {
          role: "user",
          content: `The following ${language} code has an error: "${error}". Fix it and explain.\n\n\`\`\`${language}\n${code}\n\`\`\``
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
    });

    const fix = chatCompletion.choices[0]?.message?.content || "عذراً، لم أتمكن من إصلاح الكود.";
    res.json({ fix: fix });
  } catch (err) {
    console.error("Groq Error:", err);
    res.status(500).json({ error: "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
