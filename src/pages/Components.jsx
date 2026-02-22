import { useState } from 'react'
import { Link } from 'react-router-dom'
import CodeBlock from '../components/CodeBlock'

export default function Components() {
  const [activePart, setActivePart] = useState('Header')
  const [count, setCount] = useState(0)
  return (
    <>
      <h1>什么是组件？</h1>
      <p>
        <strong style={{ color: '#E9ECEF' }}>组件就是 React 应用中的一个个独立模块。</strong>
        你可以把它想象成网页上的任何一个部分：一个按钮、一个导航栏、一个评论框，甚至是整个页面。
        <strong style={{ color: '#E9ECEF' }}>
          每个组件都负责渲染一小块用户界面，并且可以包含自己的逻辑和样式。
        </strong>
      </p>
      <div className="content-and-figure">
        <div className="content-and-figure__content">
          <p>
            一个常见的比喻是：你在组装一辆汽车。你不会把整辆车当作一个巨大的整体来制造，而是先造轮胎、发动机、座椅、方向盘等等，然后再把它们组装在一起。React
            组件也是这个道理——把复杂的界面拆分成更小、更易管理的部分。
          </p>
        </div>
        <img
          src="/car-components-diagram.png"
          alt="汽车由发动机、方向盘、轮胎等组件组成，类比 React 组件"
          className="content-and-figure__img"
        />
      </div>

      <h2>为什么要用组件？</h2>
      <p>
        当我第一次接触 React 时，我在想：“为什么要把事情搞得这么复杂？”但用了一段时间后，你就会意识到<strong>组件化开发真的能帮你省很多事</strong>。
      </p>
      <div className="content-and-figure content-and-figure--reverse">
        <img
          src="/components-reuse-diagram.png"
          alt="多个页面中复用同一个模块化组件的示意图"
          className="content-and-figure__img"
          style={{ float: 'left', marginRight: '1.5rem', maxWidth: 220 }}
        />
        <p>
          首先是<strong>可复用性</strong>。假设你做了一个超酷的按钮，样式完美，交互流畅。如果不用组件，你每次需要这个按钮时都得复制粘贴一堆代码。但有了组件，你只需要写一次，然后在任何地方调用就行了。需要 10
          个这样的按钮？没问题，复制 10 次组件标签就搞定。
        </p>
      </div>
      <p>
        其次是<strong>维护性</strong>。想象一下你的网站有 100 个页面，每个页面都有导航栏。有一天老板说：“我们要在导航栏上加个新功能。”如果没有组件化，你得改 100 个页面。但如果用了组件，你只需要改一个导航栏组件，所有页面自动更新。这种感觉简直太爽了。
      </p>

      <h2>组件长什么样？</h2>
      <p>先看一个最简单的函数组件：</p>
      <CodeBlock
        language="jsx"
        code={`function Welcome() {
  return <h1>你好，欢迎来到我的网站！</h1>;
}`}
      />
      <p>
        就这么简单！这个组件叫做 <code>Welcome</code>，它的工作就是返回一个标题。你可以在任何地方像标签一样使用它：<code>{'<Welcome />'}</code>。
      </p>

      <p>组件也可以接收数据，我们称之为 <Link to="/concepts/props">props（属性）</Link>：</p>
      <CodeBlock
        language="jsx"
        code={`function Greeting(props) {
  return <h1>嘿，\${'{props.name}'}！很高兴见到你。</h1>;
}

// 使用方式
<Greeting name="小明" />`}
      />
      <p>
        当你写 <code>{'<Greeting name="小明" />'}</code> 时，这个组件就会渲染出「嘿，小明！很高兴见到你。」换个名字，内容就跟着变了。
      </p>

      <h2>组件还能做更多事</h2>
      <p>组件不只是显示静态内容。它们可以有自己的状态（state），可以响应用户操作，可以从服务器获取数据，也可以包含复杂的业务逻辑。</p>
      <p>比如一个简单的计数器组件：</p>
      <CodeBlock
        language="jsx"
        code={`function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>你点击了 \${'{count}'} 次</p>
      <button onClick={() => setCount(count + 1)}>
        点我！
      </button>
    </div>
  );
}`}
      />
      <div className="demo-box">
        <p className="demo-label">试试看：点击按钮，数字会随状态更新</p>
        <div className="demo-output">
          <p style={{ marginBottom: '0.75rem' }}>
            你点击了 <strong style={{ color: 'var(--react-cyan)' }}>{count}</strong> 次
          </p>
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
            点我！
          </button>
        </div>
      </div>
      <p>每次用户点击按钮，计数就会增加。这个组件管理着自己的状态，不需要外部干预。</p>

      <h2>组件的组合</h2>
      <p>React 最强大的地方在于组件可以嵌套使用。你可以在一个大组件里包含很多小组件，就像俄罗斯套娃一样。</p>
      <p>比如一个典型的博客页面可能是这样构成的：</p>
      <CodeBlock
        language="jsx"
        code={`function BlogPage() {
  return (
    <div>
      <Header />
      <Sidebar />
      <MainContent>
        <ArticleList />
        <Pagination />
      </MainContent>
      <Footer />
    </div>
  );
}`}
      />
      <p>每个部分都是独立的组件，各司其职。需要修改侧边栏？只改 <code>Sidebar</code> 组件就行。想在其他页面也用这个页脚？直接引入 <code>Footer</code> 组件。</p>

      <div className="demo-box component-demo">
        <p className="demo-label">动手感受一下：点击左侧不同组件，看看页面是如何由组件拼起来的。</p>
        <div className="component-demo__body">
          <div className="component-demo__list">
            {['Header', 'Sidebar', 'Main', 'Footer'].map((part) => (
              <button
                key={part}
                type="button"
                className={`component-demo__btn${
                  activePart === part ? ' component-demo__btn--active' : ''
                }`}
                onClick={() => setActivePart(part)}
              >
                {part}
              </button>
            ))}
          </div>
          <div className="component-demo__layout">
            <div
              className={`component-demo__header${
                activePart === 'Header' ? ' component-demo__section--active' : ''
              }`}
            >
              Header
            </div>
            <div className="component-demo__middle">
              <div
                className={`component-demo__sidebar${
                  activePart === 'Sidebar' ? ' component-demo__section--active' : ''
                }`}
              >
                Sidebar
              </div>
              <div
                className={`component-demo__main${
                  activePart === 'Main' ? ' component-demo__section--active' : ''
                }`}
              >
                MainContent
              </div>
            </div>
            <div
              className={`component-demo__footer${
                activePart === 'Footer' ? ' component-demo__section--active' : ''
              }`}
            >
              Footer
            </div>
          </div>
        </div>
      </div>

      <h2>一些实用建议</h2>
      <ul>
        <li>
          <strong>不要把组件写得太大。</strong> 如果一个组件超过 200 行代码，很可能该拆分了。当你发现自己在一个组件里做太多事情时，就该想想能不能拆成几个小组件。
        </li>
        <li>
          <strong>命名要清晰。</strong> 看到组件名就应该知道它是干什么的。<code>UserProfileCard</code> 比 <code>Card</code>{' '}
          好，<code>SubmitButton</code> 比 <code>Button1</code> 好。
        </li>
        <li>
          <strong>保持组件专注。</strong> 一个组件最好只负责一件事。如果你的「用户资料」组件同时还在处理支付逻辑，那肯定哪里不对劲。
        </li>
      </ul>
    </>
  )
}

