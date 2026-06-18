import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* 左侧：对话切换列表 */}
      <div className="sidebar">
        <div className="sidebar-header">
          我们的家
        </div>
        <div className="chat-list">
          <div className="chat-item active">当前对话 (萌萌DOKI)</div>
          <div className="chat-item">日常记录</div>
          <div className="chat-item">灵感备忘录</div>
        </div>
      </div>

      {/* 右侧：主体区域 */}
      <div className="main-content">
        {/* 顶部：模型选择 */}
        <div className="top-bar">
          <div className="model-selector">
            <select>
              <option value="model-a">默认模型 (标准版)</option>
              <option value="model-b">智能模型 (高级版)</option>
            </select>
          </div>
          <div>设置 | 个人中心</div>
        </div>

        {/* 聊天主界面 */}
        <div className="chat-container">
          <div className="chat-message character">
            <div className="bubble">欢迎回到我们的家！现在我已经升级成 React 版本啦~</div>
          </div>

          <div className="chat-message user">
            <div className="bubble">哇，界面一模一样，但感觉内在变得更厉害了！</div>
          </div>

          <div className="chat-message character">
            <div className="bubble">是的！接下来无论是加上真正的聊天功能，还是适配手机端的屏幕大小，都会变得超级方便。</div>
          </div>
        </div>

        {/* 底部输入框 */}
        <div className="input-area">
          <input type="text" className="input-box" placeholder="在这里输入你想说的话..." />
        </div>
      </div>
    </div>
  );
}

export default App;
