import { useRef, useState } from 'react'
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

function ListItemWithInput({ name, id }) {
  const [value, setValue] = useState('')
  return (
    <li style={{ marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span style={{ minWidth: 48 }}>{name}</span>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(id:{id})</span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="输入试试"
        style={{ padding: '0.25rem 0.4rem', width: 100, borderRadius: 4, border: '1px solid var(--border-color)' }}
      />
    </li>
  )
}

export default function Lists() {
  const [keyDemoItems, setKeyDemoItems] = useState([
    { id: 1, name: '张三' },
    { id: 2, name: '李四' },
    { id: 3, name: '王五' },
  ])
  const [todos, setTodos] = useState([
    { id: 1, text: '买菜' },
    { id: 2, text: '写代码' },
  ])
  const [todoInput, setTodoInput] = useState('')
  const nextIdRef = useRef(2)

  const reverseKeyDemo = () => {
    setKeyDemoItems([...keyDemoItems].reverse())
  }

  const addTodo = () => {
    if (!todoInput.trim()) return
    const id = (nextIdRef.current += 1)
    setTodos([...todos, { id, text: todoInput.trim() }])
    setTodoInput('')
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id))
  }

  return (
    <>
      <h1>React 中的列表与 Key：为什么你的列表需要一个"身份证"</h1>
      <p>
        刚开始学 React 的时候，很多人对 <code>key</code> 这个东西完全是懵的。照着文档写，控制台报警告，加上 <code>key=&#123;index&#125;</code> 警告消失了，然后就继续往下学了。相信很多人都经历过这个阶段。
      </p>
      <p>
        但随着项目越来越复杂，你会发现 <code>key</code> 背后藏着 React 一个非常核心的工作机制。
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>先从渲染列表说起</h2>
      <p>在 React 里，渲染一个数组是家常便饭。假设你有一组用户数据：</p>
      <CodeBlock
        language="jsx"
        code={`const users = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' },
];`}
      />
      <p>你想把它渲染成一个列表，最自然的写法就是用 <code>.map()</code>：</p>
      <CodeBlock
        language="jsx"
        code={`function UserList() {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}`}
      />
      <p>看起来很简单，但问题来了——为什么一定要加 <code>key</code>？不加会怎样？</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>React 的"更新焦虑"</h2>
      <p>要理解 <code>key</code>，得先理解 React 是怎么更新 DOM 的。</p>
      <p>
        React 有一套叫做 <strong>Reconciliation（协调）</strong> 的机制。每次状态变化，React 会生成一棵新的虚拟 DOM 树，然后和旧的虚拟 DOM 树对比，找出"哪里变了"，只更新那部分真实 DOM。
      </p>
      <p>这个对比过程，对于普通元素还好说。但遇到<strong>列表</strong>，情况就复杂了。</p>
      <p>想象一下，你有三个 <code>&lt;li&gt;</code> 元素，现在你在<strong>列表头部</strong>插入了一个新元素：</p>
      <CodeBlock
        language="text"
        code={`旧列表：A → B → C
新列表：D → A → B → C`}
      />
      <p className="infographic-wrap">
        <img src="/lists-reconciliation-no-key.png" alt="无 key 时按位置对比：头部插入 D 导致四个位置都被当作变化" className="infographic-img" />
      </p>
      <p>React 从头开始逐个对比：</p>
      <ul>
        <li>第 1 个位置：旧是 A，新是 D，<strong>不一样，更新</strong></li>
        <li>第 2 个位置：旧是 B，新是 A，<strong>不一样，更新</strong></li>
        <li>第 3 个位置：旧是 C，新是 B，<strong>不一样，更新</strong></li>
        <li>第 4 个位置：没有旧的，<strong>新增 C</strong></li>
      </ul>
      <p>结果就是——明明只是插入了一个 D，React 却把四个元素全部重新渲染了一遍。这非常低效，而且还会引发各种 bug，比如输入框里的内容被意外重置。</p>
      <p><strong><code>key</code> 就是为了解决这个问题而生的。</strong></p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>Key 到底做了什么</h2>
      <p>当你给每个列表项加上 <code>key</code>，React 就能识别"哪个元素是哪个"，而不是靠位置来判断。</p>
      <CodeBlock
        language="jsx"
        code={`// 旧列表
<li key="a">A</li>
<li key="b">B</li>
<li key="c">C</li>

// 新列表（在头部插入了 D）
<li key="d">D</li>
<li key="a">A</li>
<li key="b">B</li>
<li key="c">C</li>`}
      />
      <p>
        现在 React 对比的时候会说："哦，<code>key="a"</code> 的元素还在，只是位置挪了，不需要重新创建，移动一下就好。<code>key="d"</code> 是新面孔，创建它。"
      </p>
      <p>这样一来，真正需要操作的 DOM 就只有一个——新增的那个元素 D，其他三个只是位置调整，效率大幅提升。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>常见的坑：用 index 当 key</h2>
      <p>很多人图省事，直接用数组的下标作为 <code>key</code>：</p>
      <CodeBlock
        language="jsx"
        code={`{users.map((user, index) => (
  <li key={index}>{user.name}</li>
))}`}
      />
      <p>警告是消失了，但这其实埋了一个隐患。</p>
      <p><strong>问题在哪？</strong> index 是位置，不是身份。当列表顺序发生变化时，元素的 index 会跟着变，导致 React 认为"这是一个全新的元素"，从而丢失组件的内部状态。</p>
      <p>
        举个例子，假设你的列表每项都有一个输入框，用户在第一项里输入了"Hello"。这时候你把列表排了个序，第一项变成了原来的第二项。如果用 index 做 key，React 会认为 index=0 的输入框内容应该还是"Hello"，但实际上那个输入框对应的数据已经换人了——这就乱了。
      </p>
      <p><strong>什么时候用 index 才是安全的？</strong></p>
      <ul>
        <li>列表是静态的，不会重新排序，也不会增删</li>
        <li>列表项是简单的展示元素，没有内部状态</li>
      </ul>
      <p>其他情况，老老实实用数据里唯一的 ID。</p>
      <div className="demo-box">
        <p className="demo-label">对比：左侧 key=index，右侧 key=id。先在每项输入框里输入内容，再点「反转列表」——左侧会错位，右侧正确</p>
        <div className="demo-output" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <p style={{ marginBottom: '0.35rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>❌ key=index</p>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
              {keyDemoItems.map((item, index) => (
                <ListItemWithInput key={index} name={item.name} id={item.id} />
              ))}
            </ul>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <p style={{ marginBottom: '0.35rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>✅ key=id</p>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
              {keyDemoItems.map((item) => (
                <ListItemWithInput key={item.id} name={item.name} id={item.id} />
              ))}
            </ul>
          </div>
          <div style={{ flexBasis: '100%' }}>
            <button type="button" onClick={reverseKeyDemo} style={btnStyle}>反转列表</button>
          </div>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>Key 的几条使用规则</h2>

      <p><strong>1. Key 在兄弟元素中唯一就够了</strong></p>
      <p><code>key</code> 不需要全局唯一，只要在同一个列表里不重复就行。两个不同的列表可以用相同的 key，完全没问题。</p>
      <CodeBlock
        language="jsx"
        code={`// 这是合法的
<ul>
  <li key="1">列表 A 的第一项</li>
</ul>
<ul>
  <li key="1">列表 B 的第一项</li>
</ul>`}
      />

      <p><strong>2. Key 不会传递给组件</strong></p>
      <p>
        如果你在自定义组件上加了 <code>key</code>，组件内部是拿不到这个 prop 的。<code>key</code> 是 React 内部用的，不是给你的组件用的。如果你真的需要把 ID 传进去，得另外显式传一个 prop：
      </p>
      <CodeBlock
        language="jsx"
        code={`<UserCard key={user.id} userId={user.id} name={user.name} />`}
      />

      <p><strong>3. Key 必须稳定</strong></p>
      <p>
        不要用随机数或者时间戳生成 key，比如 <code>key=&#123;Math.random()&#125;</code>。这样每次渲染 key 都变，React 会认为所有元素都是新的，相当于每次都全量重建，比不加 key 还糟糕。
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>一个完整的例子</h2>
      <p>来看个实际场景，一个可以添加、删除待办事项的列表：</p>
      <CodeBlock
        language="jsx"
        code={`import { useState } from 'react';

let nextId = 3;
const initialTodos = [
  { id: 1, text: '买菜' },
  { id: 2, text: '写代码' },
];

function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: nextId++, text: input }]);
    setInput('');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="添加待办..."
      />
      <button onClick={addTodo}>添加</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => deleteTodo(todo.id)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}`}
      />
      <div className="demo-box">
        <p className="demo-label">可交互 TodoList：用 todo.id 当 key，添加、删除都不会错乱</p>
        <div className="demo-output">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <input
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              placeholder="添加待办..."
              style={{ padding: '0.4rem 0.6rem', flex: '1 1 120px', minWidth: 0, borderRadius: 6, border: '1px solid var(--border-color)' }}
            />
            <button type="button" onClick={addTodo} style={btnStyle}>添加</button>
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            {todos.map((todo) => (
              <li key={todo.id} style={{ marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {todo.text}
                <button type="button" onClick={() => deleteTodo(todo.id)} style={{ ...btnStyle, padding: '0.2rem 0.5rem', fontSize: '0.85rem' }}>删除</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p>注意这里用了 <code>todo.id</code> 作为 key。每个待办事项都有稳定、唯一的 ID，无论怎么添加删除，React 都能精准追踪每个元素，不会出现状态混乱的问题。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>总结</h2>
      <p>回过头来看，<code>key</code> 这个东西其实并不复杂，用一句话概括就是：</p>
      <blockquote style={{ borderLeft: '4px solid var(--react-cyan)', margin: '1rem 0', paddingLeft: '1rem', color: 'var(--text-muted)' }}>
        <strong>Key 是 React 在列表更新时识别元素身份的标记，它让 React 能够高效、准确地复用或更新 DOM 节点。</strong>
      </blockquote>
      <p>记住几个关键点：用稳定且唯一的值作为 key（比如数据库 ID），别用 index（除非列表是静态的），别用随机值。</p>
      <p>把这些搞清楚之后，你会发现 React 的列表渲染其实非常优雅。而且下次再看到控制台飘出那个熟悉的 warning，你也终于能理直气壮地知道它在说什么了。</p>
    </>
  )
}
