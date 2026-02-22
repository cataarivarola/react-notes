import { useRef, useState } from 'react'
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

export default function UseState() {
  const [count, setCount] = useState(0)
  const [countAdd3, setCountAdd3] = useState(0)
  const initCallCountRef = useRef(0)
  const [lazyInitState] = useState(() => {
    initCallCountRef.current += 1
    return 0
  })
  const [lazyDummy, setLazyDummy] = useState(0)
  const [user, setUser] = useState({ name: '张三', age: 18 })
  const [userAgeInput, setUserAgeInput] = useState('18')
  const [readAfterSet, setReadAfterSet] = useState(null)
  const [countForRead, setCountForRead] = useState(0)

  const add3Direct = () => {
    setCountAdd3(countAdd3 + 1)
    setCountAdd3(countAdd3 + 1)
    setCountAdd3(countAdd3 + 1)
  }
  const add3Functional = () => {
    setCountAdd3((c) => c + 1)
    setCountAdd3((c) => c + 1)
    setCountAdd3((c) => c + 1)
  }
  const setTenAndRead = () => {
    setCountForRead(10)
    setReadAfterSet(countForRead)
  }

  return (
    <>
      <h1>useState：让函数组件"记住"点什么</h1>
      <p>
        学 React 函数组件，第一个要打交道的 Hook 八成就是 <code>useState</code>。组件要响应用户操作、要跟着数据变、要"有记忆"——这些都得靠状态。以前只有类组件有 <code>this.state</code>，现在函数组件靠 <code>useState</code> 也能有一块自己的小天地了。
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>它到底返回啥</h2>
      <p>
        <code>useState(初始值)</code> 会返回一个数组，里面两样东西：<strong>当前状态值</strong> 和 <strong>更新这个状态的函数</strong>。一般我们会用
        <PopoverCard
          trigger={<button type="button" className="inline-link-button">数组解构</button>}
          title="数组解构"
        >
          <p style={{ margin: 0 }}>
            JavaScript 的语法：<code>const [a, b] = [1, 2]</code> 会把右边数组的第 0 项赋给 <code>a</code>、第 1 项赋给 <code>b</code>。所以 <code>const [count, setCount] = useState(0)</code> 就是把 useState 返回的数组拆成两个变量，第一个是状态值，第二个是更新函数。
          </p>
        </PopoverCard>
        给它们起个名：
      </p>
      <CodeBlock
        language="jsx"
        code={`const [count, setCount] = useState(0);
//  count：当前是几
//  setCount：用来把 count 改成别的数`}
      />
      <p>
        你传进去的 <code>0</code> 就是第一次渲染时 <code>count</code> 的值。之后用户点按钮、输文字，你调用 <code>setCount(新值)</code>，React 会重新渲染这个组件，并把 <code>count</code> 更新成你设的那个值。界面就跟着变了。
      </p>

      <h2>一个最简例子：计数器</h2>
      <CodeBlock
        language="jsx"
        code={`function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>当前: \${'{count}'}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}`}
      />
      <div className="demo-box">
        <p className="demo-label">可交互计数器：点 +1，界面跟着变</p>
        <div className="demo-output">
          <p style={{ marginTop: 0, marginBottom: '0.5rem' }}>当前：<strong style={{ color: 'var(--react-cyan)' }}>{count}</strong></p>
          <button type="button" onClick={() => setCount(count + 1)} style={btnStyle}>+1</button>
        </div>
      </div>
      <p>
        点击按钮时，<code>setCount(count + 1)</code> 把状态从 0 变成 1、再变成 2……每次状态一变，组件重新执行一遍，<code>count</code> 拿到的是最新值，界面上的数字就更新了。这就是 <code>useState</code> 最基础的用法。
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>为啥有时候要传函数而不是直接传值</h2>
      <p>
        上面那种 <code>setCount(count + 1)</code> 在简单场景没问题。但有一种情况会出 bug：<strong>新状态要依赖"当前状态"算出来</strong>，而且可能<strong>连续调用多次 setState</strong>，或者在<strong>异步回调</strong>里调用。
      </p>
      <p>
        比如你写 <code>setCount(count + 1)</code>，这里的 <code>count</code> 是这次渲染时的值，是闭包里的一个"快照"。如果 React 把多次更新合并成一次渲染，或者你在 <code>setTimeout</code> 里过了一会才调用 <code>setCount(count + 1)</code>，用的可能还是旧的 <code>count</code>，结果就会少加、或者加错。
      </p>
      <p>
        正确做法是：<strong>给 setState 传一个函数</strong>。这个函数会收到"上一次的 state"，你根据它算出新 state 再返回。这样不管合并更新还是异步，用的都是最新的一份。
      </p>
      <CodeBlock
        language="jsx"
        code={`// 推荐：函数式更新，始终基于"上一次"的值
setCount(prevCount => prevCount + 1);`}
      />
      <p>
        所以记住：<strong>只要新状态要依赖旧状态算出来，就传函数</strong>。连续点两次"加一"、在 <code>setTimeout</code> 里延迟加一、或者别的地方可能连续调多次 setState，都用这种写法更稳。
      </p>
      <div className="demo-box">
        <p className="demo-label">对比：左侧连续三次 setState 用直接传值（只 +1），右侧用函数式（+3）</p>
        <div className="demo-output">
          <p style={{ marginTop: 0, marginBottom: '0.5rem' }}>当前值：<strong style={{ color: 'var(--react-cyan)' }}>{countAdd3}</strong></p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button type="button" onClick={add3Direct} style={btnStyle}>加 3 次（直接传值）</button>
            <button type="button" onClick={add3Functional} style={btnStyle}>加 3 次（函数式）</button>
          </div>
        </div>
      </div>

      <h2>惰性初始值：贵重的初值只算一次</h2>
      <p>
        有时候初始状态不是写死的 <code>0</code> 或 <code>''</code>，而是要从 localStorage 读、或者算一遍很贵的结果。如果你写成 <code>useState(expensiveComputation())</code>，那<strong>每次组件重新渲染都会跑一遍</strong> <code>expensiveComputation()</code>，哪怕结果根本没用到——因为函数组件每次渲染都会从头执行，这行代码会反复执行。
      </p>
      <p>
        解决办法：<strong>传一个函数进去</strong>，不传结果。React 只会在第一次渲染时调用这个函数，用它的返回值作为初始 state，之后就不会再调了。
      </p>
      <CodeBlock
        language="jsx"
        code={`// 只会在首次渲染时执行一次
const [state, setState] = useState(() => {
  return JSON.parse(localStorage.getItem('key')) ?? defaultValue;
});`}
      />
      <div className="demo-box">
        <p className="demo-label">惰性初始化：初始函数只会在首次渲染时执行一次，点「强制重渲染」后次数仍为 1</p>
        <div className="demo-output">
          <p style={{ marginTop: 0, marginBottom: '0.5rem' }}>初始函数调用次数：<strong style={{ color: 'var(--react-cyan)' }}>{initCallCountRef.current}</strong></p>
          <button type="button" onClick={() => setLazyDummy((d) => d + 1)} style={btnStyle}>强制重渲染</button>
        </div>
      </div>
      <p>
        这样昂贵的计算或 IO 只发生一次，不会拖慢后面的每次渲染。
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>更新对象和数组：别忘了"不可变"</h2>
      <p>
        React 里状态更新的一大原则是：<strong>不要直接改原来的对象或数组</strong>，而是造一个新的去替换。比如 state 是个对象，你想改其中某一个字段：
      </p>
      <CodeBlock
        language="jsx"
        code={`const [user, setUser] = useState({ name: '张三', age: 18 });

// 错误：直接改原对象，React 可能认为没变化
user.age = 19;
setUser(user);

// 正确：用新对象替换
setUser({ ...user, age: 19 });`}
      />
      <div className="demo-box">
        <p className="demo-label">正确更新对象：用新对象替换，改年龄后界面会更新</p>
        <div className="demo-output">
          <p style={{ marginTop: 0, marginBottom: '0.5rem' }}>当前 user：<strong style={{ color: 'var(--react-cyan)' }}>{user.name}</strong>，年龄 <strong style={{ color: 'var(--react-cyan)' }}>{user.age}</strong></p>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="number"
              value={userAgeInput}
              onChange={(e) => setUserAgeInput(e.target.value)}
              style={{ padding: '0.35rem 0.5rem', width: 64, borderRadius: 6, border: '1px solid var(--border-color)' }}
            />
            <button type="button" onClick={() => setUser({ ...user, age: Number(userAgeInput) || user.age })} style={btnStyle}>正确更新（新对象）</button>
          </div>
        </div>
      </div>
      <p>
        数组也一样：不要 <code>arr.push()</code> 再 <code>setArr(arr)</code>，而是 <code>setArr([...arr, newItem])</code> 或 <code>setArr(arr.filter(...))</code> 这样生成新数组再 set。这样 React 才能正确对比、触发更新，也避免把"可变"带来的坑带进组件里。
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>几个小贴士</h2>
      <ul>
        <li><strong>一个 state 变量可以只存一种"类型"的事</strong>。如果一块状态里既有 A 又有 B，且总是一起变，可以放在一个对象里；如果彼此独立，拆成多个 <code>useState</code> 更清晰，也方便按需更新。</li>
        <li><strong>setState 后不会立刻拿到新值</strong>。你调用 <code>setCount(1)</code> 之后，下面一行代码里 <code>count</code> 还是旧值；新值要等到下一次渲染才能看到。这是故意设计的，为的是把多次 setState 合并成一次渲染。（下面 demo 可体验：点「设为 10」后，当前 count 会变成 10，但「点下按钮时读到的值」仍是旧值。）</li>
        <li>如果更新后的 state 和当前 state 完全一样（用 <code>Object.is</code> 比较），React 会<strong>跳过这次渲染</strong>，不会白跑一遍子树。</li>
      </ul>
      <div className="demo-box">
        <p className="demo-label">setState 后立刻读到的仍是旧值</p>
        <div className="demo-output">
          <p style={{ marginTop: 0, marginBottom: '0.25rem' }}>当前 count：<strong style={{ color: 'var(--react-cyan)' }}>{countForRead}</strong></p>
          <p style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>点「设为 10」时、同一时刻读到的值（旧值）：{readAfterSet !== null ? readAfterSet : '—'}</p>
          <button type="button" onClick={setTenAndRead} style={btnStyle}>设为 10</button>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>小结</h2>
      <p>
        <code>useState</code> 就是：给函数组件一块状态，一个"当前值"加一个"更新函数"。记得<strong>依赖旧状态时用函数式更新</strong>、<strong>贵重初值用惰性初始化</strong>、<strong>对象和数组要不可变地更新</strong>。把这几点养成习惯，日常写组件就够用了。更复杂的逻辑可以交给 <code>useReducer</code>，那是另一篇的事了。
      </p>
    </>
  )
}
