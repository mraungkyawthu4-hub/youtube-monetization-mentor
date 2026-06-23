import { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('accelerator');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [niche, setNiche] = useState('finance');
  const [contentType, setContentType] = useState('original');

  // New Chat & Update States
  const [apiKey, setApiKey] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'assistant', content: 'မင်းသိချင်တာမှန်သမျှ မေးမြန်းနိုင်ပါတယ်... (ဥပမာ - အခုချက်ချင်း စတင်လုပ်ဆောင်လို့ရတဲ့ YouTube Video Niche က ဘာလဲ?)' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // PWA Installation
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    });
    window.addEventListener('appinstalled', () => {
      setShowInstallBtn(false);
      setDeferredPrompt(null);
      alert('📱 YouTube Guidelines App ကို ဖုန်းထဲသို့ အောင်မြင်စွာ Install လုပ်ပြီးပါပြီ။');
    });
  }, []);

  const triggerPwaInstall = async () => {
    if (!deferredPrompt) {
      alert("ဤဖုန်း သို့မဟုတ် Browser က PWA Install စနစ်ကို အဆင်သင့်မဖြစ်သေးပါ။ Chrome Browser ဖြင့် ဖွင့်သုံးပေးပါ။");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBtn(false);
    }
  };

  // DeepSeek Chat Function
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    if (!apiKey.trim()) {
      alert("⚠️ ကျေးဇူးပြု၍ DeepSeek API Key ကို အရင်ထည့်ပေးပါ။");
      return;
    }

    const userMessage = { role: 'user', content: chatInput };
    setChatLog((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsLoading(true);

    let systemContext = "You are a professional YouTube Monetization Mentor AI.";
    if (uploadedFiles.length > 0) {
      systemContext += ` User uploaded knowledge: ${uploadedFiles.map(f => f.content).join(" ")}`;
    }

    try {
const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemContext },
            ...chatLog,
            userMessage
          ],
          stream: false
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        setChatLog((prev) => [...prev, { role: 'assistant', content: data.choices[0].message.content }]);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error(error);
      setChatLog((prev) => [...prev, { role: 'assistant', content: '❌ API ချိတ်ဆက်မှု အဆင်မပြေပါ။ Key မှန်ကန်မှု ရှိမရှိ သို့မဟုတ် Network ကို ပြန်စစ်ပေးပါ။' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Add Files File Upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedFiles(prev => [...prev, { name: file.name, content: event.target.result }]);
        alert(`📁 ဖိုင် "${file.name}" ကို AI Knowledge Base ထဲသို့ ခေတ္တပေါင်းထည့်ပြီးပါပြီ။`);
      };
      reader.readAsText(file);
    });
  };

  const yppTiers = {
    tier1: { subs: 500, publicHours: 3000, shorts: "3M", perks: ["Shopping Affiliate (Shopify/SaaS)", "Channel Memberships", "Supers Chat Funding"] },
    tier2: { subs: 1000, publicHours: 4000, shorts: "10M", perks: ["Watch Page AdSense", "Shorts Feed Revenue Share", "Premium Payouts"] }
  };

  const nicheData = {
    finance: { name: "Finance & Crypto", rpm: "$20 - $40", strategy: "SaaS & Affiliate Links ကို Top Pinned Comment မှာ ထည့်ပါ။ High RPM ရရှိသည်။" },
    tech: { name: "Tech & Software Tutorials", rpm: "$10 - $25", strategy: "ရက် ၃၀ အတွင်း Outlier Videos များကို ရှာဖွေပြီး Title Pattern ကို Reverse-Engineer လုပ်ပါ။" },
    bible: { name: "Faceless Bible / Stories", rpm: "$3 - $8", strategy: "AI Slop မဖြစ်စေရန် စာသားများကို ကိုယ်တိုင်ရေးပါ၊ တည်းဖြတ်မှု Timeline ကို သေချာပြောင်းလဲပါ။" },
    gaming: { name: "Gaming & Compilations", rpm: "$1 - $4", strategy: "Reused Content ပေါ်လစီ ငြိရန် အလားအလာ အလွန်များသဖြင့် ကိုယ်ပိုင်အသံ (Voiceover) ၇၀% မဖြစ်မနေထည့်ပါ။" }
  };

  // Safeguard Variable Extraction
  const activeNicheInfo = nicheData[niche] || nicheData['finance'];
  const isOriginal = contentType === 'original';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#121212', color: '#f1f1f1', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Top Header Bar */}
      <header style={{ backgroundColor: '#1f1f1f', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2a2a2a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#FF0000', borderRadius: '50%' }}></div>
          <h2 style={{ margin: 0, fontSize: '18px', letterSpacing: '0.5px' }}>YouTube Monetization Mentor Dashboard</h2>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="password" 
            placeholder="DeepSeek API Key ထည့်ရန်" 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)}
            style={{ padding: '8px 12px', backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '20px', fontSize: '13px' }}
          />

          <label style={{ backgroundColor: '#2d2d2d', color: '#fff', padding: '8px 15px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            📎 Add Files
            <input type="file" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>

          <button onClick={triggerPwaInstall} style={{ backgroundColor: '#FF0000', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 12px rgba(255,0,0,0.3)' }}>
            📱 Phone Install
          </button>
        </div>
      </header>

      {/* Main Container Layout */}
      <div style={{ display: 'flex', flex: 1 }}>
        
        {/* Left Navigation Sidebar Hierarchy */}
        <nav style={{ width: '280px', backgroundColor: '#1a1a1a', borderRight: '1px solid #2a2a2a', padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div>
            <div style={{ padding: '5px 10px', color: '#888', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>📁 Content Strategy</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '5px' }}>
              <button onClick={() => { setActiveTab('accelerator'); setNiche('finance'); }} style={{ textAlign: 'left', padding: '10px', backgroundColor: activeTab === 'accelerator' && niche === 'finance' ? '#2d2d2d' : 'transparent', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>📄 YouTube Niches (Finance)</button>
              <button onClick={() => { setActiveTab('accelerator'); setNiche('tech'); }} style={{ textAlign: 'left', padding: '10px', backgroundColor: activeTab === 'accelerator' && niche === 'tech' ? '#2d2d2d' : 'transparent', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>📄 YouTube Niches (Tech)</button>
            </div>
          </div>

          <div>
            <div style={{ padding: '5px 10px', color: '#888', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>📁 Risk Guard Scanner</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '5px' }}>
              <button onClick={() => { setActiveTab('risk'); setContentType('original'); }} style={{ textAlign: 'left', padding: '10px', backgroundColor: activeTab === 'risk' && contentType === 'original' ? '#2d2d2d' : 'transparent', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>📄 Original Workspace Check</button>
              <button onClick={() => { setActiveTab('risk'); setContentType('ai'); }} style={{ textAlign: 'left', padding: '10px', backgroundColor: activeTab === 'risk' && contentType === 'ai' ? '#2d2d2d' : 'transparent', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>📄 AI Slop & Compliance Risk</button>
            </div>
          </div>

          <div>
            <div style={{ padding: '5px 10px', color: '#888', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>📁 Income Stack</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '5px' }}>
              <button onClick={() => setActiveTab('stack')} style={{ textAlign: 'left', padding: '10px', backgroundColor: activeTab === 'stack' ? '#2d2d2d' : 'transparent', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>📄 Fan Funding & Ads Strategy</button>
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div style={{ marginTop: 'auto', padding: '10px', backgroundColor: '#222', borderRadius: '6px' }}>
              <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>⚡ Active Knowledge Context:</div>
              {uploadedFiles.map((f, i) => (
                <div key={i} style={{ fontSize: '11px', color: '#aaa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '4px' }}>• {f.name}</div>
              ))}
            </div>
          )}
        </nav>

        {/* Right Dashboard Contents & Q&A Chat Split */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '25px', gap: '20px', overflowY: 'auto' }}>
          
          {/* Dashboard Dynamic Area */}
          <div style={{ flex: '0 0 auto' }}>
            {activeTab === 'accelerator' && (
              <div style={{ backgroundColor: '#1f1f1f', padding: '20px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
                <h3 style={{ marginTop: 0, color: '#FF0000' }}>🎯 YouTube Partner Program (YPP) Tiers</h3>
                <div style={{ display: 'flex', gap: '20px', margin: '15px 0' }}>
                  <div style={{ flex: 1, backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #FF0000' }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>Tier 1: Startup Funding</h4>
                    <p style={{ margin: '5px 0', fontSize: '13px' }}>• <b>{yppTiers.tier1.subs} Subs</b> | <b>{yppTiers.tier1.publicHours} Hours</b></p>
                    <div style={{ fontSize: '12px', color: '#10b981' }}>Perks: {yppTiers.tier1.perks.join(', ')}</div>
                  </div>
                  <div style={{ flex: 1, backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #cc0000' }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>Tier 2: Full AdSense Share</h4>
                    <p style={{ margin: '5px 0', fontSize: '13px' }}>• <b>{yppTiers.tier2.subs} Subs</b> | <b>{yppTiers.tier2.publicHours} Hours</b></p>
                    <div style={{ fontSize: '12px', color: '#10b981' }}>Perks: {yppTiers.tier2.perks.join(', ')}</div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '6px', marginTop: '10px' }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#FF0000' }}>{activeNicheInfo.name} Analytics</h4>
                  <p style={{ margin: '5px 0' }}>Estimated RPM: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{activeNicheInfo.rpm}</span></p>
                  <p style={{ margin: '5px 0', fontSize: '13px', color: '#ccc' }}><b>Strategy:</b> {activeNicheInfo.strategy}</p>
                </div>
              </div>
            )}

            {activeTab === 'risk' && (
              <div style={{ backgroundColor: '#1f1f1f', padding: '20px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
                <h3 style={{ marginTop: 0, color: '#f87171' }}>🛡️ Risk Guard Scanner Status</h3>
                <div style={{
                  backgroundColor: isOriginal ? '#142a1e' : '#2a2314',
                  color: isOriginal ? '#6ee7b7' : '#fde047',
                  border: isOriginal ? '1px solid #065f46' : '1px solid #854d0e',
                  padding: '15px',
                  borderRadius: '6px'
                }}>
                  {isOriginal ? (
                    <div>
                      <b>✅ High Stability Active Workflow</b>
                      <p style={{ fontSize: '13px', margin: '5px 0 0 0' }}>ကိုယ်ပိုင်ရုပ်သံဖြစ်၍ Reused Content ဖြစ်နိုင်ခြေမရှိပါ။ AdSense အောင်မြင်မှုရာခိုင်နှုန်းအလွန်မြင့်မားပါသည်။</p>
                    </div>
                  ) : (
                    <div>
                      <b>⚠️ High Risk Warning Alert</b>
                      <p style={{ fontSize: '13px', margin: '5px 0 0 0' }}>100% AI ဖြစ်နေသည့်အတွက် สရွက်စာတမ်း Paper Trail နှင့် တည်းဖြတ်မှုဗီဒီယိုပြသနိုင်ရန် ကြိုတင်ပြင်ဆင်ပါ။</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'stack' && (
              <div style={{ backgroundColor: '#1f1f1f', padding: '20px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
                <h3 style={{ marginTop: 0, color: '#10b981' }}>💵 Multi-Channel Monetization Income Stack</h3>
                <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '4px' }}>📌 Pinned Top Comment Affiliate Automation Setup</div>
                  <div style={{ backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '4px' }}>🛍️ YouTube Shopping Merchant Tag Integration</div>
                </div>
              </div>
            )}
          </div>

          {/* Q&A Chat Component Section */}
          <div style={{ flex: 1, backgroundColor: '#1f1f1f', borderRadius: '8px', border: '1px solid #2a2a2a', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: '300px' }}>
            <div style={{ backgroundColor: '#252525', padding: '10px 15px', borderBottom: '1px solid #2a2a2a', fontSize: '14px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
              <span>💬 DeepSeek Expert Q&A Chatbox</span>
              <span style={{ fontSize: '11px', color: '#aaa' }}>Model: deepseek-chat</span>
            </div>

            {/* Chat Messages Log */}
            <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chatLog.map((msg, index) => (
                <div key={index} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', backgroundColor: msg.role === 'user' ? '#FF0000' : '#2a2a2a', color: '#fff', padding: '10px 14px', borderRadius: '12px', maxWidth: '75%', fontSize: '14px', lineHeight: '1.4' }}>
                  {msg.content}
                </div>
              ))}
              {isLoading && (
                <div style={{ alignSelf: 'flex-start', backgroundColor: '#2a2a2a', color: '#888', padding: '10px 14px', borderRadius: '12px', fontSize: '14px' }}>
                  ⏳ DeepSeek စဉ်းစားနေပါသည်...
                </div>
              )}
            </div>

            {/* Sticky Chat Box Form */}
            <form onSubmit={handleSendMessage} style={{ padding: '10px', backgroundColor: '#1a1a1a', borderTop: '1px solid #2a2a2a', display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="မင်းသိချင်တာမှန်သမျှ မေးမြန်းနိုင်ပါတယ်... (ဥပမာ - အခုချက်ချင်း စတင်လုပ်ဆောင်လို့ရတဲ့ YouTube Video Niche က ဘာလဲ?)"
                style={{ flex: 1, padding: '12px', backgroundColor: '#252525', border: '1px solid #333', color: '#fff', borderRadius: '6px', fontSize: '13px' }}
              />
              <button type="submit" disabled={isLoading} style={{ backgroundColor: '#FF0000', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                🚀 Send
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}