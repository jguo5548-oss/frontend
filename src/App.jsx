import { useState } from 'react';
import './App.css';

function App() {
  // 用來儲存聊天記錄的清單
  const [messages, setMessages] = useState([
    { role: 'character', content: '歡迎回到我們的家！現在我已經升級成 React 版本啦~' }
  ]);
  // 用來儲存你在輸入框裡打的字
  const [inputValue, setInputValue] = useState('');
  // 用來記錄 AI 是否正在思考中
  const [isLoading, setIsLoading] = useState(false);

  // 🚨 綁定你專屬的 Render 後端網址
  const BACKEND_URL = 'https://backend-5vas.onrender.com';

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue;
    setInputValue(''); // 清空輸入框
    
    // 1. 把你說的話，立刻加到聊天畫面上
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // 2. 把話傳送給 Render 後端大管家
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      // 3. 把 Claude 的回覆展示在畫面上
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'character', content: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: 'character', content: '大管家開小差了，沒能拿到 Claude 的回覆。' }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'character', content: '網路連線失敗，大管家好像斷線了。' }]);
    } finally {
      setIsLoading(false); // 結束思考狀態
    }
  };

  return (
    <div className="app-container">
      {/* 左側：對話切換清單 */}
      <div className="sidebar">
        <div className="sidebar-header">我們的家</div>
        <div className="chat-list">
          <div className="chat-item active">當前對話 (萌萌DOKI)</div>
          <div className="chat-item">日常記錄</div>
          <div className="chat-item">靈感備忘錄</div>
        </div>
      </div>

      {/* 右側：主體區域 */}
      <div className="main-content">
        {/* 頂部區域 */}
        <div className="top-bar">
          <div className="model-selector">
            <select>
              <option value="model-a">Claude 3.5 智慧模型</option>
            </select>
          </div>
          <div>設置 | 個人中心</div>
        </div>

        {/* 聊天主介面 */}
        <div className="chat-container">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.role}`}>
              <div className="bubble">{msg.content}</div>
            </div>
          ))}
          {isLoading && (
            <div className="chat-message character">
              <div className="bubble">正在認真思考中...</div>
            </div>
          )}
        </div>

        {/* 底部輸入框與按鈕 */}
        <div className="input-area">
          <input
            type="text"
            className="input-box"
            placeholder="在這裡輸入你想說的話..."
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
            發送
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
