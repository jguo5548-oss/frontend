import { useState, useRef } from 'react';
import './App.css';

const BACKEND_URL = 'https://backend-5vas.onrender.com';

const personas = {
  'sho酱': { label: 'sho酱（日语）', greeting: 'こんにちは！日本語の練習、一緒に頑張ろう！' },
  'en硕': { label: 'en硕（韩语）', greeting: '안녕하세요！한국어 같이 공부해요！' },
};

function App() {
  const [currentPersona, setCurrentPersona] = useState('sho酱');
  const [chats, setChats] = useState({
    'sho酱': [{ role: 'character', content: 'こんにちは！日本語の練習、一緒に頑張ろう！' }],
    'en硕': [{ role: 'character', content: '안녕하세요！한국어 같이 공부해요！' }],
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  const messages = chats[currentPersona];

  const switchPersona = (name) => {
    setCurrentPersona(name);
    setInputValue('');
  };

  const playTTS = async (text, persona) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, persona }),
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    } catch (e) {
      console.log('语音播放失败', e);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue;
    setInputValue('');

    setChats((prev) => ({
      ...prev,
      [currentPersona]: [...prev[currentPersona], { role: 'user', content: userMessage }],
    }));
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, persona: currentPersona }),
      });

      const data = await response.json();

      if (data.reply) {
        setChats((prev) => ({
          ...prev,
          [currentPersona]: [...prev[currentPersona], { role: 'character', content: data.reply }],
        }));
        // 收到回复后自动播放语音
        await playTTS(data.reply, currentPersona);
      } else {
        setChats((prev) => ({
          ...prev,
          [currentPersona]: [...prev[currentPersona], { role: 'character', content: '好像出错了，再说一次？' }],
        }));
      }
    } catch (error) {
      setChats((prev) => ({
        ...prev,
        [currentPersona]: [...prev[currentPersona], { role: 'character', content: '网络断了，稍后再试。' }],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <audio ref={audioRef} />

      {/* 左侧：人物切换 */}
      <div className="sidebar">
        <div className="sidebar-header">我们的家</div>
        <div className="chat-list">
          {Object.entries(personas).map(([name, config]) => (
            <div
              key={name}
              className={`chat-item ${currentPersona === name ? 'active' : ''}`}
              onClick={() => switchPersona(name)}
            >
              {config.label}
            </div>
          ))}
        </div>
      </div>

      {/* 右侧：主体 */}
      <div className="main-content">
        <div className="top-bar">
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{currentPersona}</div>
        </div>

        <div className="chat-container">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.role}`}>
              <div className="bubble">{msg.content}</div>
            </div>
          ))}
          {isLoading && (
            <div className="chat-message character">
              <div className="bubble">认真思考中...</div>
            </div>
          )}
        </div>

        <div className="input-area">
          <input
            type="text"
            className="input-box"
            placeholder={`和${currentPersona}说点什么...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            style={{
              marginLeft: '10px',
              padding: '8px 20px',
              borderRadius: '20px',
              border: '1px solid #d9d9d9',
              background: isLoading ? '#f5f5f5' : '#fff',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
            disabled={isLoading}
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
