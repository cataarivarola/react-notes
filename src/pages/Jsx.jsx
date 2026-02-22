import CodeBlock from '../components/CodeBlock'
import PopoverCard from '../components/PopoverCard'

export default function Jsx() {
  return (
    <>
      <h1>JSX 是什么？</h1>
      <p>
        简单来说，JSX 就是 JavaScript 的一种语法扩展。它长得像 HTML，但其实是 JavaScript。你可以在
        JavaScript 代码里直接写类似 HTML 的标签，像这样：
      </p>

      <CodeBlock
        language="jsx"
        code={`const element = <h1>Hello, world!</h1>;`}
      />

      <p>
        看到没？这就是 JSX。它让你可以用熟悉的 HTML 写法来描述 UI 应该长什么样，但底层其实还是
        JavaScript 在运行。
      </p>

      <h2>为什么要用 JSX？</h2>
      <p>
        你可能会想：好好的 JavaScript 不用，搞这么个东西干嘛？其实 React 团队也考虑过这个问题。他们发现，在构建
        UI 的时候，渲染逻辑本来就和 UI 逻辑紧密相关——比如处理点击事件、状态变化、数据展示等等。
      </p>
      <p>
        与其把标签写在一个地方，逻辑写在另一个地方，不如把它们放在一起。JSX 就是为了让这件事变得更自然、更直观。
        说白了，JSX 让代码更容易读懂，也更容易维护。
      </p>

      <h2>JSX 的基本用法</h2>

      <h3>在 JSX 中嵌入表达式</h3>
      <p>你可以在 JSX 里用大括号包裹任何 JavaScript 表达式：</p>
      <CodeBlock
        language="jsx"
        code={`const name = '小明';
const element = <h1>你好，\${'{name}'}！</h1>;`}
      />
      <p>大括号里可以放变量、函数调用、计算结果，基本上任何合法的 JavaScript 表达式都行：</p>
      <CodeBlock
        language="jsx"
        code={`const user = {
  firstName: '三',
  lastName: '张',
};

function formatName(user) {
  return user.lastName + user.firstName;
}

const element = <h1>欢迎回来，\${'formatName(user)'}！</h1>;`}
      />

      <h3>JSX 本身也是表达式</h3>
      <p>
        编译之后，JSX 会变成普通的 JavaScript 函数调用，所以你可以把它赋值给变量，当参数传递，或者从函数里返回：
      </p>
      <CodeBlock
        language="jsx"
        code={`function getGreeting(user) {
  if (user) {
    return <h1>欢迎回来，\${'{user.name}'}！</h1>;
  }
  return <h1>请先登录。</h1>;
}`}
      />

      <h3>在 JSX 中指定属性</h3>
      <p>你可以用引号指定字符串字面量作为属性：</p>
      <CodeBlock
        language="jsx"
        code={`const element = <img src="avatar.png" alt="用户头像" />;`}
      />
      <p>也可以用大括号嵌入 JavaScript 表达式：</p>
      <CodeBlock
        language="jsx"
        code={`const element = <img src={user.avatarUrl} alt={user.name} />;`}
      />
      <p>
        <strong>注意：</strong>JSX 使用驼峰命名法来定义属性名称。比如 HTML 里的 <code>class</code>{' '}
        要写成 <code>className</code>，<code>tabindex</code> 要写成 <code>tabIndex</code>
        。这是因为 JSX 最终会转换成 JavaScript，而 <code>class</code> 是 JavaScript 的保留字。
      </p>

      <h3>JSX 可以包含子元素</h3>
      <p>如果标签是空的，可以用 <code>/&gt;</code> 自闭合：</p>
      <CodeBlock
        language="jsx"
        code={`const element = <img src={user.avatarUrl} />;`}
      />
      <p>JSX 标签也可以包含子元素：</p>
      <CodeBlock
        language="jsx"
        code={`const element = (
  <div>
    <h1>欢迎！</h1>
    <p>这是一段介绍文字。</p>
  </div>
);`}
      />

      <h2>JSX 的本质</h2>
      <p>
        这里是关键点：<strong>JSX 其实是语法糖</strong>。当你写 JSX 的时候，{' '}
        <PopoverCard
          trigger={<button type="button" className="inline-link-button">Babel</button>}
          title="Babel 是什么？"
        >
          <p>
            Babel 是一个 JavaScript 编译器，它可以把你写的现代 JavaScript / JSX 代码转换成浏览器更容易理解、兼容性更好的代码。
          </p>
          <ul>
            <li>支持 JSX → <code>React.createElement</code> 的转换</li>
            <li>支持新语法（如 ES6+）转换成旧语法，兼容老浏览器</li>
            <li>常和打包工具（如 Vite、Webpack）一起使用</li>
          </ul>
        </PopoverCard>
        {' '}会把它转换成 <code>React.createElement()</code> 函数调用。这两种写法是完全等价的：
      </p>
      <CodeBlock
        language="jsx"
        code={`// JSX 写法
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);

// 等价的 JavaScript 写法
const element = React.createElement(
  'h1',
  { className: 'greeting' },
  'Hello, world!',
);`}
      />
      <p>
        <code>React.createElement()</code> 会创建一个对象，大概长这样：
      </p>
      <CodeBlock
        language="javascript"
        code={`const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!',
  },
};`}
      />
      <p>这些对象被称为 “React 元素”，React 会读取这些对象来构建和更新 DOM。</p>

      <h2>JSX 的一些注意事项</h2>

      <h3>必须有一个根元素</h3>
      <p>JSX 表达式必须有一个根元素。下面这样是错误的：</p>
      <CodeBlock
        language="jsx"
        code={`// ❌ 错误
return (
  <h1>标题</h1>
  <p>段落</p>
);`}
      />
      <p>你需要用一个父元素包裹它们：</p>
      <CodeBlock
        language="jsx"
        code={`// ✅ 正确
return (
  <div>
    <h1>标题</h1>
    <p>段落</p>
  </div>
);`}
      />
      <p>如果不想增加额外的 DOM 节点，可以用 React Fragment（<code>{'<></>'}</code>）：</p>
      <CodeBlock
        language="jsx"
        code={`return (
  <>
    <h1>标题</h1>
    <p>段落</p>
  </>
);`}
      />

      <h3>JSX 会防止注入攻击</h3>
      <div className="text-with-image">
        <img
          src="/jsx-security-shield.png"
          alt="React 安全防护：防止 XSS 注入攻击的示意图"
          className="text-with-image__img"
        />
        <p className="text-with-image__text">
          React DOM 在渲染之前会转义所有嵌入 JSX 中的值，这意味着你永远不会注入任何不是明确写在应用中的内容。所有内容都会被转换成字符串，这有助于防止
          XSS 攻击。
        </p>
      </div>

      <h3>组件名必须大写</h3>
      <p>
        当你写 <code>{'<div>'}</code> 时，React 知道这是个 HTML 标签。但如果你写{' '}
        <code>{'<MyComponent>'}</code>，React 就知道这是你自己定义的组件。这就是为什么 React 组件名必须大写开头：
      </p>
      <CodeBlock
        language="jsx"
        code={`// HTML 标签
const element = <div />;

// 自定义组件
const element = <MyComponent />;`}
      />

      <h2>总结</h2>
      <p>
        JSX 其实没那么复杂，它就是：
      </p>
      <ul>
        <li>一种在 JavaScript 里写类似 HTML 语法的方式</li>
        <li>让 React 代码更易读易写</li>
        <li>最终会被转换成普通的 JavaScript 函数调用</li>
        <li>能防止注入攻击，相对安全</li>
      </ul>
      <p>
        一开始看着可能有点怪，但用一段时间你就会发现它真的很方便。写 React 的时候，JSX 让你可以直观地描述 UI 应该长什么样，而不用到处写
         <code>createElement</code> 这种函数调用。
      </p>

    </>
  )
}
