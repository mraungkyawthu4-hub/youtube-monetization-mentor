import React, { useState } from 'react';

// API Key မလိုဘဲ အလုပ်လုပ်မည့် အချက်အလက်များ
const policyKnowledgeBase = {
  "monetization": "YouTube Monetization အတွက် Subscribe 1,000 နှင့် Watch time 4,000 (သို့မဟုတ်) Shorts views 10M လိုအပ်ပါသည်။",
  "copyright": "သူများဗီဒီယိုကို မူပိုင်ခွင့် ခွင့်ပြုချက်မရှိဘဲ ပြန်တင်ခြင်းကို YouTube က ပိတ်ပင်ထားပါသည်။",
  "shorts": "Shorts ဗီဒီယိုများသည် 60 စက္ကန့်အောက် ဖြစ်ရမည်။",
  "tags": "Tags များတွင် ဗီဒီယိုနှင့် ဆက်စပ်သော Keywords များကိုသာ ထည့်ပါ။"
};

export default function App() {
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'assistant', content: 'မင်္ဂလာပါ! YouTube Policy နဲ့ပတ်သက်ပြီး ဘာများသိချင်ပါသလဲ?' }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // User မေးတဲ့ စာသား
    const userMsg = { role: 'user', content: chatInput };
    
    // အဖြေရှာခြင်း
    const lowerInput = chatInput.toLowerCase();
    const key = Object.keys(policyKnowledgeBase).find(k => lowerInput.includes(k));
    const botAnswer = key ? policyKnowledgeBase[key] : "တောင်းပန်ပါတယ်၊ အဲ့ဒီအကြောင်းအရာကို ကျွန်တော့် Database မှာ မတွေ့ရှိပါ။ Monetization, Copyright, Shorts သို့မဟုတ် Tags အကြောင်း မေးကြည့်နိုင်ပါတယ်။";
    
    const botMsg = { role: 'assistant', content: botAnswer };

    setChatLog([...chatLog, userMsg, botMsg]);
    setChatInput('');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 className="text-2xl font-bold mb-4">YouTube Mentor (No API)</h1>
      
      <div style={{ height: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '8px' }}>
        {chatLog.map((msg, index) => (
          <div key={index} style={{ marginBottom: '10px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <span style={{ padding: '8px', borderRadius: '10px', backgroundColor: msg.role === 'user' ? '#007bff' : '#eee', color: msg.role === 'user' ? '#fff' : '#000' }}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '5px' }}>
        <input 
          style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="မေးခွန်းရိုက်ပါ..."
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#FF0000', color: 'white', border: 'none', borderRadius: '5px' }}>
          ပို့မည်
        </button>
      </form>
    </div>
  );
}