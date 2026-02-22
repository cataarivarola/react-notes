import { useEffect, useRef, useState } from 'react'
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

function TimerChild() {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])
  return <span style={{ color: 'var(--react-cyan)', fontWeight: 600 }}>已运行：{seconds} 秒</span>
}

function ExecutionOrderLogger({ logRef }) {
  logRef.current.push('render')
  useEffect(() => {
    logRef.current.push('effect')
    return () => logRef.current.push('cleanup')
  })
  return null
}

export default function Lifecycle() {
  const [showClassLifecycle, setShowClassLifecycle] = useState(false)
  const [phaseActive, setPhaseActive] = useState(null)
  const [showChild, setShowChild] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState('1')
  const [effectRunCount, setEffectRunCount] = useState(0)
  const logRef = useRef([])
  const [trigger, setTrigger] = useState(0)
  const [displayLog, setDisplayLog] = useState([])

  useEffect(() => {
    setEffectRunCount((c) => c + 1)
  }, [selectedUserId])

  return (
    <>
      <h1>React 生命周期</h1>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>先理解「生命周期」这个概念本身</h2>
      <p>你可以把一个 React 组件想象成一个人。</p>
      <p>
        人有出生、成长、死亡。React 组件也一样——它被创建出来（挂载），在页面上活着并响应各种变化（更新），最后从页面上消失（卸载）。生命周期，就是这个过程中各个关键节点的「钩子」，让你有机会在特定时刻做一些事情。
      </p>
      <div className="demo-box">
        <p className="demo-label">三个核心阶段：点击任意一块可高亮，帮助记忆</p>
        <div className="demo-output" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['挂载（Mount）', '更新（Update）', '卸载（Unmount）'].map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setPhaseActive(phaseActive === i ? null : i)}
              style={{
                ...btnStyle,
                background: phaseActive === i ? 'var(--react-cyan)' : 'var(--react-cyan-light)',
                color: phaseActive === i ? '#0f172a' : 'var(--react-cyan)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
        {phaseActive !== null && (
          <p style={{ marginTop: '0.5rem', marginBottom: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {phaseActive === 0 && '组件第一次出现在页面上'}
            {phaseActive === 1 && 'props 或 state 变化，组件重新渲染'}
            {phaseActive === 2 && '组件从页面上被移除，需做清理'}
          </p>
        )}
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2
        style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        onClick={() => setShowClassLifecycle((v) => !v)}
      >
        类组件时代的生命周期
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>
          {showClassLifecycle ? '（点击收起）' : '（点击展开）'}
        </span>
      </h2>

      {showClassLifecycle && (
        <>
          <p>虽然现在 Hooks 大行其道，但类组件的生命周期是理解整个体系的基础，绕不过去。</p>

          <h3>第一阶段：挂载（Mounting）</h3>
          <p>组件第一次出现在页面上，就是挂载。这个阶段会依次经历：</p>

          <h4>constructor()</h4>
          <p>组件的构造函数，最先执行。你可以在这里初始化 state，或者绑定事件处理函数。</p>
          <CodeBlock
            language="jsx"
            code={`constructor(props) {
  super(props);
  this.state = { count: 0 };
}`}
          />
          <p>注意：别在这里搞副作用，不然你会后悔的。</p>

          <h4>render()</h4>
          <p>这是类组件里唯一必须实现的方法。它的工作就一个：返回 JSX，告诉 React 该渲染什么。</p>
          <p>render 应该是纯函数，不要在里面改 state，不要搞异步请求，啥副作用都不要有。</p>

          <h4>componentDidMount()</h4>
          <p>组件挂载到 DOM 之后立刻调用。这里是你的黄金时机——发请求、订阅事件、操作 DOM，都在这里干。</p>
          <CodeBlock
            language="jsx"
            code={`componentDidMount() {
  fetch('/api/data')
    .then(res => res.json())
    .then(data => this.setState({ data }));
}`}
          />
          <p>为什么不在 constructor 里发请求？因为那时候组件还没挂到页面上，很多操作根本没法做。</p>

          <h3>第二阶段：更新（Updating）</h3>
          <p>当 props 或 state 发生变化，组件就会进入更新阶段。</p>

          <h4>shouldComponentUpdate(nextProps, nextState)</h4>
          <p>
            这个钩子是个性能优化利器。React 默认每次 state 或 props 变化都重新渲染，但有时候变化根本不影响 UI，重新渲染纯属浪费。你可以在这里返回{' '}
            <code>false</code> 来阻止不必要的渲染。
          </p>
          <CodeBlock
            language="jsx"
            code={`shouldComponentUpdate(nextProps, nextState) {
  // 只有 count 变了才重新渲染
  return nextState.count !== this.state.count;
}`}
          />

          <h4>render()</h4>
          <p>又来了，根据新的 state 和 props 重新生成 JSX。</p>

          <h4>componentDidUpdate(prevProps, prevState)</h4>
          <p>更新完成后调用。你可以在这里对比前后的 props/state，做一些相应操作。</p>
          <CodeBlock
            language="jsx"
            code={`componentDidUpdate(prevProps) {
  // 如果 userId 变了，重新请求数据
  if (prevProps.userId !== this.props.userId) {
    this.fetchUserData(this.props.userId);
  }
}`}
          />
          <p>注意：如果你在这里 setState，一定要加条件判断，否则会死循环，整个页面就卡死了。</p>

          <h3>第三阶段：卸载（Unmounting）</h3>

          <h4>componentWillUnmount()</h4>
          <p>组件从页面上消失之前调用。你应该在这里做清理工作：取消订阅、清除定时器、取消网络请求……否则组件都不存在了，那些东西还在跑，就是内存泄漏。</p>
          <CodeBlock
            language="jsx"
            code={`componentWillUnmount() {
  clearInterval(this.timer);
  this.subscription.unsubscribe();
}`}
          />

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />
        </>
      )}

      <h2>Hooks 时代：用函数组件搞定一切</h2>
      <p>React 16.8 引入了 Hooks，函数组件一下子能干类组件所有的事了。大家逐渐发现，代码还更简洁了。</p>
      <p>核心就是两个 Hook：<code>useState</code> 和 <code>useEffect</code>。</p>

      <h3>useEffect：生命周期的集大成者</h3>
      <p>
        <code>useEffect</code> 一个钩子，能模拟 <code>componentDidMount</code>、<code>componentDidUpdate</code>、<code>componentWillUnmount</code>{' '}
        三个生命周期，关键在于你怎么用它。
      </p>

      <h4>模拟 componentDidMount（只在挂载时执行一次）</h4>
      <CodeBlock
        language="jsx"
        code={`useEffect(() => {
  // 发请求、初始化……
  fetchData();
}, []); // 第二个参数是空数组，意思是 "没有依赖，只跑一次"`}
      />

      <h4>模拟 componentDidUpdate（依赖某个值变化时执行）</h4>
      <CodeBlock
        language="jsx"
        code={`useEffect(() => {
  fetchUserData(userId);
}, [userId]); // userId 变化时重新执行`}
      />
      <div className="demo-box">
        <p className="demo-label">依赖变化时 effect 重新执行</p>
        <p className="demo-output" style={{ marginBottom: '0.5rem' }}>
          当前请求的 userId：<strong style={{ color: 'var(--react-cyan)' }}>{selectedUserId}</strong>，effect 已执行次数：<strong style={{ color: 'var(--react-cyan)' }}>{effectRunCount}</strong>
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['1', '2', '3'].map((id) => (
            <button key={id} type="button" onClick={() => setSelectedUserId(id)} style={btnStyle}>
              userId {id}
            </button>
          ))}
        </div>
      </div>

      <h4>模拟 componentWillUnmount（清理函数）</h4>
      <CodeBlock
        language="jsx"
        code={`useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick');
  }, 1000);

  // 返回一个函数，组件卸载时执行
  return () => {
    clearInterval(timer);
  };
}, []);`}
      />
      <p>这个返回的清理函数是很多人容易忽略的，但它非常关键。</p>
      <div className="demo-box">
        <p className="demo-label">挂载/卸载子组件，观察定时器是否被清理</p>
        <div className="demo-output" style={{ marginBottom: '0.5rem' }}>
          {showChild ? <TimerChild /> : <span style={{ color: 'var(--text-muted)' }}>子组件已卸载，定时器已停止</span>}
        </div>
        <button type="button" onClick={() => setShowChild((s) => !s)} style={btnStyle}>
          {showChild ? '卸载子组件' : '挂载子组件'}
        </button>
      </div>

      <h3>执行顺序的心智模型</h3>
      <p>用 Hooks 的函数组件，你可以这样理解执行顺序：</p>
      <ol>
        <li>函数体执行（相当于 render）</li>
        <li>浏览器完成绘制</li>
        <li>
          <code>useEffect</code> 的回调执行（异步的，不阻塞渲染）
        </li>
        <li>下次渲染前，先执行上一次 effect 的清理函数</li>
        <li>再执行新的 effect 回调</li>
      </ol>
      <div className="demo-box">
        <p className="demo-label">执行顺序日志（render → cleanup → effect）</p>
        <p className="demo-output" style={{ marginBottom: '0.5rem' }}>
          最近顺序：{displayLog.length ? displayLog.join(' → ') : '（先点「强制重渲染」再点「刷新显示」）'}
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              logRef.current = []
              setTrigger((t) => t + 1)
            }}
            style={btnStyle}
          >
            强制重渲染
          </button>
          <button type="button" onClick={() => setDisplayLog([...logRef.current])} style={btnStyle}>
            刷新显示
          </button>
        </div>
        <ExecutionOrderLogger logRef={logRef} />
      </div>
      <p>
        如果你需要同步执行（比如操作 DOM 要避免闪烁），用 <code>useLayoutEffect</code>，它在浏览器绘制之前同步执行。
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>几个常见的坑，帮你提前避开</h2>

      <h3>坑一：useEffect 依赖数组漏写</h3>
      <CodeBlock
        language="jsx"
        code={`// 错误写法：fetchData 用到了 userId，但没有放进依赖数组
useEffect(() => {
  fetchData(userId);
}, []); // userId 变了也不会重新请求！`}
      />
      <p>这是个超级常见的 bug，你会发现数据一直是旧的，查半天不知道为啥。</p>

      <h3>坑二：在 useEffect 里直接用 async/await</h3>
      <CodeBlock
        language="jsx"
        code={`// 错误写法
useEffect(async () => {
  const data = await fetchData(); // effect 不能直接是 async 函数
}, []);

// 正确写法
useEffect(() => {
  const loadData = async () => {
    const data = await fetchData();
    setData(data);
  };
  loadData();
}, []);`}
      />

      <h3>坑三：忘记清理</h3>
      <p>
        定时器、事件监听、WebSocket 连接……只要是你开的，卸载时就要关掉。不然会在你最意想不到的时候爆出一堆奇怪的 bug。
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>总结</h2>
      <p>
        React 生命周期说白了就是：<strong>组件什么时候出现、什么时候更新、什么时候消失，在这些节点你能做什么</strong>。
      </p>
      <p>
        类组件用方法名来区分各个阶段，直观但繁琐；函数组件用 <code>useEffect</code> 的依赖数组来控制执行时机，灵活但需要一点时间建立心智模型。
      </p>
      <p>
        说实话，生命周期真正理解透，需要你在项目里踩几个坑。但只要你记住一句话：<strong>在 effect 里开的东西，一定要在清理函数里关掉</strong>，你就能避开
        90% 的麻烦。
      </p>
      <p>剩下的，交给实践就好了。</p>
    </>
  )
}

