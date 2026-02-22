import { useEffect, useState } from 'react'
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

export default function Events() {
  const [wrongFired, setWrongFired] = useState(0)
  const [rightClickCount, setRightClickCount] = useState(0)
  const [eventInfo, setEventInfo] = useState(null)
  const [preventDefaultMsg, setPreventDefaultMsg] = useState(null)
  const [lastBubble, setLastBubble] = useState(null)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [searchValue, setSearchValue] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [todos, setTodos] = useState([
    { id: 1, text: '学 React', done: false },
    { id: 2, text: '写博客', done: false },
  ])
  const [todoInput, setTodoInput] = useState('')

  useEffect(() => {
    setWrongFired(1)
  }, [])

  return (
    <>
      <h1>React 中的事件处理完整指南</h1>
      <p>
        说实话，刚开始学 React 的时候，事件处理这块让我困惑了挺久的。明明跟原生 JS 差不多，但就是有些地方感觉怪怪的，踩了不少坑。所以今天我就把自己的理解整理出来，希望能帮你少走一些弯路。
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>先从最基础的说起</h2>
      <p>在原生 HTML 里，我们是这么绑定事件的：</p>
      <CodeBlock
        language="html"
        code={`<button onclick="handleClick()">点我</button>`}
      />
      <p>到了 React，写法长得很像，但有几个关键区别：</p>
      <CodeBlock
        language="jsx"
        code={`<button onClick={handleClick}>点我</button>`}
      />
      <p>注意看：</p>
      <ul>
        <li>事件名用的是<strong>驼峰命名</strong>（<code>onClick</code> 而不是 <code>onclick</code>）</li>
        <li>花括号里传的是<strong>函数本身</strong>，不是字符串，也不是函数调用</li>
      </ul>
      <p>这个区别很重要，新手经常犯一个错误：</p>
      <CodeBlock
        language="jsx"
        code={`// ❌ 错误！这样写按钮一渲染就会立刻执行 handleClick
<button onClick={handleClick()}>点我</button>

// ✅ 正确！传函数引用
<button onClick={handleClick}>点我</button>`}
      />
      <p>
        为什么呢？因为 <code>handleClick()</code> 加了括号，就相当于在 JSX 里直接调用了这个函数，React 在渲染的时候就执行了，而不是等你点击才执行。
      </p>
      <div className="demo-box">
        <p className="demo-label">对比：错误写法一加载就执行一次，正确写法只有点击才执行</p>
        <div className="demo-output" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>❌ 错误：onClick=&#123;handleClick()&#125;</p>
            <button type="button" onClick={undefined} style={{ ...btnStyle, opacity: 0.9 }}>点我（无效）</button>
            <p style={{ marginTop: '0.5rem', marginBottom: 0, fontSize: '0.9rem' }}>渲染时已执行：<strong style={{ color: 'var(--react-cyan)' }}>{wrongFired}</strong> 次</p>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>✅ 正确：onClick=&#123;handleClick&#125;</p>
            <button type="button" onClick={() => setRightClickCount((c) => c + 1)} style={btnStyle}>点我</button>
            <p style={{ marginTop: '0.5rem', marginBottom: 0, fontSize: '0.9rem' }}>点击次数：<strong style={{ color: 'var(--react-cyan)' }}>{rightClickCount}</strong></p>
          </div>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>事件处理函数怎么定义</h2>
      <p>通常有几种写法，接下来一个一个说清楚。</p>

      <p><strong>方式一：直接在 JSX 里写（适合逻辑很简单的情况）</strong></p>
      <CodeBlock
        language="jsx"
        code={`function App() {
  return (
    <button onClick={() => console.log('点击了')}>
      点我
    </button>
  );
}`}
      />
      <p>这种写法很直观，但如果逻辑复杂，把一堆代码塞在 JSX 里会显得很乱，不建议。</p>

      <p><strong>方式二：单独定义函数（推荐）</strong></p>
      <CodeBlock
        language="jsx"
        code={`function App() {
  function handleClick() {
    console.log('点击了');
    // 可以写很多逻辑
  }

  return <button onClick={handleClick}>点我</button>;
}`}
      />
      <p>更清晰，逻辑和 UI 分离，维护起来方便。</p>

      <p><strong>方式三：箭头函数定义</strong></p>
      <CodeBlock
        language="jsx"
        code={`function App() {
  const handleClick = () => {
    console.log('点击了');
  };

  return <button onClick={handleClick}>点我</button>;
}`}
      />
      <p>跟方式二差不多，个人喜好决定用哪个。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>事件对象 e 是什么</h2>
      <p>
        每个事件处理函数都会自动接收一个事件对象，React 里叫做<strong>合成事件（SyntheticEvent）</strong>：
      </p>
      <CodeBlock
        language="jsx"
        code={`function handleClick(e) {
  console.log(e);          // 合成事件对象
  console.log(e.target);   // 触发事件的 DOM 元素
  console.log(e.type);     // 事件类型，比如 "click"
}`}
      />
      <p>
        这个 <code>e</code> 不是原生浏览器的事件对象，而是 React 封装了一层的合成事件。为什么要封装？因为不同浏览器的事件对象行为不一样，React 帮你抹平了这些差异，写一套代码到处跑。
      </p>
      <div className="demo-box">
        <p className="demo-label">点击按钮，查看合成事件 e 的关键字段</p>
        <div className="demo-output" style={{ marginBottom: '0.5rem' }}>
          <button type="button" onClick={(e) => setEventInfo({ type: e.type, tagName: e.target.tagName, text: e.target.textContent?.slice(0, 20) })} style={btnStyle}>
            点我，看 e 的信息
          </button>
          {eventInfo && (
            <pre style={{ marginTop: '0.75rem', marginBottom: 0, fontSize: '0.85rem', background: 'var(--code-bg)', padding: '0.5rem', borderRadius: 6 }}>
              {`e.type: "${eventInfo.type}"\ne.target.tagName: "${eventInfo.tagName}"\ne.target.textContent: "${eventInfo.text}"`}
            </pre>
          )}
        </div>
      </div>

      <p><strong>阻止默认行为</strong></p>
      <p>比如你有一个 <code>&lt;a&gt;</code> 标签，不想让它跳转页面：</p>
      <CodeBlock
        language="jsx"
        code={`function handleClick(e) {
  e.preventDefault(); // 阻止默认跳转
  console.log('链接被点了，但没跳转');
}

return <a href="https://example.com" onClick={handleClick}>点我</a>;`}
      />
      <div className="demo-box">
        <p className="demo-label">下面的链接点了不会跳转，会显示「已阻止默认行为」</p>
        <div className="demo-output">
          <a
            href="https://example.com"
            onClick={(e) => { e.preventDefault(); setPreventDefaultMsg('已阻止默认行为，未跳转'); }}
            style={{ color: 'var(--react-cyan)', textDecoration: 'underline', cursor: 'pointer' }}
          >
            点我（不会跳转）
          </a>
          {preventDefaultMsg && <p style={{ marginTop: '0.5rem', marginBottom: 0, color: 'var(--react-cyan)', fontWeight: 600 }}>{preventDefaultMsg}</p>}
        </div>
      </div>

      <p><strong>阻止事件冒泡</strong></p>
      <CodeBlock
        language="jsx"
        code={`function handleInnerClick(e) {
  e.stopPropagation(); // 不让事件传递给父元素
  console.log('内层被点了');
}`}
      />
      <div className="demo-box">
        <p className="demo-label">点内层按钮只触发「内层」；点外层空白触发「外层」。内层用了 stopPropagation，所以不会冒泡到外层</p>
        <div
          className="demo-output"
          style={{ padding: '1rem', background: 'rgba(97, 218, 251, 0.08)', borderRadius: 8, cursor: 'pointer' }}
          onClick={() => setLastBubble('外层')}
          role="presentation"
        >
          <p style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.9rem' }}>外层（点这里 → 显示「外层」）</p>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLastBubble('内层'); }}
            style={btnStyle}
          >
            内层按钮（点我 → 只显示「内层」）
          </button>
          {lastBubble && <p style={{ marginTop: '0.5rem', marginBottom: 0, color: 'var(--react-cyan)', fontWeight: 600 }}>最近触发：{lastBubble}</p>}
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>向事件处理函数传参</h2>
      <p>这是很多人纠结的地方。比如你渲染了一个列表，点击某一项的时候，想把这一项的 id 传进去：</p>
      <CodeBlock
        language="jsx"
        code={`function App() {
  const items = [
    { id: 1, name: '苹果' },
    { id: 2, name: '香蕉' },
    { id: 3, name: '橘子' },
  ];

  function handleItemClick(id) {
    console.log('点击了 id:', id);
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => handleItemClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}`}
      />
      <p>这里用箭头函数包一层，就可以优雅地传参了。</p>
      <p>如果你既想传自定义参数，又想用到事件对象 <code>e</code>：</p>
      <CodeBlock
        language="jsx"
        code={`function handleItemClick(id, e) {
  e.preventDefault();
  console.log('id:', id, '事件:', e);
}

// 调用时
onClick={(e) => handleItemClick(item.id, e)}`}
      />
      <div className="demo-box">
        <p className="demo-label">点击某一项，下方会显示传入的 id</p>
        <div className="demo-output">
          <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: '0.5rem' }}>
            {[{ id: 1, name: '苹果' }, { id: 2, name: '香蕉' }, { id: 3, name: '橘子' }].map((item) => (
              <li
                key={item.id}
                onClick={() => setSelectedItemId(item.id)}
                style={{ cursor: 'pointer', padding: '0.25rem 0', color: 'var(--react-cyan)' }}
              >
                {item.name}（id: {item.id}）
              </li>
            ))}
          </ul>
          {selectedItemId != null && <p style={{ marginBottom: 0, fontWeight: 600 }}>当前点击的 id：<strong style={{ color: 'var(--react-cyan)' }}>{selectedItemId}</strong></p>}
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>在类组件里，this 的问题（血泪史）</h2>
      <p>如果你还在用类组件，或者维护老项目，这个问题你一定会遇到。</p>
      <CodeBlock
        language="jsx"
        code={`class App extends React.Component {
  handleClick() {
    // ❌ 报错！this 是 undefined
    this.setState({ clicked: true });
  }

  render() {
    return <button onClick={this.handleClick}>点我</button>;
  }
}`}
      />
      <p>为什么？因为把 <code>this.handleClick</code> 作为回调传进去的时候，函数的 <code>this</code> 绑定丢失了。</p>
      <p>解决方案有三种：</p>

      <p><strong>方案一：构造函数里 bind</strong></p>
      <CodeBlock
        language="jsx"
        code={`constructor(props) {
  super(props);
  this.handleClick = this.handleClick.bind(this);
}`}
      />

      <p><strong>方案二：箭头函数定义方法（推荐）</strong></p>
      <CodeBlock
        language="jsx"
        code={`handleClick = () => {
  this.setState({ clicked: true }); // this 正常
};`}
      />

      <p><strong>方案三：行内箭头函数</strong></p>
      <CodeBlock
        language="jsx"
        code={`<button onClick={() => this.handleClick()}>点我</button>`}
      />
      <p>不过方案三有个小缺点：每次渲染都会创建新函数，在性能敏感的场景稍微注意一下。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>常见的事件类型速查</h2>
      <p>React 支持几乎所有的原生事件，只是改成了驼峰写法：</p>
      <div className="demo-box" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>原生事件</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>React 写法</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '0.5rem' }}><code>onclick</code></td>
              <td style={{ padding: '0.5rem' }}><code>onClick</code></td>
              <td style={{ padding: '0.5rem' }}>点击</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '0.5rem' }}><code>onchange</code></td>
              <td style={{ padding: '0.5rem' }}><code>onChange</code></td>
              <td style={{ padding: '0.5rem' }}>输入框内容变化</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '0.5rem' }}><code>onsubmit</code></td>
              <td style={{ padding: '0.5rem' }}><code>onSubmit</code></td>
              <td style={{ padding: '0.5rem' }}>表单提交</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '0.5rem' }}><code>onmouseover</code></td>
              <td style={{ padding: '0.5rem' }}><code>onMouseOver</code></td>
              <td style={{ padding: '0.5rem' }}>鼠标悬停</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '0.5rem' }}><code>onkeydown</code></td>
              <td style={{ padding: '0.5rem' }}><code>onKeyDown</code></td>
              <td style={{ padding: '0.5rem' }}>键盘按下</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '0.5rem' }}><code>onfocus</code></td>
              <td style={{ padding: '0.5rem' }}><code>onFocus</code></td>
              <td style={{ padding: '0.5rem' }}>元素获取焦点</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '0.5rem' }}><code>onblur</code></td>
              <td style={{ padding: '0.5rem' }}><code>onBlur</code></td>
              <td style={{ padding: '0.5rem' }}>元素失去焦点</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p><strong>一个输入框的完整例子：</strong></p>
      <CodeBlock
        language="jsx"
        code={`function SearchInput() {
  const [value, setValue] = React.useState('');

  function handleChange(e) {
    setValue(e.target.value);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      console.log('搜索：', value);
    }
  }

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="输入后按回车搜索"
    />
  );
}`}
      />
      <div className="demo-box">
        <p className="demo-label">输入后按回车，下方会显示「搜索：xxx」</p>
        <div className="demo-output">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') setSearchResult(searchValue || '(空)'); }}
            placeholder="输入后按回车搜索"
            style={{ padding: '0.4rem 0.6rem', width: '100%', maxWidth: 280, borderRadius: 6, border: '1px solid var(--border-color)' }}
          />
          {searchResult != null && <p style={{ marginTop: '0.5rem', marginBottom: 0, color: 'var(--react-cyan)', fontWeight: 600 }}>搜索：{searchResult}</p>}
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>事件委托，React 帮你做了</h2>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 280px', minWidth: 0 }}>
          <p>
            在原生 JS 中，我们有时候会把事件绑定在父元素上，来统一处理子元素的事件，这叫事件委托。
          </p>
          <p style={{ marginBottom: 0 }}>
            React 内部其实自动做了这件事——它把所有事件都绑定在根节点上（React 17 之前是 <code>document</code>，之后改成了根 DOM 容器），然后通过事件冒泡来分发处理。这就是为什么 React 的事件系统又快又高效。
          </p>
        </div>
        <img
          src="/event-delegation-react.png"
          alt="React 事件委托示意：事件在根节点统一监听，通过冒泡分发"
          style={{ maxWidth: 320, width: '100%', borderRadius: 8, flexShrink: 0 }}
        />
      </div>
      <p style={{ marginTop: '1rem' }}>作为使用者，你不需要关心这些底层实现，知道有这么回事就好。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>一个综合的小例子，串起来</h2>
      <p>最后来个稍微完整的例子，把上面的内容串一串：</p>
      <CodeBlock
        language="jsx"
        code={`function TodoList() {
  const [todos, setTodos] = React.useState([
    { id: 1, text: '学 React', done: false },
    { id: 2, text: '写博客', done: false },
  ]);
  const [input, setInput] = React.useState('');

  function handleAdd(e) {
    e.preventDefault(); // 阻止表单默认提交行为
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input, done: false }]);
    setInput('');
  }

  function handleToggle(id) {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  }

  function handleDelete(id, e) {
    e.stopPropagation(); // 阻止冒泡，不触发 li 的 onClick
    setTodos(todos.filter(todo => todo.id !== id));
  }

  return (
    <div>
      <form onSubmit={handleAdd}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="添加新任务"
        />
        <button type="submit">添加</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li
            key={todo.id}
            onClick={() => handleToggle(todo.id)}
            style={{ textDecoration: todo.done ? 'line-through' : 'none', cursor: 'pointer' }}
          >
            {todo.text}
            <button onClick={(e) => handleDelete(todo.id, e)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}`}
      />
      <p>这个例子用到了：表单提交事件、输入框 onChange、列表项点击传参、以及阻止冒泡。</p>
      <div className="demo-box">
        <p className="demo-label">可交互 TodoList：添加、点击项切换完成态、点「删除」不会触发整行点击（stopPropagation）</p>
        <div className="demo-output">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!todoInput.trim()) return
              setTodos([...todos, { id: Date.now(), text: todoInput.trim(), done: false }])
              setTodoInput('')
            }}
            style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}
          >
            <input
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              placeholder="添加新任务"
              style={{ padding: '0.4rem 0.6rem', flex: '1 1 120px', minWidth: 0, borderRadius: 6, border: '1px solid var(--border-color)' }}
            />
            <button type="submit" style={btnStyle}>添加</button>
          </form>
          <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
            {todos.map((todo) => (
              <li
                key={todo.id}
                onClick={() => setTodos(todos.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t)))}
                style={{ textDecoration: todo.done ? 'line-through' : 'none', cursor: 'pointer', padding: '0.25rem 0', color: 'var(--react-cyan)' }}
              >
                {todo.text}
                {' '}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setTodos(todos.filter((t) => t.id !== todo.id)); }}
                  style={{ ...btnStyle, padding: '0.2rem 0.5rem', fontSize: '0.85rem' }}
                >
                  删除
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>总结</h2>
      <p>React 的事件处理其实并不复杂，把几个核心点记住就行：</p>
      <ul>
        <li>事件名用驼峰命名，传函数引用而不是调用</li>
        <li>事件对象 <code>e</code> 是合成事件，<code>preventDefault</code> 和 <code>stopPropagation</code> 照常用</li>
        <li>需要传参时，用箭头函数包一层</li>
        <li>类组件里注意 <code>this</code> 的绑定问题（现在用函数组件就没这烦恼了）</li>
      </ul>
    </>
  )
}
