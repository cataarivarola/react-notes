import { useReducer, useState } from 'react'
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

// ----- 计数器 Demo -----
const counterInitialState = { count: 0 }
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT': return { count: state.count + 1 }
    case 'DECREMENT': return { count: state.count - 1 }
    case 'RESET': return { count: 0 }
    default: return state
  }
}
function CounterDemo() {
  const [state, dispatch] = useReducer(counterReducer, counterInitialState)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
      <span>当前计数：<strong style={{ color: 'var(--react-cyan)' }}>{state.count}</strong></span>
      <button type="button" onClick={() => dispatch({ type: 'INCREMENT' })} style={btnStyle}>+1</button>
      <button type="button" onClick={() => dispatch({ type: 'DECREMENT' })} style={btnStyle}>-1</button>
      <button type="button" onClick={() => dispatch({ type: 'RESET' })} style={btnStyle}>重置</button>
    </div>
  )
}

// ----- 流程小演示：dispatch → reducer → 新 state -----
const flowInitialState = { count: 0 }
function flowReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT': return { count: state.count + 1 }
    default: return state
  }
}
function FlowDemo() {
  const [state, dispatch] = useReducer(flowReducer, flowInitialState)
  const [lastAction, setLastAction] = useState(null)
  const handleSend = () => {
    const action = { type: 'INCREMENT' }
    setLastAction(action)
    dispatch(action)
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button type="button" onClick={handleSend} style={btnStyle}>发送 INCREMENT</button>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>→ reducer 处理 → 新 state</span>
      </div>
      <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
        {lastAction && <div>上次 dispatch：{JSON.stringify(lastAction)}</div>}
        <div>当前 state：{JSON.stringify(state)}</div>
      </div>
    </div>
  )
}

// ----- 购物车 reducer（Demo + Context 共用）-----
const cartInitialState = { items: [], totalPrice: 0 }
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItems = [...state.items, action.payload]
      return { ...state, items: newItems, totalPrice: newItems.reduce((s, i) => s + i.price, 0) }
    }
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter((i) => i.id !== action.payload)
      return { ...state, items: newItems, totalPrice: newItems.reduce((s, i) => s + i.price, 0) }
    }
    case 'CLEAR_CART':
      return { ...state, items: [], totalPrice: 0 }
    default:
      return state
  }
}
const DEMO_PRODUCTS = [
  { id: 'p1', name: '苹果', price: 5 },
  { id: 'p2', name: '香蕉', price: 3 },
  { id: 'p3', name: '牛奶', price: 8 },
]
function CartDemo() {
  const [state, dispatch] = useReducer(cartReducer, cartInitialState)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div>
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>商品（点「加入」加入购物车）</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {DEMO_PRODUCTS.map((p) => (
            <span key={p.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.6rem', background: 'var(--bg-secondary)', borderRadius: 6, border: '1px solid var(--border-color)' }}>
              {p.name} ¥{p.price}
              <button type="button" onClick={() => dispatch({ type: 'ADD_ITEM', payload: p })} style={btnStyle}>加入</button>
            </span>
          ))}
        </div>
      </div>
      <div>
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>购物车</p>
        {state.items.length === 0 ? (
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>暂无商品</p>
        ) : (
          <>
            <ul style={{ listStyle: 'none', paddingLeft: 0, margin: '0 0 0.5rem 0' }}>
              {state.items.map((item) => (
                <li key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  {item.name} ¥{item.price}
                  <button type="button" onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })} style={{ ...btnStyle, padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>删除</button>
                </li>
              ))}
            </ul>
            <p style={{ margin: 0 }}>总价：<strong style={{ color: 'var(--react-cyan)' }}>¥{state.totalPrice}</strong></p>
            <button type="button" onClick={() => dispatch({ type: 'CLEAR_CART' })} style={btnStyle}>清空购物车</button>
          </>
        )}
      </div>
    </div>
  )
}

// ----- useState vs useReducer 怎么选：可交互对比 -----
const CHOICE_SCENARIOS = [
  { id: 'switch', label: '一个开关', choice: 'useState' },
  { id: 'input', label: '输入框内容', choice: 'useState' },
  { id: 'counter', label: '一个数字/计数器', choice: 'useState' },
  { id: 'cart', label: '购物车（列表 + 总价）', choice: 'useReducer' },
  { id: 'multi-set', label: '一个操作里三四个 setState', choice: 'useReducer' },
  { id: 'form', label: '多步骤表单', choice: 'useReducer' },
]
function UseStateVsReducerChoice() {
  const [selectedId, setSelectedId] = useState(null)
  const selected = selectedId ? CHOICE_SCENARIOS.find((s) => s.id === selectedId) : null
  const cardBase = {
    flex: '1 1 240px',
    minWidth: 0,
    padding: '1rem 1.25rem',
    borderRadius: 12,
    border: '1px solid var(--border-color)',
    background: 'var(--bg-secondary)',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }
  const cardHighlight = (kind) =>
    selected && selected.choice === kind
      ? { borderColor: 'var(--react-cyan)', boxShadow: '0 0 0 2px rgba(97, 218, 251, 0.25)' }
      : {}
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>点下面任意场景，看它更适合谁：</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {CHOICE_SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSelectedId(selectedId === s.id ? null : s.id)}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: 20,
              border: '1px solid var(--border-color)',
              background: selectedId === s.id ? 'var(--react-cyan-light)' : 'var(--bg-secondary)',
              color: selectedId === s.id ? 'var(--react-cyan)' : 'var(--text-primary)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              fontWeight: selectedId === s.id ? 600 : 400,
              transition: 'background 0.15s, color 0.15s, border-color 0.15s',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ ...cardBase, ...cardHighlight('useState') }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>适合 useState</span>
            {selected && selected.choice === 'useState' && (
              <span style={{ fontSize: '0.75rem', color: 'var(--react-cyan)', fontWeight: 600 }}>✓ 更适合</span>
            )}
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            <li>状态是<strong style={{ color: 'var(--text-primary)' }}>独立的简单值</strong></li>
            <li>状态之间<strong style={{ color: 'var(--text-primary)' }}>没什么关联</strong></li>
            <li>改起来<strong style={{ color: 'var(--text-primary)' }}>不复杂</strong></li>
          </ul>
          <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {['开关', '输入框', '数字'].map((tag) => (
              <span key={tag} style={{ padding: '0.2rem 0.5rem', borderRadius: 6, background: 'rgba(97, 218, 251, 0.12)', color: 'var(--react-cyan)', fontSize: '0.8rem' }}>{tag}</span>
            ))}
          </div>
        </div>
        <div style={{ ...cardBase, ...cardHighlight('useReducer') }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>适合 useReducer</span>
            {selected && selected.choice === 'useReducer' && (
              <span style={{ fontSize: '0.75rem', color: 'var(--react-cyan)', fontWeight: 600 }}>✓ 更适合</span>
            )}
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            <li>状态是<strong style={{ color: 'var(--text-primary)' }}>多字段对象</strong>，需同步更新</li>
            <li>变更逻辑<strong style={{ color: 'var(--text-primary)' }}>比较复杂</strong></li>
            <li>同一操作有<strong style={{ color: 'var(--text-primary)' }}>多种情况</strong>要处理</li>
          </ul>
          <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {['购物车', '多步表单', '列表+筛选'].map((tag) => (
              <span key={tag} style={{ padding: '0.2rem 0.5rem', borderRadius: 6, background: 'rgba(97, 218, 251, 0.12)', color: 'var(--react-cyan)', fontSize: '0.8rem' }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function UseReducer() {
  return (
    <>
      <h1>useReducer：当 useState 开始让你头疼的时候</h1>
      <p>
        我记得我第一次看到 <code>useReducer</code> 这个名字的时候，脑子里冒出来的第一个问题是：<strong>"我已经有 useState 了，为什么还需要这个东西？"</strong>
      </p>
      <p>相信很多人都有过同样的疑问。useState 不是挺好用的吗？简单、直接，改个值就完事了。</p>
      <p>
        但随着项目越写越复杂，你会慢慢发现一些让人不舒服的地方——状态越来越多，setState 到处都是，一个操作要同时改好几个状态，逻辑散落在组件各个角落……这时候你再回头看 <code>useReducer</code>，会突然觉得：哦，原来它是来解决这个问题的。
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>先从一个"让 useState 开始难受"的场景说起</h2>
      <p>假设你在做一个购物车，用 useState 来管理状态：</p>
      <CodeBlock
        language="jsx"
        code={`const [items, setItems] = useState([]);
const [totalPrice, setTotalPrice] = useState(0);
const [discount, setDiscount] = useState(0);
const [isLoading, setIsLoading] = useState(false);`}
      />
      <p>然后用户点了"添加商品"，你需要：</p>
      <CodeBlock
        language="jsx"
        code={`const addItem = (product) => {
  setItems(prev => [...prev, product]);
  setTotalPrice(prev => prev + product.price);
  setDiscount(calculateDiscount([...items, product]));
  // 还可能要改其他几个状态...
};`}
      />
      <p>
        问题开始浮现了。这些状态其实是<strong>高度相关的</strong>，但你用一堆零散的 <code>useState</code> 把它们分开管理，每次操作都要手动保持它们之间的一致性。写的人累，后来维护的人看着也头疼。
      </p>
      <p>这就是 <code>useReducer</code> 出场的时机。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>useReducer 的核心思想</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
        <code>useReducer</code> 的灵感来自 <strong style={{ color: 'var(--text-primary)' }}>Redux</strong>，而 Redux 的思想又源自函数式编程里的 <code>reduce</code>。但你不需要了解这些背景，只需记住下面这一句。
      </p>
      <div
        style={{
          margin: '1.25rem 0',
          padding: '1.25rem 1.5rem',
          borderRadius: 12,
          borderLeft: '4px solid var(--react-cyan)',
          background: 'linear-gradient(135deg, rgba(97, 218, 251, 0.08) 0%, rgba(97, 218, 251, 0.02) 100%)',
          color: 'var(--text-primary)',
        }}
      >
        <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.6, fontWeight: 600 }}>
          把「状态是什么」和「怎么改状态」<span style={{ color: 'var(--react-cyan)' }}>分开来管理</span>。
        </p>
      </div>
      <p style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>具体来说：</p>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          margin: '1rem 0',
          padding: '1rem',
          background: 'var(--bg-secondary)',
          borderRadius: 12,
          border: '1px solid var(--border-color)',
          fontSize: '0.9rem',
        }}
      >
        <span style={{ padding: '0.35rem 0.75rem', borderRadius: 8, background: 'rgba(97, 218, 251, 0.15)', color: 'var(--react-cyan)', fontWeight: 500 }}>组件</span>
        <span style={{ color: 'var(--text-muted)' }}>→</span>
        <code style={{ padding: '0.35rem 0.6rem', borderRadius: 6, background: 'var(--bg-primary)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>dispatch(action)</code>
        <span style={{ color: 'var(--text-muted)' }}>→</span>
        <span style={{ padding: '0.35rem 0.75rem', borderRadius: 8, background: 'rgba(97, 218, 251, 0.15)', color: 'var(--react-cyan)', fontWeight: 500 }}>reducer</span>
        <span style={{ color: 'var(--text-muted)' }}>→</span>
        <span style={{ padding: '0.35rem 0.75rem', borderRadius: 8, background: 'rgba(97, 218, 251, 0.1)', color: 'var(--text-primary)', fontWeight: 500 }}>新 state</span>
      </div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
        <div
          style={{
            flex: '1 1 200px',
            minWidth: 0,
            padding: '1rem 1.25rem',
            borderRadius: 12,
            border: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
          }}
        >
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: 'var(--react-cyan)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>组件</p>
          <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>只负责<strong>「发通知」</strong>——发生了什么事，就 dispatch 一个 action。</p>
        </div>
        <div
          style={{
            flex: '1 1 200px',
            minWidth: 0,
            padding: '1rem 1.25rem',
            borderRadius: 12,
            border: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
          }}
        >
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: 'var(--react-cyan)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>reducer</p>
          <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>收到通知，<strong>决定状态怎么变</strong>。职责清晰，互不干涉。</p>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>看懂这三个概念，你就入门了</h2>
      <p><strong>State（状态）</strong>：就是你的数据，和 useState 里的 state 是一个意思。</p>
      <p><strong>Action（动作）</strong>：一个普通的 JavaScript 对象，描述"发生了什么事"。通常长这样：</p>
      <CodeBlock
        language="js"
        code={`{ type: 'ADD_ITEM', payload: product }`}
      />
      <p><code>type</code> 告诉 reducer 发生了什么，<code>payload</code> 是附带的数据（可选）。</p>
      <p><strong>Reducer（处理器）</strong>：一个纯函数，接收当前状态和 action，返回新的状态：</p>
      <CodeBlock
        language="js"
        code={`function reducer(state, action) {
  // 根据 action.type 决定怎么返回新状态
}`}
      />
      <p style={{ marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>三者的关系用一句话串起来就是：</p>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '0.4rem',
          margin: '1rem 0',
          padding: '1rem 1.25rem',
          background: 'linear-gradient(135deg, rgba(97, 218, 251, 0.06) 0%, rgba(97, 218, 251, 0.02) 100%)',
          borderRadius: 12,
          border: '1px solid var(--border-color)',
          fontSize: '0.88rem',
        }}
      >
        <span style={{ padding: '0.3rem 0.6rem', borderRadius: 8, background: 'rgba(97, 218, 251, 0.15)', color: 'var(--react-cyan)', fontWeight: 500 }}>组件</span>
        <span style={{ color: 'var(--text-muted)' }}>dispatch</span>
        <span style={{ padding: '0.3rem 0.6rem', borderRadius: 6, background: 'var(--bg-primary)', border: '1px solid var(--border-color)', fontFamily: 'monospace', fontSize: '0.82rem' }}>action</span>
        <span style={{ color: 'var(--text-muted)', margin: '0 0.15rem' }}>→</span>
        <span style={{ padding: '0.3rem 0.6rem', borderRadius: 8, background: 'rgba(97, 218, 251, 0.15)', color: 'var(--react-cyan)', fontWeight: 500 }}>reducer</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>接收 state + action</span>
        <span style={{ color: 'var(--text-muted)', margin: '0 0.15rem' }}>→</span>
        <span style={{ padding: '0.3rem 0.6rem', borderRadius: 8, background: 'rgba(97, 218, 251, 0.1)', color: 'var(--text-primary)', fontWeight: 500 }}>新 state</span>
        <span style={{ color: 'var(--text-muted)', margin: '0 0.15rem' }}>→</span>
        <span style={{ padding: '0.3rem 0.6rem', borderRadius: 8, background: 'rgba(97, 218, 251, 0.12)', color: 'var(--react-cyan)', fontWeight: 500 }}>组件重新渲染</span>
      </div>
      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
        组件只发通知，reducer 算新状态，界面跟着更新。
      </p>
      <div className="demo-box">
        <p className="demo-label">流程小演示：点「发送 INCREMENT」看上次 dispatch 的 action 与当前 state</p>
        <div className="demo-output">
          <FlowDemo />
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>直接上代码，看一个完整的例子</h2>
      <p>我们用 <code>useReducer</code> 重新做一个计数器，先从最简单的开始：</p>
      <CodeBlock
        language="jsx"
        code={`import { useReducer } from 'react';

// 1. 定义初始状态
const initialState = { count: 0 };

// 2. 定义 reducer
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    default:
      return state; // 不认识的 action，原样返回
  }
}

// 3. 在组件里使用
function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>当前计数：\${'{state.count}'}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-1</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>重置</button>
    </div>
  );
}`}
      />
      <div className="demo-box">
        <p className="demo-label">可交互计数器：点 +1 / -1 / 重置，体会 dispatch(action) → reducer → 新 state</p>
        <div className="demo-output">
          <CounterDemo />
        </div>
      </div>
      <p>
        注意 <code>useReducer</code> 返回的是 <code>[state, dispatch]</code>，<code>dispatch</code> 就是你用来"发通知"的函数。你告诉它发生了什么，它负责把 action 传给 reducer，然后 React 用新的 state 重新渲染组件。
      </p>
      <p>计数器这个例子还不够说明 <code>useReducer</code> 的优势，我们来看一个更复杂的场景。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>真正体现价值的例子：购物车</h2>
      <CodeBlock
        language="jsx"
        code={`const initialState = {
  items: [],
  totalPrice: 0,
  isLoading: false,
  error: null,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItems = [...state.items, action.payload];
      return {
        ...state,
        items: newItems,
        totalPrice: newItems.reduce((sum, item) => sum + item.price, 0),
      };
    }
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: newItems,
        totalPrice: newItems.reduce((sum, item) => sum + item.price, 0),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [], totalPrice: 0 };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
}

function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addProduct = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeProduct = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  return (
    <div>
      \${'{state.isLoading && <p>加载中...</p>}'}
      \${'{state.error && <p>出错了：{state.error}</p>}'}
      <p>总价：¥\${'{state.totalPrice}'}</p>
      <ul>
        \${'{state.items.map(item => ('}
          <li key=\${'{item.id}'}>
            \${'{item.name}'}
            <button onClick={() => removeProduct(item.id)}>删除</button>
          </li>
        \${'))}'}
      </ul>
      <button onClick={() => dispatch({ type: 'CLEAR_CART' })}>清空购物车</button>
    </div>
  );
}`}
      />
      <div className="demo-box">
        <p className="demo-label">可交互购物车：加商品、删单项、清空，列表与总价都由 reducer 统一更新</p>
        <div className="demo-output">
          <CartDemo />
        </div>
      </div>
      <p>感受到区别了吗？所有跟状态变更相关的逻辑，全部集中在 <code>cartReducer</code> 里。组件本身变得非常干净，只负责渲染和触发 action，不需要关心状态是怎么计算出来的。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>useState 还是 useReducer？怎么选</h2>
      <p>很多人纠结这个问题，其实可以用一个简单的标准来判断。下面这块可以点着玩：</p>
      <div className="demo-box">
        <p className="demo-label">点场景看归属：选中的场景会高亮对应的「适合 useState」或「适合 useReducer」卡片</p>
        <div className="demo-output">
          <UseStateVsReducerChoice />
        </div>
      </div>
      <p style={{ marginTop: '0.5rem' }}>还有一个信号：<strong>如果你发现自己在一个事件处理函数里连续调用了三四个 setState，很可能就该换 useReducer 了。</strong></p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>一个很有用的技巧：把 action 类型抽成常量</h2>
      <p>随着 action 越来越多，直接写字符串容易拼错，而且没有任何提示。推荐把 action 类型抽出来：</p>
      <CodeBlock
        language="js"
        code={`// actions.js
export const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
};`}
      />
      <p>然后在组件里这样用：</p>
      <CodeBlock
        language="jsx"
        code={`import { CART_ACTIONS } from './actions';

dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: product });`}
      />
      <p>这样拼错了 IDE 会报红，好过在运行时才发现 action 没生效。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>最后说一句</h2>
      <p>
        <code>useReducer</code> 的本质不是什么高深的概念，它只是在帮你做一件事：<strong>把"发生了什么"和"状态怎么变"这两个问题分开来回答</strong>。
      </p>
      <p>当你的状态逻辑还很简单，useState 就够了，不要为了用而用。但当你开始觉得状态管理开始乱、开始难以追踪的时候，<code>useReducer</code> 往往就是那个让代码重新变清晰的工具。</p>
      <p>
        用熟了你会发现，它不只是让代码更整洁，还有一个隐藏好处——因为所有状态变更都集中在 reducer 里，<strong>调试和测试变得异常容易</strong>。你甚至可以单独把 reducer 函数拿出来写单元测试，完全不需要渲染任何组件。
      </p>
      <p>这种感觉，真的很爽。</p>
    </>
  )
}
