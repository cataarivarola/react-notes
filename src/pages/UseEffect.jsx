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

function TimerChild() {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])
  return <span style={{ color: 'var(--react-cyan)', fontWeight: 600 }}>已运行：{seconds} 秒</span>
}

export default function UseEffect() {
  const [selectedUserId, setSelectedUserId] = useState('1')
  const [effectRunCount, setEffectRunCount] = useState(0)
  const [showTimerChild, setShowTimerChild] = useState(true)

  useEffect(() => { setEffectRunCount((c) => c + 1) }, [selectedUserId])

  return (
    <>
      <h1>useEffect：让组件学会"做事情"</h1>
      <p>
      <code>useEffect</code> 用来在函数组件里执行副作用：数据请求、订阅、手动改 DOM 等。它会在每次渲染结束后执行（默认），也可以按依赖或仅在挂载/卸载时执行。
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>先从"为什么需要它"说起</h2>
      <p style={{ marginBottom: '1rem' }}>
        React 组件的核心工作就一件事：<strong>根据数据渲染 UI</strong>。你给它什么数据，它吐给你什么界面，这个过程应该是<span style={{ color: 'var(--react-cyan)', fontWeight: 600 }}>「纯粹」</span>的，没有副作用。
      </p>
      <p style={{ marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>但现实开发里，总有一些不那么「纯粹」的操作：</p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '0.6rem',
          margin: '1rem 0',
        }}
      >
        {[
          { label: '拉接口', desc: '组件加载完去请求用户数据' },
          { label: '改 document.title', desc: '某个值变了同步到页面标题' },
          { label: '定时器 / 订阅', desc: '设置后还要在销毁时清理' },
          { label: '第三方库', desc: '初始化地图、图表等' },
          { label: '事件监听', desc: 'resize、keydown 等，卸载时记得移除' },
          { label: '埋点 / 日志', desc: '行为上报、曝光统计（渲染之外）' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              padding: '0.65rem 0.9rem',
              borderRadius: 10,
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--react-cyan)', marginBottom: '0.25rem' }}>{item.label}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{item.desc}</div>
          </div>
        ))}
      </div>
      <p style={{ marginBottom: '1rem' }}>
        这些操作的共同点是<strong>会影响到 React 渲染流程<span style={{ color: 'var(--react-cyan)' }}>之外</span>的东西</strong>。这类操作就叫「副作用」（Side Effects），而 <code>useEffect</code> 就是 React 专门用来处理它们的地方。
      </p>
      <div
        style={{
          margin: '1.25rem 0',
          padding: '1rem 1.25rem',
          borderRadius: 12,
          borderLeft: '4px solid var(--react-cyan)',
          background: 'linear-gradient(135deg, rgba(97, 218, 251, 0.08) 0%, rgba(97, 218, 251, 0.02) 100%)',
          color: 'var(--text-primary)',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.98rem', lineHeight: 1.6, fontWeight: 500 }}>
          「这件事不是渲染本身，但我想在<strong style={{ color: 'var(--react-cyan)' }}>渲染完之后</strong>去做它。」
        </p>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>最基础的用法</h2>
      <CodeBlock
        language="jsx"
        code={`import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    console.log('组件渲染完了，我被执行了');
  });

  return <div>Hello</div>;
}`}
      />
      <p>这是最简单的形式，没有任何依赖数组。结果就是：<strong>每次组件重新渲染，这个函数都会跑一遍</strong>。</p>
      <p>大多数时候这不是你想要的，因为组件可能因为各种原因重新渲染，你的副作用就会被反复触发。所以这个写法在实际项目里用得很少。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>依赖数组：控制"什么时候执行"的开关</h2>
      <p>
        <code>useEffect</code> 接受第二个参数，一个数组，叫做<strong>依赖数组</strong>。它告诉 React："只有当这些值发生变化的时候，才重新执行我。"
      </p>
      <p>这里有三种情况，搞清楚这三种，你就掌握了 <code>useEffect</code> 的核心：</p>

      <p><strong>第一种：传空数组 <code>[]</code></strong></p>
      <CodeBlock
        language="jsx"
        code={`useEffect(() => {
  console.log('我只在组件第一次挂载时执行一次');
}, []);`}
      />
      <p>空数组意味着没有任何依赖，所以 React 认为这个 effect 永远不需要因为"值变了"而重跑，它就只在组件第一次渲染后执行一次。这是最常见的用法之一，比如组件挂载后请求初始数据。</p>

      <p><strong>第二种：传具体的依赖值</strong></p>
      <CodeBlock
        language="jsx"
        code={`const [userId, setUserId] = useState(1);

useEffect(() => {
  fetch(\`/api/user/\${'{userId}'}\`)
    .then(res => res.json())
    .then(data => console.log(data));
}, [userId]);`}
      />
      <p>这样写的意思是：<strong>第一次渲染执行一次，之后只要 <code>userId</code> 变了，就再执行一次</strong>。非常合理，用户切换了，我就重新去拉对应的数据。</p>
      <div className="demo-box">
        <p className="demo-label">依赖 [userId]：切换 userId 时 effect 会再执行，下方次数增加</p>
        <div className="demo-output">
          <p style={{ marginTop: 0, marginBottom: '0.5rem' }}>当前 userId：<strong style={{ color: 'var(--react-cyan)' }}>{selectedUserId}</strong>，effect 已执行次数：<strong style={{ color: 'var(--react-cyan)' }}>{effectRunCount}</strong></p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['1', '2', '3'].map((id) => (
              <button key={id} type="button" onClick={() => setSelectedUserId(id)} style={btnStyle}>userId {id}</button>
            ))}
          </div>
        </div>
      </div>

      <p><strong>第三种：不传数组（就是最开始那个写法）</strong></p>
      <p>每次渲染都执行，几乎不会这么用，除非你真的有这个需求。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>清理函数：别留烂摊子</h2>
      <p>这是很多人忽略的地方，但其实非常重要。</p>
      <p>
        想象这个场景：你在 <code>useEffect</code> 里设置了一个定时器，用户导航到别的页面，组件被销毁了——但你的定时器还在跑，还在尝试更新一个已经不存在的组件的状态。轻则控制台报警告，重则内存泄漏。
      </p>
      <p>
        <code>useEffect</code> 允许你返回一个函数，这个函数会在<strong>组件卸载，或者 effect 下次重新执行之前</strong>被调用，专门用来做清理工作。
      </p>
      <CodeBlock
        language="jsx"
        code={`useEffect(() => {
  const timer = setInterval(() => {
    console.log('滴答滴答');
  }, 1000);

  // 返回清理函数
  return () => {
    clearInterval(timer); // 组件卸载时，把定时器清掉
    console.log('定时器已清理，干净溜溜');
  };
}, []);`}
      />
      <p>再比如事件监听：</p>
      <CodeBlock
        language="jsx"
        code={`useEffect(() => {
  const handleResize = () => {
    console.log('窗口大小变了');
  };

  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize); // 清理掉，不然每次都会多绑一个
  };
}, []);`}
      />
      <div className="demo-box">
        <p className="demo-label">挂载/卸载子组件：卸载后定时器会停止（清理函数执行了）</p>
        <div className="demo-output" style={{ marginBottom: '0.5rem' }}>
          {showTimerChild ? <TimerChild /> : <span style={{ color: 'var(--text-muted)' }}>子组件已卸载，定时器已停止</span>}
        </div>
        <button type="button" onClick={() => setShowTimerChild((s) => !s)} style={btnStyle}>
          {showTimerChild ? '卸载子组件' : '挂载子组件'}
        </button>
      </div>
      <p>养成习惯：<strong>只要你在 <code>useEffect</code> 里注册了什么，就要在清理函数里注销它。</strong></p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>一个完整的实战例子</h2>
      <p>把上面的东西综合一下，来看一个真实场景——根据搜索关键词实时拉取数据：</p>
      <CodeBlock
        language="jsx"
        code={`import { useState, useEffect } from 'react';

function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return; // 没有关键词就不请求

    setLoading(true);

    // 用 AbortController 来处理竞态问题（这个很重要）
    const controller = new AbortController();

    fetch(\`/api/search?q=\${'{query}'}\`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('请求失败', err);
          setLoading(false);
        }
      });

    // 清理函数：如果 query 在请求还没完成时就变了，把上一个请求取消掉
    return () => {
      controller.abort();
    };
  }, [query]); // query 变了就重新请求

  if (loading) return <p>加载中...</p>;
  return <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>;
}`}
      />
      <p>
        注意里面用了 <code>AbortController</code>——这是处理"竞态条件"的正确姿势。如果用户输入很快，前一个请求还没回来，新的请求就发出去了，这时候应该把旧请求取消掉，不然可能出现后发先至、旧数据覆盖新数据的问题。
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>几个常见的坑，少走弯路</h2>

      <p><strong>坑一：依赖数组漏写了依赖</strong></p>
      <CodeBlock
        language="jsx"
        code={`// ❌ 错误写法
useEffect(() => {
  document.title = \`你好，\${'{name}'}\`; // 用到了 name，但没有放进依赖数组
}, []);`}
      />
      <p>这样写，<code>name</code> 变了页面标题不会更新，因为 React 以为这个 effect 不依赖任何东西。正确做法是把 <code>name</code> 加进去：<code>{'}'}, [name]</code>。</p>

      <p><strong>坑二：把对象/数组放进依赖，导致无限循环</strong></p>
      <CodeBlock
        language="jsx"
        code={`// ❌ 危险写法
useEffect(() => {
  doSomething(options);
}, [options]); // 如果 options 是在组件函数体里直接定义的对象，每次渲染都是新对象

// 每次渲染 → options 是新引用 → effect 重跑 → 触发重渲染 → 无限循环`}
      />
      <p>解决办法是用 <code>useMemo</code> 来稳定这个对象的引用，或者把对象定义移到组件外面，或者直接依赖对象里的具体属性而不是整个对象。</p>

      <p><strong>坑三：在 effect 里直接 async/await</strong></p>
      <CodeBlock
        language="jsx"
        code={`// ❌ 不能这样写
useEffect(async () => {
  const data = await fetchData(); // useEffect 的回调不能是 async 函数
}, []);

// ✅ 正确做法：在里面定义一个 async 函数再调用
useEffect(() => {
  const loadData = async () => {
    const data = await fetchData();
    setData(data);
  };
  loadData();
}, []);`}
      />
      <p>原因是 <code>useEffect</code> 的回调如果返回东西，只能返回清理函数，而 async 函数默认返回 Promise，这会让 React 很困惑。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>最后说一句</h2>
      <p>
        <code>useEffect</code> 本质上是 React 给你开的一扇"后门"，让你能在受控的时机里去做那些"不纯粹"的事情。用好它的关键就三点：
      </p>
      <div
        style={{
          borderLeft: '4px solid var(--react-cyan)',
          background: 'rgba(97, 218, 251, 0.06)',
          borderRadius: 8,
          padding: '1rem 1.25rem',
          margin: '1rem 0',
        }}
      >
        <ol style={{ margin: 0, paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <li style={{ lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--react-cyan)' }}>想清楚什么时候该执行</strong>——认真填写依赖数组，不要图省事全不填或者乱填
          </li>
          <li style={{ lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--react-cyan)' }}>用了就要清理</strong>——订阅、监听、定时器，记得在清理函数里处理掉
          </li>
          <li style={{ lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--react-cyan)' }}>不要把它当万能胶</strong>——如果某个逻辑可以在事件处理函数里直接写，就不要绕到 <code>useEffect</code> 里
          </li>
        </ol>
      </div>
      <p>
        React 官方文档其实也说了，如果你发现自己写了很多 <code>useEffect</code>，有时候值得停下来想想，这些逻辑是不是真的需要放在这里。但这是进阶话题了，等把基础用熟，自然就会有感觉。
      </p>
    </>
  )
}
