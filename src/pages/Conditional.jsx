import { useState } from 'react'
import CodeBlock from '../components/CodeBlock'

const btnStyle = {
  padding: '0.5rem 1rem',
  background: 'var(--react-cyan-light)',
  color: 'var(--react-cyan)',
  border: '1px solid rgba(97, 218, 251, 0.4)',
  borderRadius: 6,
  cursor: 'pointer',
  fontWeight: 500,
}

function StatusContentDemo({ status }) {
  if (status === 'loading') return <p style={{ color: 'var(--text-muted)', margin: 0 }}>加载中...</p>
  if (status === 'error') return <p style={{ color: 'var(--react-cyan)', margin: 0 }}>出错了</p>
  if (status === 'empty') return <p style={{ color: 'var(--text-muted)', margin: 0 }}>暂无数据</p>
  return <p style={{ color: 'var(--react-cyan)', margin: 0, fontWeight: 600 }}>数据加载成功</p>
}

export default function Conditional() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [notifCount, setNotifCount] = useState(0)
  const [notifMessage, setNotifMessage] = useState('')
  const [listLength, setListLength] = useState(0)
  const [status, setStatus] = useState('loading')
  const [listView, setListView] = useState('loading')
  const mockUsers = [
    { id: 1, name: '小明', email: 'xiaoming@example.com', isVip: true },
    { id: 2, name: '小红', email: 'xiaohong@example.com', isVip: false },
  ]

  return (
    <>
      <h1>React 条件渲染</h1>
      <p>
        如果你已经会写基础的 React 组件了，那条件渲染绝对是你接下来必须掌握的东西。说白了就是一个问题：<strong>怎么根据不同的状态，显示不同的内容？</strong>
      </p>
      <p>
        这个需求在实际项目里无处不在——用户登录了就显示头像，没登录就显示登录按钮；数据加载中就显示骨架屏，加载完了就显示内容；列表为空就显示"暂无数据"……
      </p>
      <p>
        听起来很简单，但条件渲染的写法有好几种，用不好代码会变得又臭又长。这一篇将把每种方式都讲清楚，顺带告诉什么场景该用哪种。
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>最直白的方式：if/else</h2>
      <p>先从最容易理解的说起。你完全可以在 <code>return</code> 之前用普通的 <code>if/else</code> 来决定渲染什么：</p>
      <CodeBlock
        language="jsx"
        code={`function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>欢迎回来！</h1>;
  } else {
    return <h1>请先登录</h1>;
  }
}`}
      />
      <div className="demo-box">
        <p className="demo-label">if/else：根据登录状态显示不同内容，点按钮切换</p>
        <div className="demo-output">
          {(() => {
            if (isLoggedIn) {
              return (
                <>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>欢迎回来！</h3>
                  <button type="button" onClick={() => setIsLoggedIn(false)} style={btnStyle}>退出</button>
                </>
              )
            }
            return (
              <>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>请先登录</h3>
                <button type="button" onClick={() => setIsLoggedIn(true)} style={btnStyle}>登录</button>
              </>
            )
          })()}
        </div>
      </div>
      <p>这种写法最直观，逻辑一眼就看懂，特别适合<strong>两种情况差异很大、各自逻辑比较复杂</strong>的场景。</p>
      <p>你也可以用来提前返回（Early Return），这是一个非常好的习惯：</p>
      <CodeBlock
        language="jsx"
        code={`function UserProfile({ user }) {
  if (!user) {
    return <p>加载中...</p>;
  }

  // 走到这里就一定有 user 了，不用担心 null
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}`}
      />
      <p>提前把"异常情况"处理掉，剩下的主逻辑就干净很多，不用层层嵌套。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>最常用的方式：三元运算符</h2>
      <p>
        写 React 的时候你会发现，很多条件渲染需要<strong>嵌在 JSX 里面</strong>，这时候 <code>if/else</code> 就不行了，因为 JSX 里只能放表达式，不能放语句。
      </p>
      <p>三元运算符就是为了这个场景而生的：</p>
      <CodeBlock
        language="jsx"
        code={`function App({ isLoggedIn }) {
  return (
    <div>
      <h1>我的应用</h1>
      {isLoggedIn ? <UserAvatar /> : <LoginButton />}
    </div>
  );
}`}
      />
      <div className="demo-box">
        <p className="demo-label">三元：同一状态，在 JSX 里用 isLoggedIn ? A : B 切换</p>
        <div className="demo-output">
          <p style={{ marginTop: 0, marginBottom: '0.5rem' }}>我的应用</p>
          {isLoggedIn ? <span style={{ color: 'var(--react-cyan)', fontWeight: 600 }}>已登录（头像）</span> : <span style={{ color: 'var(--text-muted)' }}>请登录</span>}
          <div style={{ marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsLoggedIn((v) => !v)} style={btnStyle}>切换登录状态</button>
          </div>
        </div>
      </div>
      <p>简洁、直接、JSX 友好。日常开发用得最多的就是这种。</p>
      <p>但有一点要注意：<strong>别滥用嵌套三元</strong>。一旦嵌套起来，可读性直线下降：</p>
      <CodeBlock
        language="jsx"
        code={`// ❌ 看这个需要花时间理解，很痛苦
{isLoggedIn
  ? isAdmin
    ? <AdminPanel />
    : <UserDashboard />
  : <LoginPage />}`}
      />
      <p>遇到这种情况，老老实实换回 <code>if/else</code>，或者把逻辑抽成一个单独的函数/组件，别图省事把代码写成谜语。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>最优雅的方式：<code>&&</code> 短路运算</h2>
      <p>有很多场景只有"显示"或"不显示"两种状态，不需要 else 分支。这时候用三元运算符就有点啰嗦了：</p>
      <CodeBlock
        language="jsx"
        code={`// 有点多余
{hasMessage ? <MessageBadge /> : null}`}
      />
      <p>用 <code>&&</code> 更干净：</p>
      <CodeBlock
        language="jsx"
        code={`{hasMessage && <MessageBadge />}`}
      />
      <p>
        原理很简单：JavaScript 里 <code>A && B</code>，如果 A 是 falsy，就直接返回 A，不会执行 B；如果 A 是 truthy，就返回 B。React 遇到 <code>null</code>、<code>undefined</code>、<code>false</code> 都不会渲染任何东西，所以这个写法完全成立。
      </p>
      <p>实际项目里非常常见：</p>
      <CodeBlock
        language="jsx"
        code={`function Notification({ count, message }) {
  return (
    <div>
      {count > 0 && <span className="badge">{count}</span>}
      {message && <p className="message">{message}</p>}
    </div>
  );
}`}
      />
      <div className="demo-box">
        <p className="demo-label">&&：有 count 才显示角标，有 message 才显示消息</p>
        <div className="demo-output">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
            {notifCount > 0 && <span style={{ background: 'var(--react-cyan)', color: '#0f172a', padding: '0.2rem 0.5rem', borderRadius: 999, fontSize: '0.85rem' }}>{notifCount}</span>}
            {notifMessage && <p className="message" style={{ margin: 0, color: 'var(--react-cyan)' }}>{notifMessage}</p>}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => setNotifCount((c) => c + 1)} style={btnStyle}>+1</button>
            <button type="button" onClick={() => setNotifCount(0)} style={btnStyle}>清空数字</button>
            <input
              type="text"
              value={notifMessage}
              onChange={(e) => setNotifMessage(e.target.value)}
              placeholder="输入消息"
              style={{ padding: '0.4rem', borderRadius: 6, border: '1px solid var(--border-color)', minWidth: 120 }}
            />
          </div>
        </div>
      </div>
      <p><strong>但是！有一个经典的坑必须提醒你：</strong></p>
      <CodeBlock
        language="jsx"
        code={`// ❌ 危险！当 list.length 为 0 时，会在页面上渲染出数字 0
{list.length && <List items={list} />}`}
      />
      <p>为什么？因为 <code>0 && &lt;List /&gt;</code> 返回的是 <code>0</code>，而 React 会把数字 <code>0</code> 渲染出来，你的页面上就会莫名其妙出现一个 <code>0</code>。</p>
      <p>解决方法是把条件写得更明确：</p>
      <CodeBlock
        language="jsx"
        code={`// ✅ 把数字转成布尔值
{list.length > 0 && <List items={list} />}

// ✅ 或者用双感叹号
{!!list.length && <List items={list} />}`}
      />
      <div className="demo-box">
        <p className="demo-label">数字 0 的坑：左侧用 listLength && ... 会渲染出 0，右侧用 listLength &gt; 0 && ... 不会</p>
        <div className="demo-output" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{ marginBottom: '0.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>❌ listLength && &lt;span&gt;</p>
            <p style={{ margin: 0, minHeight: '1.5em' }}>{listLength && <span>列表有 {listLength} 项</span>}</p>
          </div>
          <div>
            <p style={{ marginBottom: '0.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>✅ listLength &gt; 0 && ...</p>
            <p style={{ margin: 0, minHeight: '1.5em' }}>{listLength > 0 && <span>列表有 {listLength} 项</span>}</p>
          </div>
          <div style={{ flexBasis: '100%' }}>
            <button type="button" onClick={() => setListLength(0)} style={btnStyle}>设为 0</button>
            <button type="button" onClick={() => setListLength(1)} style={{ ...btnStyle, marginLeft: '0.5rem' }}>设为 1</button>
          </div>
        </div>
      </div>
      <p>这个坑踩过一次就不会忘了，哈哈。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>更复杂的场景：抽成函数或组件</h2>
      <p>当条件越来越多，把所有逻辑都堆在 JSX 里会变成一场灾难。这时候最好的办法是<strong>把条件渲染逻辑抽出去</strong>。</p>

      <p><strong>方式一：抽成一个渲染函数</strong></p>
      <CodeBlock
        language="jsx"
        code={`function App({ status }) {
  function renderContent() {
    if (status === 'loading') return <Spinner />;
    if (status === 'error') return <ErrorMessage />;
    if (status === 'empty') return <EmptyState />;
    return <DataList />;
  }

  return (
    <div>
      <Header />
      {renderContent()}
      <Footer />
    </div>
  );
}`}
      />
      <p>把多分支逻辑集中在一个函数里，JSX 保持干净，维护起来也方便。</p>

      <p><strong>方式二：抽成独立组件（更推荐）</strong></p>
      <CodeBlock
        language="jsx"
        code={`function StatusContent({ status, data }) {
  if (status === 'loading') return <Spinner />;
  if (status === 'error') return <ErrorMessage />;
  if (status === 'empty') return <EmptyState />;
  return <DataList data={data} />;
}

function App({ status, data }) {
  return (
    <div>
      <Header />
      <StatusContent status={status} data={data} />
      <Footer />
    </div>
  );
}`}
      />
      <div className="demo-box">
        <p className="demo-label">多分支抽成组件：StatusContent 根据 status 渲染不同内容</p>
        <div className="demo-output">
          <StatusContentDemo status={status} />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            {['loading', 'error', 'empty', 'success'].map((s) => (
              <button key={s} type="button" onClick={() => setStatus(s)} style={btnStyle}>{s === 'loading' ? '加载中' : s === 'error' ? '错误' : s === 'empty' ? '空' : '成功'}</button>
            ))}
          </div>
        </div>
      </div>
      <p>把条件渲染封装成组件，职责单一，代码复用性也更高。这是更符合 React 思想的写法。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>一个综合的真实场景</h2>
      <p>光看语法有点抽象，来个接近真实项目的例子：一个数据请求页面。</p>
      <CodeBlock
        language="jsx"
        code={`function UserList() {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // 用提前返回处理各种状态
  if (loading) {
    return (
      <div className="center">
        <Spinner />
        <p>加载用户数据中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-box">
        <p>出错了：{error}</p>
        <button onClick={() => window.location.reload()}>重试</button>
      </div>
    );
  }

  // 主体内容
  return (
    <div>
      <h2>用户列表（{users.length} 人）</h2>

      {/* 列表为空时的提示 */}
      {users.length === 0 && (
        <p className="empty-tip">暂时没有用户数据</p>
      )}

      {/* 有数据时渲染列表 */}
      {users.length > 0 && (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              <strong>{user.name}</strong>
              {/* 只有 VIP 用户才显示标签 */}
              {user.isVip && <span className="vip-badge">VIP</span>}
              <span>{user.email}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`}
      />
      <div className="demo-box">
        <p className="demo-label">综合：切换「加载中 / 出错 / 空列表 / 有数据」，体会 if 提前返回 + && 空列表 + VIP 标签</p>
        <div className="demo-output">
          {listView === 'loading' && (
            <div>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>加载用户数据中...</p>
            </div>
          )}
          {listView === 'error' && (
            <div>
              <p style={{ margin: 0, color: 'var(--react-cyan)' }}>出错了</p>
              <button type="button" onClick={() => setListView('loading')} style={btnStyle}>重试</button>
            </div>
          )}
          {listView === 'empty' && (
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>用户列表（0 人）</h3>
              <p className="empty-tip" style={{ margin: 0, color: 'var(--text-muted)' }}>暂时没有用户数据</p>
            </div>
          )}
          {listView === 'list' && (
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>用户列表（{mockUsers.length} 人）</h3>
              <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                {mockUsers.map((user) => (
                  <li key={user.id} style={{ marginBottom: '0.25rem' }}>
                    <strong>{user.name}</strong>
                    {user.isVip && <span style={{ marginLeft: '0.35rem', color: 'var(--react-cyan)', fontSize: '0.85rem' }}>VIP</span>}
                    {' '}
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.email}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => setListView('loading')} style={btnStyle}>加载中</button>
            <button type="button" onClick={() => setListView('error')} style={btnStyle}>出错</button>
            <button type="button" onClick={() => setListView('empty')} style={btnStyle}>空列表</button>
            <button type="button" onClick={() => setListView('list')} style={btnStyle}>有数据</button>
          </div>
        </div>
      </div>
      <p>这个例子里用到了：<code>if</code> 提前返回处理 loading 和 error 状态，<code>&&</code> 处理列表空状态和 VIP 标签。逻辑清晰，每一段代码的意图都很明确。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>几种方式怎么选？</h2>
      <p>简单总结一下选择思路，不用死记：</p>
      <ul>
        <li><strong>用 <code>if/else</code>：</strong> 两个分支都有复杂逻辑，或者需要提前返回处理边界情况。</li>
        <li><strong>用三元运算符：</strong> 嵌在 JSX 里，非 A 即 B 的简单切换，两边内容都不复杂。</li>
        <li><strong>用 <code>&&</code>：</strong> 只有"显示"或"不显示"两种状态，记住数字 0 的坑。</li>
        <li><strong>抽成函数/组件：</strong> 条件超过两三个，或者逻辑开始变得复杂的时候，果断抽出去。</li>
      </ul>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>最后说一句</h2>
      <p>
        条件渲染本身不难，难的是<strong>在代码复杂起来之后还能保持清晰</strong>。多分支嵌套、JSX 里一堆三元表达式、各种 <code>&&</code> 叠在一起——这些都是项目变大之后很容易出现的问题。
      </p>
      <p>解决方法说白了就一个：<strong>逻辑复杂了就抽出去，别让 JSX 变成逻辑的垃圾桶。</strong> 保持组件职责单一，条件渲染自然就会写得优雅。</p>
      <p>多写多练，慢慢就有感觉了。</p>
    </>
  )
}
