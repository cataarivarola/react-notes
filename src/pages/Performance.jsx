import { useState, useCallback, useMemo, useRef } from 'react'
import React from 'react'
import CodeBlock from '../components/CodeBlock'

const demoBox = {
  padding: '1rem 1.25rem',
  margin: '1rem 0',
  borderRadius: 10,
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border-color)',
  fontSize: '0.9rem',
}

// 1. 父重渲 → 整棵子树高亮
function RenderTreeViz() {
  const [count, setCount] = useState(0)
  const [flash, setFlash] = useState(false)
  const onTap = () => {
    setCount((c) => c + 1)
    setFlash(true)
    setTimeout(() => setFlash(false), 400)
  }
  const hi = (v) => (flash ? { boxShadow: '0 0 0 2px var(--react-cyan)', background: 'rgba(97, 218, 251, 0.15)' } : {})
  return (
    <div style={demoBox}>
      <p style={{ margin: '0 0 0.75rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>点击 Parent 的 +1，观察整棵子树都会「重渲染」高亮：</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <button type="button" onClick={onTap} style={{ padding: '0.4rem 0.8rem', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', cursor: 'pointer' }}>
          Parent 点击 +1（当前 {count}）
        </button>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <div style={{ padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid var(--border-color)', ...hi(1) }}>Parent</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid var(--border-color)', ...hi(2) }}>ChildA</div>
            <div style={{ padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid var(--border-color)', ...hi(3) }}>ChildB</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 2. 有无 memo 的渲染次数对比
function ChildNoMemo({ name }) {
  const renders = useRef(0)
  renders.current += 1
  return <div style={{ marginTop: '0.5rem' }}>Child 渲染次数: <strong>{renders.current}</strong>（props: {name}）</div>
}
const ChildMemo = React.memo(function ChildMemo({ name }) {
  const renders = useRef(0)
  renders.current += 1
  return <div style={{ marginTop: '0.5rem' }}>Child 渲染次数: <strong>{renders.current}</strong>（props: {name}）</div>
})
function MemoCompareColumn({ useMemoChild, label }) {
  const [count, setCount] = useState(0)
  const parentRenders = useRef(0)
  parentRenders.current += 1
  const Child = useMemoChild ? ChildMemo : ChildNoMemo
  return (
    <div style={{ flex: 1, padding: '0.75rem', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
      <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--react-cyan)' }}>{label}</div>
      <div>Parent 渲染次数: <strong>{parentRenders.current}</strong></div>
      <button type="button" onClick={() => setCount((c) => c + 1)} style={{ marginTop: '0.5rem', padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}>+1</button>
      <Child name="固定" />
    </div>
  )
}
function MemoCompareViz() {
  return (
    <div style={demoBox}>
      <p style={{ margin: '0 0 0.75rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>左右各点 +1，对比 Child 的渲染次数是否增加：</p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <MemoCompareColumn useMemoChild={false} label="无 React.memo" />
        <MemoCompareColumn useMemoChild label="有 React.memo" />
      </div>
    </div>
  )
}

// 3. 传内联对象 vs useMemo 对象
const StyleChildMemo = React.memo(function StyleChildMemo({ style }) {
  const renders = useRef(0)
  renders.current += 1
  return <div style={{ marginTop: '0.5rem' }}>Child 渲染次数: <strong>{renders.current}</strong></div>
})
function StyleRefColumn({ stableStyle, label }) {
  const [count, setCount] = useState(0)
  const style = stableStyle ? useMemo(() => ({ color: 'red' }), []) : { color: 'red' }
  return (
    <div style={{ flex: 1, padding: '0.75rem', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
      <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--react-cyan)' }}>{label}</div>
      <button type="button" onClick={() => setCount((c) => c + 1)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}>Parent +1</button>
      <StyleChildMemo style={style} />
    </div>
  )
}
function StyleRefViz() {
  return (
    <div style={demoBox}>
      <p style={{ margin: '0 0 0.75rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>传对象给 memo 子组件：左侧每次新对象，右侧 useMemo 稳定引用。</p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <StyleRefColumn stableStyle={false} label="内联 style（每次新引用）" />
        <StyleRefColumn stableStyle label="useMemo(() => style, [])" />
      </div>
    </div>
  )
}

// 4. useCallback：输入框导致父重渲，有无 useCallback 对子组件的影响
const CallbackChildMemo = React.memo(function CallbackChildMemo({ onSubmit }) {
  const renders = useRef(0)
  renders.current += 1
  return <div style={{ marginTop: '0.5rem' }}>Child 渲染次数: <strong>{renders.current}</strong></div>
})
function UseCallbackColumn({ useCallbackForFn, label }) {
  const [text, setText] = useState('')
  const fn = useCallbackForFn ? useCallback(() => {}, []) : () => {}
  return (
    <div style={{ flex: 1, padding: '0.75rem', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
      <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--react-cyan)' }}>{label}</div>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="输入试试" style={{ width: '100%', padding: '0.35rem', marginBottom: '0.5rem' }} />
      <CallbackChildMemo onSubmit={fn} />
    </div>
  )
}
function UseCallbackInputViz() {
  return (
    <div style={demoBox}>
      <p style={{ margin: '0 0 0.75rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>在输入框打字会触发父组件重渲。左侧回调每次新建，子组件跟着渲；右侧 useCallback 稳定引用，子组件不重渲。</p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <UseCallbackColumn useCallbackForFn={false} label="内联函数（每次新引用）" />
        <UseCallbackColumn useCallbackForFn label="useCallback(() => {}, [])" />
      </div>
    </div>
  )
}

// 5. useMemo 依赖不变用缓存
function UseMemoCacheViz() {
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const computeCount = useRef(0)
  const result = useMemo(() => {
    computeCount.current += 1
    return `category=${category}, sortBy=${sortBy}（第 ${computeCount.current} 次计算）`
  }, [category, sortBy])
  return (
    <div style={demoBox}>
      <p style={{ margin: '0 0 0.75rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>只有 category 或 sortBy 变化时才会重新计算，否则使用缓存：</p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          category:
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '0.35rem' }}>
            <option value="all">all</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          sortBy:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '0.35rem' }}>
            <option value="name">name</option>
            <option value="price">price</option>
          </select>
        </label>
      </div>
      <div style={{ marginTop: '0.75rem', padding: '0.5rem', borderRadius: 6, background: 'rgba(97, 218, 251, 0.1)', fontSize: '0.85rem' }}>
        结果: {result}
      </div>
    </div>
  )
}

// 6. 三者关系图
const boxStyle = (highlight) => ({
  padding: '0.6rem 0.9rem',
  borderRadius: 8,
  border: `2px solid ${highlight ? 'var(--react-cyan)' : 'var(--border-color)'}`,
  background: highlight ? 'rgba(97, 218, 251, 0.12)' : 'var(--bg-primary)',
  cursor: 'default',
  transition: 'border-color 0.2s, background 0.2s',
})
function ThreeToolsRelationViz() {
  const [hover, setHover] = useState(null)
  const items = [
    { key: 'memo', label: 'React.memo', desc: '控制组件要不要重渲' },
    { key: 'cb', label: 'useCallback', desc: '稳定函数引用，配合 memo' },
    { key: 'um', label: 'useMemo', desc: '稳定值/计算结果，配合 memo' },
  ]
  return (
    <div style={demoBox}>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {items.map((r) => (
          <span
            key={r.key}
            onMouseEnter={() => setHover(r.key)}
            onMouseLeave={() => setHover(null)}
            style={{ ...boxStyle(hover === r.key), minWidth: 120, textAlign: 'center' }}
          >
            <div style={{ fontWeight: 600, color: 'var(--react-cyan)' }}>{r.label}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.desc}</div>
          </span>
        ))}
      </div>
    </div>
  )
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
const calloutWarn = {
  padding: '1rem 1.25rem',
  margin: '1.25rem 0',
  borderRadius: 8,
  borderLeft: '4px solid #f59e0b',
  background: 'rgba(245, 158, 11, 0.08)',
  fontSize: '0.95rem',
}
const introBlock = {
  marginTop: '1rem',
  marginBottom: '1.5rem',
  padding: '1.5rem 1.75rem',
  borderRadius: 12,
  background: 'linear-gradient(135deg, rgba(97, 218, 251, 0.08) 0%, rgba(97, 218, 251, 0.02) 100%)',
  border: '1px solid var(--border-color)',
  fontSize: '1rem',
  lineHeight: 1.75,
  color: 'var(--text-primary)',
}
const codeHighlight = { padding: '0.15em 0.4em', borderRadius: 4, background: 'rgba(97, 218, 251, 0.2)', color: 'var(--react-cyan)' }
const mechanismBlock = {
  margin: '1rem 0 1.5rem',
  padding: '1.25rem 1.5rem',
  borderRadius: 10,
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border-color)',
  fontSize: '0.98rem',
  lineHeight: 1.7,
}
const coreRule = {
  margin: '1rem 0',
  padding: '0.75rem 1rem',
  borderRadius: 8,
  borderLeft: '4px solid var(--react-cyan)',
  background: 'rgba(97, 218, 251, 0.08)',
  fontWeight: 600,
  color: 'var(--text-primary)',
}
const calloutTip = {
  padding: '1rem 1.25rem',
  margin: '1.25rem 0',
  borderRadius: 8,
  borderLeft: '4px solid var(--react-cyan)',
  background: 'linear-gradient(135deg, rgba(97, 218, 251, 0.1) 0%, rgba(97, 218, 251, 0.03) 100%)',
  fontSize: '0.95rem',
}

const CODE_USER_CARD = `// 没有 memo 的版本
function UserCard({ name, avatar }) {
  console.log('UserCard 渲染了'); // 每次父组件更新都会打印
  return (
    <div>
      <img src={avatar} alt={name} />
      <span>{name}</span>
    </div>
  );
}

// 加了 memo 的版本
const UserCard = React.memo(function UserCard({ name, avatar }) {
  console.log('UserCard 渲染了'); // 只有 name 或 avatar 变化时才打印
  return (
    <div>
      <img src={avatar} alt={name} />
      <span>{name}</span>
    </div>
  );
});`

const CODE_PARENT_STYLE = `function Parent() {
  const [count, setCount] = useState(0);
  
  // 🚨 每次 Parent 渲染，这个对象都是全新的引用！
  const style = { color: 'red', fontSize: 14 };
  
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <MemoChild style={style} /> {/* memo 形同虚设 */}
    </>
  );
}`

const CODE_PARENT_HANDLECLICK = `function Parent() {
  const [count, setCount] = useState(0);
  
  // 每次 Parent 渲染，handleClick 都是一个全新的函数
  const handleClick = () => {
    console.log('clicked');
  };
  
  return <Child onClick={handleClick} />;
}`

const CODE_PARENT_USECALLBACK = `function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  
  // 只有 count 变化时，handleSubmit 才会重新创建
  const handleSubmit = useCallback(() => {
    console.log('提交，当前 count：', count);
  }, [count]); // 依赖 count
  
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <MemoChild onSubmit={handleSubmit} />
    </>
  );
}`

const CODE_USECALLBACK_WRONG = `// 🚨 错误示例：依赖项写空，但用到了 count
const handleClick = useCallback(() => {
  console.log(count); // 永远是 count 的初始值 0
}, []); // 没有把 count 放进去

// ✅ 正确写法
const handleClick = useCallback(() => {
  console.log(count);
}, [count]);`

const CODE_PRODUCT_LIST_NO_MEMO = `function ProductList({ products, category, sortBy }) {
  // 没有 useMemo：每次组件渲染都重新过滤和排序
  const filteredProducts = products
    .filter(p => p.category === category)
    .sort((a, b) => a[sortBy] - b[sortBy]);
  
  return <ul>{filteredProducts.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}`

const CODE_PRODUCT_LIST_USE_MEMO = `function ProductList({ products, category, sortBy }) {
  // 有 useMemo：只有 products、category、sortBy 变化时才重新计算
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => p.category === category)
      .sort((a, b) => a[sortBy] - b[sortBy]);
  }, [products, category, sortBy]);
  
  return <ul>{filteredProducts.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}`

const CODE_PARENT_USE_MEMO_STYLE = `function Parent() {
  const [count, setCount] = useState(0);
  
  // ✅ 只有需要的时候才创建新对象
  const style = useMemo(() => ({ color: 'red', fontSize: 14 }), []);
  
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <MemoChild style={style} /> {/* 现在 memo 真正生效了 */}
    </>
  );
}`

export default function Performance() {
  return (
    <>
      <h1>React 性能优化：React.memo、useCallback 和 useMemo 完全指南</h1>
      <div style={introBlock}>
        <p style={{ margin: 0, marginBottom: '0.85rem' }}>
        刚开始学 React 的时候，完全不在乎性能这件事。组件能跑就行，功能实现了就开心。直到有一天，我做的一个列表页面卡得像在幻灯片放映，用户体验惨不忍睹，才开始认真研究这三个东西：<code style={codeHighlight}>React.memo</code>、<code style={codeHighlight}>useCallback</code>、<code style={codeHighlight}>useMemo</code>。
        </p>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          这篇文章我想用最接地气的方式聊聊这三个 API，不只是告诉你"怎么用"，更想告诉你<strong>"为什么用"</strong>和<strong>"什么时候别用"</strong>。
        </p>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>先聊聊 React 的渲染机制</h2>
      <div style={mechanismBlock}>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          在讲优化之前，得先搞清楚 React 为什么会"多余地"渲染。
        </p>
        <div style={coreRule}>
          只要父组件重新渲染，子组件就跟着重新渲染
        </div>
        <p style={{ margin: 0, marginBottom: '0.75rem' }}>
          不管子组件的 props 有没有变化，一律重跑。大多数情况下这没什么问题，因为 React 的虚拟 DOM diff 很快。但当组件树很深、或者某个组件渲染成本很高的时候，这种"无脑重渲"就开始拖后腿了。
        </p>
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          React 给我们提供了三个工具来应对这种情况，但很多人用错了，或者滥用了。
        </p>
      </div>
      <RenderTreeViz />

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>React.memo：给组件加一层"记忆"</h2>
      <h3>它解决什么问题？</h3>
      <p>假设你有一个子组件，只负责展示一条用户信息，本身逻辑很简单。但它的父组件因为各种原因频繁更新，导致这个子组件每次都跟着重新渲染——即使它接收到的 props 根本没变。这就是 <code>React.memo</code> 出手的场景。</p>
      <CodeBlock language="jsx" code={CODE_USER_CARD} />
      <MemoCompareViz />
      <p><code>React.memo</code> 会对 props 做<strong>浅比较</strong>。如果前后两次的 props 引用没变，就直接跳过渲染，复用上一次的结果。</p>
      <h3>浅比较的坑</h3>
      <p>这里有个坑很多人踩过。浅比较意味着对于对象、数组、函数这类引用类型，比较的是<strong>内存地址</strong>，不是内容。</p>
      <CodeBlock language="jsx" code={CODE_PARENT_STYLE} />
      <StyleRefViz />
      <p>即使 <code>style</code> 的内容没变，但每次 <code>Parent</code> 渲染都会创建一个新对象，<code>React.memo</code> 认为 props 变了，还是会重新渲染。这个时候就需要 <code>useMemo</code> 来配合了（后面会说）。</p>
      <h3>什么时候用？</h3>
      <ul>
        <li>组件渲染成本比较高（复杂的 UI、大量计算）</li>
        <li>组件接收的 props 很少变化</li>
        <li>父组件更新频繁，但跟这个子组件无关</li>
      </ul>
      <p>什么时候<strong>别用</strong>？组件本来就很轻量，加了 <code>memo</code> 反而多了比较开销，得不偿失。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>useCallback：给函数加一层"稳定性"</h2>
      <h3>函数引用为什么会变？</h3>
      <p>在 React 函数组件里，每次渲染都会重新执行整个函数体。这意味着你在组件里定义的每一个函数，每次渲染都是全新创建的，引用地址都不一样。</p>
      <CodeBlock language="jsx" code={CODE_PARENT_HANDLECLICK} />
      <p>如果 <code>Child</code> 用了 <code>React.memo</code>，但 <code>handleClick</code> 每次都是新引用，<code>memo</code> 就白加了。</p>
      <h3>useCallback 的作用</h3>
      <p><code>useCallback</code> 会把函数"缓存"起来，只有当依赖项变化时才重新创建：</p>
      <CodeBlock language="jsx" code={CODE_PARENT_USECALLBACK} />
      <UseCallbackInputViz />
      <p>现在当用户输入文字导致 <code>text</code> 变化时，<code>Parent</code> 重新渲染，但 <code>handleSubmit</code> 的引用保持不变，<code>MemoChild</code> 就不会跟着渲染了。</p>
      <h3>依赖项一定要写对</h3>
      <p>这是 <code>useCallback</code>（以及所有 hooks）最容易犯错的地方。依赖项写漏了，会导致闭包里读到的是旧值（stale closure）：</p>
      <CodeBlock language="jsx" code={CODE_USECALLBACK_WRONG} />
      <p>我建议直接用 ESLint 的 <code>eslint-plugin-react-hooks</code>，它会帮你检查依赖项有没有写全，省去很多排查 bug 的时间。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>useMemo：给计算结果加一层"缓存"</h2>
      <h3>它解决的问题</h3>
      <p>有时候组件里有一些复杂的计算，比如对一个大数组做过滤、排序、统计——这些操作如果每次渲染都重跑一遍，性能肯定差。<code>useMemo</code> 可以把计算结果缓存起来，依赖项不变就直接用上次的结果：</p>
      <CodeBlock language="jsx" code={CODE_PRODUCT_LIST_NO_MEMO} />
      <CodeBlock language="jsx" code={CODE_PRODUCT_LIST_USE_MEMO} />
      <UseMemoCacheViz />
      <h3>结合 React.memo 解决对象引用问题</h3>
      <p>还记得前面说的 <code>style</code> 对象问题吗？用 <code>useMemo</code> 可以解决：</p>
      <CodeBlock language="jsx" code={CODE_PARENT_USE_MEMO_STYLE} />

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>三者的关系和配合</h2>
      <p>这三个工具其实是一套组合拳：</p>
      <ul>
        <li><strong>React.memo</strong> 控制组件要不要重新渲染</li>
        <li><strong>useCallback</strong> 让函数引用保持稳定，配合 memo 使用</li>
        <li><strong>useMemo</strong> 让对象引用和计算结果保持稳定，也配合 memo 使用</li>
      </ul>
      <ThreeToolsRelationViz />
      <p>单独用 <code>React.memo</code> 但不处理 props 里的函数和对象，大概率没效果。配合 <code>useCallback</code> 和 <code>useMemo</code> 才能真正稳定住 props，让 memo 发挥作用。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>别过度优化</h2>
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap', margin: '1rem 0' }}>
        <div style={{ flex: '1 1 280px', minWidth: 0 }}>
          <p style={{ margin: '0 0 0.75rem 0' }}>说了这么多"怎么用"，最后我想说说"别乱用"。</p>
          <p style={{ margin: 0 }}>这三个 API 都有开销：它们需要存储上一次的值，每次渲染都要做比较。如果你的组件本身很轻量，加了这些优化反而可能更慢。</p>
        </div>
        <img
          src="/perf-hotspot.png"
          alt="性能热点示意：用 Profiler 找到真正的瓶颈"
          style={{ width: '100%', maxWidth: 180, height: 'auto', objectFit: 'contain', borderRadius: 8, flexShrink: 0, border: '1px solid var(--border-color)' }}
        />
      </div>
      <div style={calloutTip}>
        <strong>一个比较实用的原则：先写干净的代码，遇到实际的性能问题再用工具解决。</strong>用 React DevTools 的 Profiler 找到真正的渲染瓶颈，然后有针对性地优化，比盲目地给每个组件都套上 memo 要靠谱得多。
      </div>
      <p>性能优化是手术，不是保健品，不需要每天吃。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>小结</h2>
      <div className="table-scroll">
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}></th>
            <th style={thStyle}>作用</th>
            <th style={thStyle}>典型场景</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyle}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--react-cyan)', display: 'inline-flex' }} aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="9" x2="15" y2="15" /><line x1="15" y1="9" x2="9" y2="15" /></svg>
                </span>
                <strong>React.memo</strong>
              </span>
            </td>
            <td style={tdStyle}>跳过 props 未变化的组件渲染</td>
            <td style={tdStyle}>纯展示组件、渲染成本高的子组件</td>
          </tr>
          <tr>
            <td style={tdStyle}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--react-cyan)', display: 'inline-flex' }} aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                </span>
                <strong>useCallback</strong>
              </span>
            </td>
            <td style={tdStyle}>缓存函数引用</td>
            <td style={tdStyle}>传给 memo 子组件的回调函数</td>
          </tr>
          <tr>
            <td style={tdStyle}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--react-cyan)', display: 'inline-flex' }} aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                </span>
                <strong>useMemo</strong>
              </span>
            </td>
            <td style={tdStyle}>缓存计算结果或对象引用</td>
            <td style={tdStyle}>复杂计算、传给 memo 子组件的对象</td>
          </tr>
        </tbody>
      </table>
      </div>
      <p>理解了 React 的渲染机制，这三个工具自然就知道该怎么用了。与其死记用法，不如搞清楚"React 什么时候会重新渲染"这个底层逻辑——其他的都是水到渠成的事。</p>
    </>
  )
}
