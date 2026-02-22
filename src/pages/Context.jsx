import { useState } from 'react'
import CodeBlock from '../components/CodeBlock'

const boxStyle = (highlight) => ({
  padding: '0.5rem 0.75rem',
  borderRadius: 8,
  border: `2px solid ${highlight ? 'var(--react-cyan)' : 'var(--border-color)'}`,
  background: highlight ? 'rgba(97, 218, 251, 0.12)' : 'var(--bg-secondary)',
  fontSize: '0.85rem',
  cursor: 'pointer',
  transition: 'border-color 0.2s, background 0.2s',
})

// 1. Props Drilling：点击路径高亮
function PropsDrillingViz() {
  const [activePath, setActivePath] = useState(null)
  const paths = [
    ['App', 'Layout', 'Sidebar', 'UserCard'],
    ['App', 'Layout', 'Header', 'Avatar'],
  ]
  const pathLabels = { App: 'user', Layout: 'user（中转）', Sidebar: 'user（中转）', UserCard: '✓ 用到 user', Header: 'user（中转）', Avatar: '✓ 用到 user' }
  return (
    <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-color)', margin: '1rem 0' }}>
      <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>点击某条路径，高亮 props 如何一层层传下去：</p>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {paths.map((path, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
            {path.map((name, j) => (
              <span key={j}>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => setActivePath(activePath === i ? null : i)}
                  onKeyDown={(e) => e.key === 'Enter' && setActivePath(activePath === i ? null : i)}
                  style={boxStyle(activePath === i)}
                >
                  {name}
                </span>
                {j < path.length - 1 && <span style={{ color: 'var(--text-muted)' }}> → </span>}
              </span>
            ))}
          </div>
        ))}
      </div>
      {activePath !== null && (
        <p style={{ margin: '0.75rem 0 0', fontSize: '0.8rem', color: 'var(--react-cyan)' }}>
          {paths[activePath].map((n) => pathLabels[n] || n).join(' → ')}
        </p>
      )}
    </div>
  )
}

// 2. 三角色：createContext → Provider → useContext
function ContextThreeRolesViz() {
  const [hover, setHover] = useState(null)
  const roles = [
    { key: 'create', label: 'createContext', desc: '定义「频道」' },
    { key: 'provider', label: 'Provider', desc: '广播 value' },
    { key: 'consume', label: 'useContext', desc: '订阅并读取' },
  ]
  return (
    <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-color)', margin: '1rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {roles.map((r, i) => (
          <span key={r.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              onMouseEnter={() => setHover(r.key)}
              onMouseLeave={() => setHover(null)}
              style={{ ...boxStyle(hover === r.key), minWidth: 100, textAlign: 'center' }}
            >
              <div style={{ fontWeight: 600, color: 'var(--react-cyan)' }}>{r.label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.desc}</div>
            </span>
            {i < roles.length - 1 && <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>→</span>}
          </span>
        ))}
      </div>
    </div>
  )
}

const calloutTip = {
  padding: '1rem 1.25rem',
  margin: '1.25rem 0',
  borderRadius: 8,
  borderLeft: '4px solid var(--react-cyan)',
  background: 'linear-gradient(135deg, rgba(97, 218, 251, 0.1) 0%, rgba(97, 218, 251, 0.03) 100%)',
  fontSize: '0.95rem',
}
const calloutWarn = {
  padding: '1rem 1.25rem',
  margin: '1.25rem 0',
  borderRadius: 8,
  borderLeft: '4px solid #f59e0b',
  background: 'rgba(245, 158, 11, 0.08)',
  fontSize: '0.95rem',
}
const calloutInfo = {
  padding: '1rem 1.25rem',
  margin: '1.25rem 0',
  borderRadius: 8,
  borderLeft: '4px solid #3b82f6',
  background: 'rgba(59, 130, 246, 0.08)',
  fontSize: '0.95rem',
}
const stepNum = {
  width: 36,
  height: 36,
  borderRadius: '50%',
  background: 'var(--react-cyan)',
  color: 'white',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 600,
  fontSize: '0.95rem',
  flexShrink: 0,
}
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  margin: '1.25rem 0',
  fontSize: '0.9rem',
}
const thStyle = {
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border-color)',
  padding: '0.6rem 0.9rem',
  textAlign: 'left',
  fontWeight: 600,
}
const tdStyle = {
  border: '1px solid var(--border-color)',
  padding: '0.6rem 0.9rem',
  verticalAlign: 'top',
}

// 代码块内容用常量书写，避免在 JSX 里写 \${'{{ }}'} 转义
const CODE_THEME_CONTEXT = `// src/context/ThemeContext.js
import { createContext } from 'react';

// 括号内是默认值，Provider 不存在时会用到
export const ThemeContext = createContext('light');`

const CODE_APP_PROVIDER = `// src/App.jsx
import { useState } from 'react';
import { ThemeContext } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Main } from './components/Main';

export function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Navbar />
      <Main />
    </ThemeContext.Provider>
  );
}`

const CODE_THEME_TOGGLE = `// src/components/ThemeToggle.jsx
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      当前主题：{theme} — 点击切换
    </button>
  );
}`

const CODE_THEME_PROVIDER_FULL = `// context/ThemeContext.jsx — 把 Context 和 Provider 封装在一起（推荐做法）
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const toggle = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme 必须在 ThemeProvider 内部使用');
  return ctx;
}`

const CODE_DARK_MODE_BUTTON = `// 消费方，随便哪个深度的组件都行
import { useTheme } from '../context/ThemeContext';

function DarkModeButton() {
  const { isDark, toggle } = useTheme();

  return (
    <button onClick={toggle}>
      {isDark ? '🌙 切换到亮色' : '☀️ 切换到暗色'}
    </button>
  );
}`

const CODE_AUTH_CONTEXT = `// context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);`

const CODE_USER_AVATAR = `// 在任意组件中使用
function UserAvatar() {
  const { user, logout } = useAuth();

  if (!user) return <span>请登录</span>;

  return (
    <div>
      <img src={user.avatar} alt={user.name} />
      <button onClick={logout}>退出登录</button>
    </div>
  );
}`

const CODE_BAD_VALUE = `// ⚠️ 危险写法：每次父组件渲染，value 都是新的对象引用
function App() {
  return (
    <MyContext.Provider value={{ theme: 'light', lang: 'zh' }}>
      <Children />
    </MyContext.Provider>
  );
}`

const CODE_GOOD_VALUE = `// ✅ 正确做法：用 useMemo 稳定引用（或者把值提到 state）
import { useMemo, useState } from 'react';

function App() {
  const [theme, setTheme] = useState('light');
  const [lang] = useState('zh');
  const value = useMemo(() => ({ theme, setTheme, lang }), [theme, lang]);

  return (
    <MyContext.Provider value={value}>
      <Children />
    </MyContext.Provider>
  );
}`

const CODE_USE_AUTH_CHECK = `export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth 必须在 <AuthProvider> 内部使用');
  }
  return ctx;
}`

export default function Context() {
  return (
    <>
      <h1>深入理解 useContext：从此告别 Props 地狱</h1>

      <div style={{ ...calloutTip, marginTop: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', letterSpacing: '0.05em', color: 'var(--react-cyan)', fontWeight: 600, marginBottom: '0.5rem' }}>📋 目录</div>
        <ol style={{ margin: 0, paddingLeft: '1.25rem' }}>
          <li><a href="#why" style={{ color: 'inherit' }}>为什么需要 useContext？</a></li>
          <li><a href="#what" style={{ color: 'inherit' }}>useContext 到底是什么</a></li>
          <li><a href="#how" style={{ color: 'inherit' }}>三步上手：创建、提供、消费</a></li>
          <li><a href="#examples" style={{ color: 'inherit' }}>真实案例：主题切换 & 用户登录</a></li>
          <li><a href="#pitfalls" style={{ color: 'inherit' }}>常见坑与最佳实践</a></li>
          <li><a href="#vs-redux" style={{ color: 'inherit' }}>useContext vs Redux，到底用哪个？</a></li>
          <li><a href="#summary" style={{ color: 'inherit' }}>总结</a></li>
        </ol>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2 id="why">一、为什么需要 useContext？</h2>
      <p>先说个真实场景。假设你在做一个电商网站，用户登录之后，<strong>导航栏</strong>要显示他的头像，<strong>购物车</strong>要读取他的 userId，<strong>订单页</strong>也需要用户信息……</p>
      <p>在没有 Context 的年代，我们通常这样传数据：</p>
      <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, margin: '1rem 0', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <div><span style={{ color: 'var(--react-cyan)' }}>App</span>  user=&#123;user&#125;</div>
        <div style={{ paddingLeft: '1rem' }}>├── <span style={{ color: 'var(--text-primary)' }}>Layout</span>  user=&#123;user&#125; （只是中转，自己用不上）</div>
        <div style={{ paddingLeft: '2rem' }}>├── <span style={{ color: 'var(--text-primary)' }}>Sidebar</span>  user=&#123;user&#125; （继续中转）</div>
        <div style={{ paddingLeft: '3rem' }}>└── <span style={{ color: 'var(--react-cyan)' }}>UserCard</span>  ✓ 这里才真正用到 user</div>
        <div style={{ paddingLeft: '2rem' }}>└── <span style={{ color: 'var(--text-primary)' }}>Header</span>  user=&#123;user&#125;</div>
        <div style={{ paddingLeft: '3rem' }}>└── <span style={{ color: 'var(--react-cyan)' }}>Avatar</span>  ✓ 这里才真正用到 user</div>
      </div>
      <div className="demo-box">
        <p className="demo-label">点击某条路径，高亮 props 如何一层层传下去</p>
        <div className="demo-output">
          <PropsDrillingViz />
        </div>
      </div>
      <p>中间那几层组件完全不需要 <code>user</code>，却不得不接收它再往下传。这就是传说中的 <strong>Props Drilling（属性钻孔）</strong>，又叫 Props 地狱。代码又臭又长，改起来更是牵一发而动全身。</p>
      <div style={calloutTip}>
        <div style={{ fontSize: '0.8rem', color: 'var(--react-cyan)', fontWeight: 600, marginBottom: '0.5rem' }}>💡 一句话总结</div>
        <strong>useContext 就是用来解决 Props Drilling 的</strong>。它让你跳过中间层，把数据直接"广播"给任意深度的子组件，就像开了一个全局频道，谁想听就调个台。
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2 id="what">二、useContext 到底是什么</h2>
      <p><code>useContext</code> 是 React 16.8 引入的一个 Hook，配合 <code>React.createContext</code> 和 <code>Context.Provider</code> 一起使用。整个机制可以理解成三个角色：</p>
      <div className="table-scroll">
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>角色</th>
            <th style={thStyle}>API</th>
            <th style={thStyle}>职责</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style={tdStyle}><strong>创建 Context</strong></td><td style={tdStyle}><code>React.createContext()</code></td><td style={tdStyle}>定义一个"频道"，可带默认值</td></tr>
          <tr><td style={tdStyle}><strong>提供数据</strong></td><td style={tdStyle}><code>&lt;Context.Provider value=&#123;...&#125;&gt;</code></td><td style={tdStyle}>把数据广播给所有后代组件</td></tr>
          <tr><td style={tdStyle}><strong>消费数据</strong></td><td style={tdStyle}><code>useContext(Context)</code></td><td style={tdStyle}>在任意子组件中订阅并读取数据</td></tr>
        </tbody>
      </table>
      </div>
      <div className="demo-box">
        <p className="demo-label">三角色关系：鼠标移入高亮 createContext → Provider → useContext</p>
        <div className="demo-output">
          <ContextThreeRolesViz />
        </div>
      </div>
      <p>重点来了：当 <code>Provider</code> 的 <code>value</code> 发生变化时，所有调用了 <code>useContext</code> 订阅该 Context 的组件都会<strong>自动重新渲染</strong>。这个响应式机制是 Context 的核心魔力。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2 id="how">三、三步上手：创建、提供、消费</h2>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', margin: '1.25rem 0' }}>
        <div style={stepNum}>1</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>创建 Context</h3>
          <p style={{ margin: 0 }}>新建一个文件（推荐单独放）来定义 Context：</p>
        </div>
      </div>
      <CodeBlock language="javascript" code={CODE_THEME_CONTEXT} />
      <div style={calloutInfo}>
        <div style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600, marginBottom: '0.5rem' }}>ℹ️ 关于默认值</div>
        默认值只有在组件树中<strong>没有对应的 Provider 包裹时</strong>才会生效。大多数情况下你都会有 Provider，所以默认值主要用于测试或文档演示。
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', margin: '1.25rem 0' }}>
        <div style={stepNum}>2</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>用 Provider 提供数据</h3>
          <p style={{ margin: 0 }}>在组件树的合适位置包一层 Provider，<code>value</code> 就是要共享的数据：</p>
        </div>
      </div>
      <CodeBlock language="jsx" code={CODE_APP_PROVIDER} />

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', margin: '1.25rem 0' }}>
        <div style={stepNum}>3</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>用 useContext 消费数据</h3>
          <p style={{ margin: 0 }}>在任意子组件中调用 <code>useContext</code>，传入对应的 Context 对象即可：</p>
        </div>
      </div>
      <CodeBlock language="jsx" code={CODE_THEME_TOGGLE} />
      <p>就这样，<code>ThemeToggle</code> 不需要从父组件接收任何 props，直接从 Context 拿数据，调用 <code>setTheme</code> 也能实时更新整棵树里订阅了该 Context 的组件。干净、直接、爽。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2 id="examples">四、真实案例：主题切换 & 用户登录</h2>
      <h3>案例一：全局主题（暗色/亮色模式）</h3>
      <p>这是 useContext 最经典的使用场景，我们来写一个完整的、可运行的版本：</p>
      <CodeBlock language="jsx" code={CODE_THEME_PROVIDER_FULL} />
      <CodeBlock language="jsx" code={CODE_DARK_MODE_BUTTON} />
      <div style={calloutTip}>
        <div style={{ fontSize: '0.8rem', color: 'var(--react-cyan)', fontWeight: 600, marginBottom: '0.5rem' }}>⭐ 最佳实践</div>
        把 <code>createContext</code>、<code>Provider</code> 封装成一个独立文件，再导出一个自定义 Hook（如 <code>useTheme</code>）。这样消费方根本不需要导入 Context 对象，<strong>代码耦合度极低</strong>，日后重构也轻松很多。
      </div>

      <h3>案例二：登录用户信息</h3>
      <p>另一个高频场景是管理当前用户状态。登录后把用户信息存进 Context，整个应用都能随取随用：</p>
      <CodeBlock language="jsx" code={CODE_AUTH_CONTEXT} />
      <CodeBlock language="jsx" code={CODE_USER_AVATAR} />

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2 id="pitfalls">五、常见坑与最佳实践</h2>
      <h3>坑 1：不必要的重渲染</h3>
      <p>这是 useContext 最常被诟病的问题。每次 Provider 的 <code>value</code> 引用变化，所有消费组件都会重新渲染——哪怕它们用到的数据根本没变。</p>
      <CodeBlock language="jsx" code={CODE_BAD_VALUE} />
      <CodeBlock language="jsx" code={CODE_GOOD_VALUE} />

      <h3>坑 2：Context 拆分不当</h3>
      <p>不要把所有状态塞进一个 Context。如果主题和用户信息放在一起，那么用户信息变了，只关心主题的组件也会无辜重渲染。<strong>把变更频率相似的状态放在同一个 Context，其他的单独拆开。</strong></p>
      <div style={calloutWarn}>
        <div style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 600, marginBottom: '0.5rem' }}>⚠️ 避免这样做</div>
        把所有全局状态打包进一个 <code>GlobalContext</code>，看起来方便，实际上会造成大量不必要的重渲染，严重影响性能。
      </div>

      <h3>坑 3：忘记处理 null 默认值</h3>
      <p>如果你用 <code>createContext(null)</code>，在组件用 <code>useContext</code> 拿到的可能是 <code>null</code>。解构时会直接报错。前面案例里加了一个防御检查，强烈推荐照做：</p>
      <CodeBlock language="javascript" code={CODE_USE_AUTH_CHECK} />
      <p>这样一旦有人忘了加 Provider，错误信息会非常清晰，不用满代码去找是哪里出了问题。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2 id="vs-redux">六、useContext vs Redux，到底用哪个？</h2>
      <p>这是一个被问烂了的问题，但确实值得认真回答。</p>
      <div className="table-scroll">
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>维度</th>
            <th style={thStyle}>useContext</th>
            <th style={thStyle}>Redux / Zustand 等</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyle}><strong>学习成本</strong></td>
            <td style={tdStyle}><span style={{ padding: '0.2rem 0.5rem', borderRadius: 20, background: 'rgba(34, 197, 94, 0.2)', color: '#15803d', fontSize: '0.8rem' }}>低</span> React 内置，无需额外依赖</td>
            <td style={tdStyle}><span style={{ padding: '0.2rem 0.5rem', borderRadius: 20, background: 'rgba(220, 38, 38, 0.15)', color: '#dc2626', fontSize: '0.8rem' }}>高</span> 需学习额外概念</td>
          </tr>
          <tr>
            <td style={tdStyle}><strong>适用规模</strong></td>
            <td style={tdStyle}>中小型应用，低频更新的全局状态</td>
            <td style={tdStyle}>大型应用，状态复杂、频繁更新</td>
          </tr>
          <tr>
            <td style={tdStyle}><strong>性能</strong></td>
            <td style={tdStyle}>简单场景够用，高频更新需手动优化</td>
            <td style={tdStyle}>内置细粒度订阅，性能更好</td>
          </tr>
          <tr>
            <td style={tdStyle}><strong>DevTools</strong></td>
            <td style={tdStyle}>有限（React DevTools）</td>
            <td style={tdStyle}>Redux DevTools 非常强大</td>
          </tr>
          <tr>
            <td style={tdStyle}><strong>代码量</strong></td>
            <td style={tdStyle}><span style={{ padding: '0.2rem 0.5rem', borderRadius: 20, background: 'rgba(34, 197, 94, 0.2)', color: '#15803d', fontSize: '0.8rem' }}>少</span> 几行搞定</td>
            <td style={tdStyle}><span style={{ padding: '0.2rem 0.5rem', borderRadius: 20, background: 'rgba(220, 38, 38, 0.15)', color: '#dc2626', fontSize: '0.8rem' }}>多</span> action/reducer/selector</td>
          </tr>
        </tbody>
      </table>
      </div>
      <div style={calloutTip}>
        <div style={{ fontSize: '0.8rem', color: 'var(--react-cyan)', fontWeight: 600, marginBottom: '0.5rem' }}>🎯 我的判断标准</div>
        数据是不是<strong>低频更新</strong>的（主题、语言、用户信息）？用 Context 就够了。数据是<strong>高频更新</strong>（购物车实时计算、复杂表单）或者<strong>多人协同</strong>？考虑 Zustand 或 Redux Toolkit。
      </div>
      <p>事实上，在中型项目里很常见的模式是：<strong>用 Context 管理用户信息和主题，用 Zustand 管理业务状态</strong>。两者并不互斥，各司其职才是最佳方案。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2 id="summary">七、总结</h2>
      <p><code>useContext</code> 解决的核心问题是 Props Drilling，让深层嵌套组件能直接访问祖先组件的数据。三个核心步骤是：<code>createContext</code> 创建频道、<code>Provider</code> 广播数据、<code>useContext</code> 接收数据。</p>
      <p>实际项目里，推荐把 Context 和 Provider 封装在同一文件，并导出一个自定义 Hook（比如 <code>useTheme()</code>、<code>useAuth()</code>），这样消费方代码会非常干净。同时注意用 <code>useMemo</code> 稳定 <code>value</code> 引用，避免不必要的重渲染。</p>
      <p>至于 Context 还是 Redux，别纠结——先用 Context，等项目真的复杂了再迁移。别过度设计。</p>
    </>
  )
}
