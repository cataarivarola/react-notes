import { useState } from 'react'
import { Link } from 'react-router-dom'
import CodeBlock from '../components/CodeBlock'
import PopoverCard from '../components/PopoverCard'

const btnStyle = {
  padding: '0.5rem 1rem',
  background: 'var(--react-cyan-light)',
  color: 'var(--react-cyan)',
  border: '1px solid rgba(97, 218, 251, 0.4)',
  borderRadius: 6,
  cursor: 'pointer',
  fontWeight: 500,
}

export default function Props() {
  const [count, setCount] = useState(0)
  return (
    <>
      <h1>Props 是什么？</h1>
      <p style={{ marginBottom: '1rem' }}>
        Props 是 "properties"（属性）的缩写。简单来说，props 就是<strong>父组件传递给子组件的数据</strong>。你可以把它想象成<strong>函数的参数</strong>——调用函数时传入参数，组件也一样，只不过传的是 props。
      </p>
      <div
        style={{
          margin: '1.25rem 0',
          padding: '1rem 1.25rem',
          borderRadius: 12,
          borderLeft: '4px solid var(--react-cyan)',
          background: 'linear-gradient(135deg, rgba(97, 218, 251, 0.08) 0%, rgba(97, 218, 251, 0.02) 100%)',
        }}
      >
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          假设你去咖啡店点咖啡，你会告诉咖啡师「我要一杯大杯拿铁，少糖，加燕麦奶」。
        </p>
        <p style={{ margin: 0, fontSize: '0.98rem', lineHeight: 1.6, fontWeight: 500 }}>
          咖啡师就是<span style={{ color: 'var(--react-cyan)' }}>组件</span>，你点单时说的那些要求就是<span style={{ color: 'var(--react-cyan)' }}>props</span>。根据你的要求（props）做出你想要的咖啡。
        </p>
      </div>

      <h2>最简单的例子</h2>
      <p>让我们从最基础的开始。这是一个接收 props 的组件：</p>
      <CodeBlock
        language="jsx"
        code={'function Welcome(props) {\n  return <h1>你好，{props.name}！</h1>;\n}'}
      />
      <p>使用的时候：</p>
      <CodeBlock
        language="jsx"
        code={'<Welcome name="张三" />'}
      />
      <p>
        看到了吗？<code>name="张三"</code> 就是在传递 props。组件内部通过 <code>props.name</code> 来获取这个值。简单直接。
      </p>

      <h2>Props 可以传递任何东西</h2>
      <p>
        刚开始我以为 props 只能传字符串，后来才发现——天啊，你几乎可以传任何东西！
      </p>
      <p><strong>传数字：</strong></p>
      <CodeBlock
        language="jsx"
        code={'<ProductCard price={99} stock={50} />'}
      />
      <p>注意：传非字符串类型的值要用花括号。</p>
      <p><strong>传布尔值：</strong></p>
      <CodeBlock
        language="jsx"
        code={'<Button disabled={true} isPrimary={false} />'}
      />
      <p><strong>传数组：</strong></p>
      <CodeBlock
        language="jsx"
        code={"<TodoList items={['买菜', '写代码', '健身']} />"}
      />
      <p><strong>传对象：</strong></p>
      <CodeBlock
        language="jsx"
        code={'<UserProfile user={{ name: \'李四\', age: 25, city: \'北京\' }} />'}
      />
      <p><strong>甚至传函数：</strong></p>
      <CodeBlock
        language="jsx"
        code={'<Button onClick={() => alert("被点击了！")} />'}
      />
      <p>
        这个特别有用。通过传递函数，子组件可以「通知」父组件发生了什么事。比如用户点击了按钮，子组件就调用父组件传来的函数。
      </p>

      <h2>多个 Props 的使用</h2>
      <p>实际开发中，一个组件往往需要接收多个 props。看这个例子：</p>
      <CodeBlock
        language="jsx"
        code={'function UserCard(props) {\n  return (\n    <div className="user-card">\n      <img src={props.avatar} alt="头像" />\n      <h2>{props.name}</h2>\n      <p>{props.bio}</p>\n      <span>{props.followers} 粉丝</span>\n    </div>\n  );\n}'}
      />
      <p>使用时：</p>
      <CodeBlock
        language="jsx"
        code={'<UserCard\n  avatar="https://example.com/avatar.jpg"\n  name="王小明"\n  bio="前端开发者，热爱编程"\n  followers={1250}\n/>'}
      />
      <p>
        不过老实说，每次都写 <code>props.xxx</code> 有点烦。所以很多人（包括我）更喜欢用{' '}
        <PopoverCard
          trigger={
            <button type="button" className="inline-link-button">
              <strong>解构赋值</strong>
            </button>
          }
          title="什么是解构赋值？"
        >
          <p>
            解构赋值是 JavaScript 的语法，用来从对象或数组中「拆出」变量。在 React 里写函数参数时，<code>{'function UserCard(props)'}</code> 拿到的是整个 <code>props</code> 对象，而 <code>{'function UserCard({ avatar, name })'}</code> 会直接把 <code>props.avatar</code>、<code>props.name</code> 拆成两个变量，函数体里直接用 <code>avatar</code>、<code>name</code> 即可，不用再写 <code>props.xxx</code>。
          </p>
        </PopoverCard>
        ：
      </p>
      <CodeBlock
        language="jsx"
        code={'function UserCard({ avatar, name, bio, followers }) {\n  return (\n    <div className="user-card">\n      <img src={avatar} alt="头像" />\n      <h2>{name}</h2>\n      <p>{bio}</p>\n      <span>{followers} 粉丝</span>\n    </div>\n  );\n}'}
      />
      <p>看起来清爽多了对不对？功能完全一样，但代码更简洁。</p>

      <h2>默认值和必填 Props</h2>
      <p>有时候你希望某个 prop 有默认值，以防用户忘了传。可以这样：</p>
      <CodeBlock
        language="jsx"
        code={'function Greeting({ name = \'访客\' }) {\n  return <h1>欢迎你，{name}！</h1>;\n}'}
      />
      <p>如果没有传 <code>name</code>，它就会显示「欢迎你，访客！」。</p>
      <p>对于更严格的类型检查，可以用 PropTypes（虽然现在 TypeScript 更流行）：</p>
      <CodeBlock
        language="jsx"
        code={'import PropTypes from \'prop-types\';\n\nfunction UserCard({ name, age }) {\n  return <div>{name}, {age}岁</div>;\n}\n\nUserCard.propTypes = {\n  name: PropTypes.string.isRequired,  // 必填，必须是字符串\n  age: PropTypes.number               // 可选，必须是数字\n};'}
      />
      <p>这能帮你在开发时发现错误，避免传错数据类型。</p>

      <h2>Props 的单向数据流</h2>
      <p>
        这是一个超级重要的概念：<strong>props 是只读的！</strong>
      </p>
      <p>子组件不能修改从父组件接收到的 props。这是 React 的铁律。我刚学 React 时试图这样做：</p>
      <CodeBlock
        language="jsx"
        code={'// ❌ 千万别这样！\nfunction Counter({ count }) {\n  return (\n    <button onClick={() => count++}>  {/* 错误！ */}\n      点击次数：{count}\n    </button>\n  );\n}'}
      />
      <p>这样是不行的。Props 就像是父组件借给你的东西，你只能看，不能改。</p>
      <p>那怎么办呢？如果子组件需要「通知」父组件改变数据，应该通过传递函数来实现：</p>
      <CodeBlock
        language="jsx"
        code={'// 父组件\nfunction App() {\n  const [count, setCount] = useState(0);\n\n  return <Counter count={count} onIncrement={() => setCount(count + 1)} />;\n}\n\n// 子组件\nfunction Counter({ count, onIncrement }) {\n  return (\n    <button onClick={onIncrement}>\n      点击次数：{count}\n    </button>\n  );\n}'}
      />
      <p>
        看到了吗？数据的修改权在父组件手里，子组件只是「请求」父组件去修改。这就是单向数据流。
      </p>
      <div className="demo-box">
        <p className="demo-label">动手试：下面按钮是「子组件」，只接收 count 和 onIncrement，不能改 count，只能请求父组件加一</p>
        <div className="demo-output">
          <p style={{ marginBottom: '0.75rem' }}>
            点击次数：<strong style={{ color: 'var(--react-cyan)' }}>{count}</strong>
          </p>
          <button type="button" onClick={() => setCount((c) => c + 1)} style={btnStyle}>
            点我 +1（由父组件更新）
          </button>
        </div>
      </div>

      <h2>Children：特殊的 Prop</h2>
      <p>还有一个特殊的 prop 叫 <code>children</code>，它代表组件标签之间的内容：</p>
      <CodeBlock
        language="jsx"
        code={'function Card({ children }) {\n  return (\n    <div className="card">\n      {children}\n    </div>\n  );\n}'}
      />
      <p>使用时：</p>
      <CodeBlock
        language="jsx"
        code={'<Card>\n  <h2>标题</h2>\n  <p>这是卡片内容</p>\n</Card>'}
      />
      <p>
        <code>children</code> 会接收到那个 <code>h2</code> 和 <code>p</code> 标签。这个功能超级实用，让组件变得非常灵活。你可以在同一个 <code>Card</code> 组件里放任何内容。
      </p>
      <div className="demo-box">
        <p className="demo-label">下面就是一个 Card 组件，包裹的内容就是 children</p>
        <div
          className="demo-output"
          style={{
            padding: '1rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 8,
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.1rem' }}>标题</h3>
          <p style={{ margin: 0 }}>这是卡片内容，由父组件塞进来的 children。</p>
        </div>
      </div>

      <h2>Props vs State</h2>
      <p>很多新手（包括当年的我）会搞混 props 和 state。简单区分一下：</p>
      <ul>
        <li><strong>Props</strong>：从父组件传来的，只读的，组件自己不能修改</li>
        <li><strong>State</strong>：组件自己管理的数据，可以修改（详见 <Link to="/concepts/state">State 基础</Link>）</li>
      </ul>
      <p>Props 像是你收到的礼物，你不能改变它。State 像是你自己的钱包，你想怎么花就怎么花。</p>

      <h2>实用技巧分享</h2>
      <p><strong>1. 展开运算符传递 Props</strong></p>
      <p>当你有很多 props 要传递时：</p>
      <CodeBlock
        language="jsx"
        code={'const userData = {\n  name: \'张三\',\n  age: 28,\n  city: \'上海\'\n};\n\n// 不用一个个写\n<UserInfo {...userData} />\n\n// 等同于\n<UserInfo name="张三" age={28} city="上海" />'}
      />
      <p>超级方便！</p>
      <p><strong>2. 条件渲染 Props</strong></p>
      <CodeBlock
        language="jsx"
        code={'function Button({ isPrimary, children }) {\n  return (\n    <button className={isPrimary ? \'btn-primary\' : \'btn-default\'}>\n      {children}\n    </button>\n  );\n}'}
      />
      <p>根据 props 的值改变渲染内容，这是常见操作。</p>
      <p><strong>3. Props 验证助你调试</strong></p>
      <p>相信我，当你的项目变大时，PropTypes 或 TypeScript 会救你一命。它们能在你传错数据时立刻警告你，而不是等到运行时才报错。</p>

      <h2>常见错误和坑</h2>
      <p>我踩过的坑分享给你：</p>
      <p><strong>忘记用花括号：</strong></p>
      <CodeBlock
        language="jsx"
        code={'// ❌ 错误：这会传递字符串"123"\n<Counter count="123" />\n\n// ✅ 正确：这会传递数字123\n<Counter count={123} />'}
      />
      <p><strong>试图修改 Props：</strong>前面说过了，千万别这样做。React 会警告你，甚至报错。</p>
      <p><strong>Props 命名不规范：</strong>Props 名称应该用驼峰命名法，比如 <code>firstName</code> 而不是 <code>first_name</code>。这是 React 社区的约定俗成。</p>
    </>
  )
}
