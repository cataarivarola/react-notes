import { useState } from 'react'
import CodeBlock from '../components/CodeBlock'
import PopoverCard from '../components/PopoverCard'

export default function Home() {
  const [count, setCount] = useState(0)
  return (
    <>
      <p className="intro" style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        本站按
        <PopoverCard
          trigger={<button type="button" className="inline-link-button">二八法则</button>}
          title="二八法则"
        >
          <p style={{ margin: 0 }}>
            即帕累托法则（Pareto principle）：约 20% 的投入往往带来约 80% 的结果。用在学 React 上，就是优先掌握少数核心概念（组件、数据流、Hooks），就能应对大部分日常开发；不必一开始就啃完所有 API 和最佳实践。
          </p>
        </PopoverCard>
        来设计：用大约 20% 的核心知识（组件、JSX、state、props、生命周期与 Hooks）覆盖日常开发里 80% 的场景。不追求大而全，只把最常用、最易踩坑的部分讲清楚，让你快速上手、少走弯路。
      </p>
      <h1>React是干嘛的？</h1>
      <p>
        简单来说，React是Facebook（现在叫Meta）开发的一个JavaScript库，专门用来构建用户界面——也就是你在网页上看到的那些按钮、表单、列表、动画等等。
      </p>
      <p className="infographic-wrap">
        <img src="/react-origin-infographic.png" alt="Origin: Meta → Language: JavaScript → Solution: React" className="infographic-img" />
      </p>
      <div className="text-with-image">
        <img src="/html-js-css-tangled.png" alt="HTML + JS + CSS 传统开发的复杂与纠缠" className="text-with-image__img" />
        <p className="text-with-image__text">
          你可能会问：写网页不是有HTML、CSS、JavaScript就够了吗？没错，但问题是当你的网站变得复杂时，用传统方式维护代码会让人崩溃。想象一下你要管理一个有几十个页面、成百上千个交互的网站，每次改点东西都要小心翼翼，生怕牵一发动全身——这就是React要解决的痛点。
        </p>
      </div>

      <h2>组件化思维：像搭积木一样写代码</h2>
      <div className="content-and-figure">
        <div className="content-and-figure__content">
          <p>
            React最核心的理念就是<strong>组件化</strong>。你可以把网页想象成乐高积木，先做好小积木块（组件），然后随意组装。
          </p>
          <ul>
            <li>一个按钮是一个组件</li>
            <li>一个导航栏是一个组件</li>
            <li>一个用户信息卡片是一个组件</li>
          </ul>
          <p>
            这些组件可以重复使用，改一处即可处处更新。
          </p>
        </div>
        <img src="/card-component-diagram.png" alt="Card 组件结构：Image Frame、Title/Text、Button 分层示意" className="content-and-figure__img" />
      </div>

      <h2>JSX：HTML和JavaScript的混血儿</h2>
      <p>
        React用JSX语法，让你在JavaScript里直接写类似HTML的标记：
      </p>
      <CodeBlock
        language="jsx"
        code={`function Welcome() {
  return <h1>你好，欢迎来到我的网站！</h1>;
}`}
      />

      <h2>数据驱动：界面会"自己"更新</h2>
      <p className="infographic-wrap">
        <img src="/ui-equals-f-data.png" alt="UI = f(data)：数据(State) 经 React 渲染为界面" className="infographic-img" />
      </p>
      <p>
        你只需要改变数据，React会自动更新页面。例如计数器：
      </p>
      
      <CodeBlock
        language="jsx"
        code={`function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>你点了 \${'{count}'} 次</p>
      <button onClick={() => setCount(count + 1)}>点我</button>
    </div>
  );
}`}
      />
      <div className="demo-box">
        <p className="demo-label">试试看：点击按钮，数字会随数据自动更新</p>
        <div className="demo-output">
          <p style={{ marginBottom: '0.75rem' }}>你点了 <strong style={{ color: 'var(--react-cyan)' }}>{count}</strong> 次</p>
          <button
            type="button"
            onClick={() => setCount((c) => c + 1)}
            style={{
              padding: '0.5rem 1rem',
              background: 'var(--react-cyan-light)',
              color: 'var(--react-cyan)',
              border: '1px solid rgba(97, 218, 251, 0.4)',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            点我
          </button>
        </div>
      </div>

      <h2>虚拟DOM：性能优化的秘密武器</h2>
      <p>
        React在内存里维护虚拟DOM，数据变化时先对比再只更新真实DOM中变化的部分，省时省力。通过Diff 算法的核心思想：<strong>精准更新</strong>，就像房屋装修时不推倒重建，而是只更换需要翻新的地方一样，它通过找出真正变化的部分，最小化真实 DOM 操作，从而提高页面渲染效率。
      </p>
      <p className="infographic-wrap">
        <img src="/virtual-dom-diff-patch.png" alt="虚拟DOM：内存修改 → Diff 对比 → 真实DOM 局部更新" className="infographic-img" />
      </p>
      <h2>生态系统：不是孤军奋战</h2>
      <p>
        React有强大的生态，点击卡片前往官网：
      </p>
      <div className="eco-infographic">
        <a href="https://reactrouter.com/" target="_blank" rel="noopener noreferrer" className="eco-card">
          <span className="eco-icon eco-icon-img" aria-hidden>
            <img src="/reactrouter-logo.svg" alt="" width="48" height="48" />
          </span>
          <span className="eco-name">React Router</span>
          <span className="eco-desc">路由与多页面</span>
          <span className="eco-arrow">→</span>
        </a>
        <a href="https://redux.js.org/" target="_blank" rel="noopener noreferrer" className="eco-card">
          <span className="eco-icon eco-icon-img" aria-hidden>
            <img src="/redux.svg" alt="" width="48" height="48" />
          </span>
          <span className="eco-name">Redux</span>
          <span className="eco-desc">全局状态管理</span>
          <span className="eco-arrow">→</span>
        </a>
        <a href="https://github.com/pmndrs/zustand" target="_blank" rel="noopener noreferrer" className="eco-card">
          <span className="eco-icon eco-icon-img" aria-hidden>
            <img src="/zustand.svg" alt="" width="48" height="48" />
          </span>
          <span className="eco-name">Zustand</span>
          <span className="eco-desc">轻量状态库</span>
          <span className="eco-arrow">→</span>
        </a>
        <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="eco-card">
          <span className="eco-icon eco-icon-img" aria-hidden>
            <img src="/nextjs.svg" alt="" width="48" height="48" />
          </span>
          <span className="eco-name">Next.js</span>
          <span className="eco-desc">SSR / 全栈框架</span>
          <span className="eco-arrow">→</span>
        </a>
        <a href="https://reactnative.dev/" target="_blank" rel="noopener noreferrer" className="eco-card">
          <span className="eco-icon eco-icon-img" aria-hidden>
            <img src="/reactnative.svg" alt="" width="48" height="48" />
          </span>
          <span className="eco-name">React Native</span>
          <span className="eco-desc">用 React 写 App</span>
          <span className="eco-arrow">→</span>
        </a>
        <a href="https://remix.run/" target="_blank" rel="noopener noreferrer" className="eco-card">
          <span className="eco-icon eco-icon-img" aria-hidden>
            <img src="/remix-logo.svg" alt="" width="48" height="48" />
          </span>
          <span className="eco-name">Remix</span>
          <span className="eco-desc">全栈 / Web 标准框架</span>
          <span className="eco-arrow">→</span>
        </a>
      </div>
      <p>
        这些工具让React能应对各种场景，从简单的小网站到复杂的企业应用。
      </p>

      <h2>为什么这么多人爱React？</h2>
      <ol>
        <li><strong>代码好维护</strong>：组件化让大项目不会变成一团乱麻</li>
        <li><strong>效率高</strong>：虚拟DOM保证性能</li>
        <li><strong>社区活跃</strong>：遇到问题基本都能找到解决方案</li>
        <li><strong>就业机会多</strong>：会React的开发者很抢手</li>
      </ol>

      <h2>写在最后</h2>
      <p>
        React改变了我们构建Web应用的方式。如果你正在考虑学习前端开发，React绝对是一个值得投资的技能。
      </p>
    </>
  )
}
