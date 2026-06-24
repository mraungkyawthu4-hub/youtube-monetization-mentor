import React, { useState } from 'react';

// Knowledge Base
const policyDatabase = [
  { q: "monetization", a: "ဝင်ငွေရရန် Subscribe 1,000 နှင့် Watch time 4,000 လိုအပ်ပါသည်။" },
  { q: "copyright", a: "မူပိုင်ခွင့်ကို သတိထားပါ။ ကိုယ်ပိုင်အသံပါဝင်မှ ပိုစိတ်ချရသည်။" },
  { q: "shorts", a: "Shorts ဗီဒီယိုသည် 60 စက္ကန့်အောက် ဖြစ်ရမည်။" }
];

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'YouTube Policy Mentor သို့ ကြိုဆိုပါတယ်။ ဘာများ သိချင်ပါသလဲ?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', text: input };
    const found = policyDatabase.find(item => input.toLowerCase().includes(item.q));
    const botMsg = { 
      role: 'bot', 
      text: found ? found.a : "တောင်းပန်ပါတယ်၊ အဲ့ဒီအကြောင်းအရာအတွက် အချက်အလက် မရှိသေးပါ။" 
    };

    setMessages([...messages, userMsg, botMsg]);
    setInput('');
  };

  return (
    <div style={{ width: '100%', maxWidth: '500px', margin: '20px auto', padding: '20px', backgroundColor: '#ffffff', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#ff0000', marginBottom: '20px' }}>YT Mentor</h2>
      
      {/* Messages Area */}
      <div style={{ height: '300px', overflowY: 'auto', marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: '10px', textAlign: m.role === 'user' ? 'right' : 'left' }}>
            <span style={{ padding: '8px 12px', borderRadius: '10px', backgroundColor: m.role === 'user' ? '#e53935' : '#f0f0f0', color: m.role === 'user' ? '#fff' : '#000', display: 'inline-block' }}>
              {m.text}
            </span>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div style={{ display: 'flex', gap: '5px' }}>
        <input 
          style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="မေးခွန်းရိုက်ပါ..."
        />
        <button 
          onClick={handleSend}
          style={{ padding: '10px 15px', backgroundColor: '#ff0000', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          ပို့မည်
        </button>
      </div>
    </div>
  );
}