import React, { useState } from 'react';

// API Key လုံးဝမပါဝင်သော အချက်အလက်များ
const data = {
  monetization: "ဝင်ငွေရရန် Subscribe 1,000 နှင့် Watch time 4,000 လိုအပ်သည်။",
  copyright: "မူပိုင်ခွင့်ရှိသောဗီဒီယိုများကို ကိုယ်ပိုင်အသံ/ဝေဖန်ချက်မပါဘဲ ပြန်တင်ခြင်းကို YouTube က ပိတ်ပင်သည်။",
  shorts: "Shorts ဗီဒီယိုများသည် 60 စက္ကန့်အောက်ဖြစ်ရမည်။"
};

export default function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ text: 'YouTube Mentor - ဘာများ သိချင်ပါသလဲ?', sender: 'bot' }]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { text: input, sender: 'user' };
    const answer = data[input.toLowerCase()] || "တောင်းပန်ပါတယ်၊ အဲ့ဒီအကြောင်းအရာကို ကျွန်တော် မသိပါ။";
    const botMsg = { text: answer, sender: 'bot' };

    setMessages([...messages, userMsg, botMsg]);
    setInput('');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h1 style={{ color: 'red', textAlign: 'center' }}>YouTube Policy Mentor</h1>
      <div style={{ height: '300px', overflowY: 'auto', marginBottom: '10px', border: '1px solid #eee', padding: '10px' }}>
        {messages.map((m, i) => (
          <p key={i} style={{ textAlign: m.sender === 'user' ? 'right' : 'left', color: m.sender === 'user' ? 'blue' : 'black' }}>
            {m.text}
          </p>
        ))}
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex' }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} style={{ flex: 1 }} placeholder="မေးရန်..." />
        <button type="submit">ပို့မည်</button>
      </form>
    </div>
  );
}