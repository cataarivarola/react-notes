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

const decisionBox = {
  padding: '0.4rem 0.8rem',
  borderRadius: 8,
  border: '1px solid rgba(148, 163, 184, 0.8)',
  background: 'rgba(15, 23, 42, 0.8)',
  fontSize: '0.9rem',
}

const decisionBoxEmphasis = {
  ...decisionBox,
  borderColor: 'var(--react-cyan)',
  background: 'rgba(15, 23, 42, 0.95)',
  color: 'var(--react-cyan)',
  fontWeight: 600,
}

export default function State() {
  const [liked, setLiked] = useState(false)
  const [countState, setCountState] = useState(0)
  const [cartQty, setCartQty] = useState(1)
  const [cartQty1, setCartQty1] = useState(1)
  const [cartQty2, setCartQty2] = useState(1)
  const [countAsync, setCountAsync] = useState(0)
  const lastCountWhenClicked = useRef(0)
  const [list, setList] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [qWillChange, setQWillChange] = useState(null)
  const [qNeedUiUpdate, setQNeedUiUpdate] = useState(null)
  const [qDerivable, setQDerivable] = useState(null)

  let decisionResult = '请先回答下面的问题。'
  let decisionStyle = decisionBox
  if (qWillChange === 'no') {
    decisionResult = '不变则用普通常量。'
  } else if (qWillChange === 'yes' && qNeedUiUpdate === 'no') {
    decisionResult = '变化但不需要更新页面 → 用普通变量即可。'
  } else if (qWillChange === 'yes' && qNeedUiUpdate === 'yes' && qDerivable === 'yes') {
    decisionResult = '能从其它 state / props 计算 → 不单独设 state。'
  } else if (qWillChange === 'yes' && qNeedUiUpdate === 'yes' && qDerivable === 'no') {
    decisionResult = '符合所有条件 → 建议设为独立 State！'
    decisionStyle = decisionBoxEmphasis
  }

  return (
    <>
      <h1>State 是什么？</h1>

      <h2>先从一个生活例子开始</h2>
      <p style={{ marginBottom: '1rem' }}>
        想象一下你的手机屏幕。现在是黑屏，你按了电源键，它亮了。你打开微信，未读消息数从 0 变成了 3。你开了飞行模式，WiFi 图标消失了。
      </p>
      <p style={{ marginBottom: '1.25rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>这些变化，都是「状态」。</p>
      <div
        style={{
          margin: '1.25rem 0',
          padding: '1rem 1.25rem',
          borderRadius: 12,
          borderLeft: '4px solid var(--react-cyan)',
          background: 'linear-gradient(135deg, rgba(97, 218, 251, 0.08) 0%, rgba(97, 218, 251, 0.02) 100%)',
        }}
      >
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', lineHeight: 1.6, fontWeight: 600 }}>
          状态（State），说白了就是：某个东西<span style={{ color: 'var(--react-cyan)' }}>「现在是什么样子」</span>。
        </p>
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)' }}>它会变，而且变了之后，屏幕上显示的东西也要跟着变。</p>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>React 里的 State 是什么</h2>
      <div className="text-with-image">
        <div className="text-with-image__text">
          <p>
            React 的核心思路就一句话：<strong>UI 是数据的映射</strong>。
          </p>
          <p>你的页面长什么样，完全取决于数据是什么。数据变了，页面就自动跟着变。</p>
          <p>
            State，就是那部分<strong>会变化、且变化之后需要更新页面</strong>的数据。
          </p>
        </div>
        <img
          src="/state-data-to-ui.png"
          alt="DATA (State) 通过映射驱动 UI 的示意图：左边是数据结构，右边是对应的界面"
          className="text-with-image__img"
        />
      </div>
      <p>举个最直白的例子：一个点赞按钮。</p>
      <CodeBlock
        language="jsx"
        code={'import { useState } from \'react\';\n\nfunction LikeButton() {\n  const [liked, setLiked] = useState(false);\n\n  return (\n    <button onClick={() => setLiked(!liked)}>\n      {liked ? \'❤️ 已点赞\' : \'🤍 点赞\'}\n    </button>\n  );\n}'}
      />
      <p>这里：</p>
      <ul>
        <li><code>liked</code> 就是 state，它记录着「用户现在有没有点赞」</li>
        <li>初始值是 <code>false</code>（没点赞）</li>
        <li>点击按钮时，调用 <code>setLiked</code> 改变它</li>
        <li>React 发现 state 变了，自动重新渲染，按钮文字就变了</li>
      </ul>
      <div className="demo-box">
        <p className="demo-label">试试看：点击按钮，文案会在「🤍 点赞」和「❤️ 已点赞」之间切换</p>
        <div className="demo-output">
          <button
            type="button"
            onClick={() => setLiked((prev) => !prev)}
            style={btnStyle}
          >
            {liked ? '❤️ 已点赞' : '🤍 点赞'}
          </button>
        </div>
      </div>
      <p>就这么简单。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>useState 的语法拆开来看</h2>
      <CodeBlock
        language="jsx"
        code={'const [liked, setLiked] = useState(false);'}
      />
      <p>这一行做了三件事：</p>
      <ol>
        <li><strong><code>useState(false)</code></strong> — 告诉 React：「帮我创建一个 state，初始值是 <code>false</code>」</li>
        <li><strong><code>liked</code></strong> — 这是当前的值，你用它来展示数据</li>
        <li><strong><code>setLiked</code></strong> — 这是修改它的函数，你只能通过它来改 state，不能直接 <code>liked = true</code> 这样写</li>
      </ol>
      <p>为什么不能直接赋值？因为 React 不知道你偷偷改了数据，它就不会重新渲染页面。必须通过 set 函数，React 才会「知道」有变化，然后触发更新。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>State vs 普通变量，区别在哪？</h2>
      <p>这是很多人刚开始的疑问：我直接用个普通变量不行吗？</p>
      <CodeBlock
        language="jsx"
        code={'// ❌ 这样不行\nfunction Counter() {\n  let count = 0;\n\n  return (\n    <button onClick={() => count++}>\n      点击次数：{count}\n    </button>\n  );\n}'}
      />
      <p>看起来没问题，但实际上点再多次，页面上永远显示 0。</p>
      <div className="demo-box">
        <p className="demo-label">对比：左边用普通变量（点多少次都不变），右边用 useState（点一次加一）</p>
        <div className="demo-output" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div>
            <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>❌ 普通变量</p>
            <p style={{ marginBottom: '0.5rem' }}>点击次数：<strong style={{ color: 'var(--text-primary)' }}>0</strong></p>
            <button type="button" style={{ ...btnStyle, opacity: 0.8 }} onClick={() => {}}>点我</button>
          </div>
          <div>
            <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>✅ useState</p>
            <p style={{ marginBottom: '0.5rem' }}>点击次数：<strong style={{ color: 'var(--react-cyan)' }}>{countState}</strong></p>
            <button type="button" style={btnStyle} onClick={() => setCountState((c) => c + 1)}>点我</button>
          </div>
        </div>
      </div>
      <p>原因是：React 每次重新渲染组件，都会<strong>重新执行这个函数</strong>。每次执行，<code>count</code> 又从 0 开始了。而且即便你真的改了 <code>count</code>，React 也不知道该重新渲染。</p>
      <p>State 的特别之处在于：<strong>React 帮你把它存在组件外面</strong>，每次重新渲染时，它的值是上次你设置的那个，而不是初始值。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>用一个稍微复杂的例子感受一下</h2>
      <p>一个简单的购物车数量控制：</p>
      <CodeBlock
        language="jsx"
        code={'import { useState } from \'react\';\n\nfunction CartItem({ name, price }) {\n  const [quantity, setQuantity] = useState(1);\n\n  const total = price * quantity;\n\n  return (\n    <div>\n      <h3>{name}</h3>\n      <div>\n        <button onClick={() => setQuantity(q => q - 1)} disabled={quantity <= 1}>\n          -\n        </button>\n        <span> {quantity} </span>\n        <button onClick={() => setQuantity(q => q + 1)}>\n          +\n        </button>\n      </div>\n      <p>小计：¥{total}</p>\n    </div>\n  );\n}'}
      />
      <div className="demo-box">
        <p className="demo-label">试试看：点 +/- 改数量，小计会随 state 自动更新</p>
        <div className="demo-output">
          <p style={{ marginTop: 0, marginBottom: '0.75rem', fontWeight: 600 }}>苹果 ¥5/个</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <button type="button" style={btnStyle} onClick={() => setCartQty((q) => Math.max(1, q - 1))}>−</button>
            <span style={{ minWidth: '2rem', textAlign: 'center' }}>{cartQty}</span>
            <button type="button" style={btnStyle} onClick={() => setCartQty((q) => q + 1)}>+</button>
          </div>
          <p style={{ margin: 0 }}>小计：¥<strong style={{ color: 'var(--react-cyan)' }}>{5 * cartQty}</strong></p>
        </div>
      </div>
      <p>注意这里有个细节：<code>{'setQuantity(q => q - 1)'}</code> 而不是直接写 <code>setQuantity(quantity - 1)</code>。</p>
      <p>这是因为 state 的更新在某些情况下是异步的。如果你在短时间内多次更新 state，直接用当前值可能会拿到「旧」的值。用函数形式 <code>{'q => q - 1'}</code>，React 保证你拿到的是最新的值。</p>
      <p>这是个小细节，但养成习惯比较好，特别是在做递增递减操作时。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>State 可以存什么？</h2>
      <p>State 可以是任何 JavaScript 值：</p>
      <CodeBlock
        language="jsx"
        code={'const [count, setCount] = useState(0);            // 数字\nconst [name, setName] = useState(\'\');             // 字符串\nconst [isOpen, setIsOpen] = useState(false);      // 布尔值\nconst [items, setItems] = useState([]);           // 数组\nconst [user, setUser] = useState({ name: \'\', age: 0 }); // 对象'}
      />
      <p>但有一点要注意：<strong>更新对象和数组的 state，必须传入新的引用，不能直接修改原来的</strong>。</p>
      <CodeBlock
        language="jsx"
        code={'// ❌ 错误做法\nconst addItem = (newItem) => {\n  items.push(newItem); // 直接修改了原数组\n  setItems(items);     // React 发现引用没变，不会更新\n};\n\n// ✅ 正确做法\nconst addItem = (newItem) => {\n  setItems([...items, newItem]); // 创建一个新数组\n};'}
      />
      <div className="demo-box">
        <p className="demo-label">试试看：用正确做法 setItems([...items, newItem]) 往列表里加一项</p>
        <div className="demo-output">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="输入一项"
              style={{ flex: 1, padding: '0.4rem 0.6rem', background: 'var(--code-bg)', border: '1px solid var(--border-color)', borderRadius: 6, color: 'var(--text-primary)' }}
            />
            <button
              type="button"
              style={btnStyle}
              onClick={() => {
                if (inputValue.trim()) {
                  setList((prev) => [...prev, inputValue.trim()])
                  setInputValue('')
                }
              }}
            >
              添加
            </button>
          </div>
          {list.length > 0 ? <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>{list.map((item, i) => <li key={i}>{item}</li>)}</ul> : <p style={{ margin: 0, color: 'var(--text-muted)' }}>列表为空，输入后点「添加」</p>}
        </div>
      </div>
      <p>这个「不可变性」的概念听起来有点别扭，但原则很简单：<strong>不要修改原来的值，而是创建一个新的</strong>。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>什么时候用 State，什么时候不用？</h2>
      <p>可以用一个简单的决策小图，快速判断「这份数据要不要定义成 state」：</p>
      <div className="demo-box">
        <p className="demo-label">快速判断：这个数据是否应该定义为 State（点按钮选择你的场景）</p>
        <div className="demo-output" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <div style={decisionBox}>这个数据会变化吗？</div>
            <button
              type="button"
              style={{
                ...btnStyle,
                padding: '0.25rem 0.7rem',
                background: qWillChange === 'yes' ? 'var(--react-cyan-light)' : 'transparent',
                color: qWillChange === 'yes' ? 'var(--react-cyan)' : 'var(--text-muted)',
                borderColor: qWillChange === 'yes' ? 'var(--react-cyan)' : 'var(--border-color)',
              }}
              onClick={() => setQWillChange('yes')}
            >
              是（YES）
            </button>
            <button
              type="button"
              style={{
                ...btnStyle,
                padding: '0.25rem 0.7rem',
                background: qWillChange === 'no' ? 'var(--react-cyan-light)' : 'transparent',
                color: qWillChange === 'no' ? 'var(--react-cyan)' : 'var(--text-muted)',
                borderColor: qWillChange === 'no' ? 'var(--react-cyan)' : 'var(--border-color)',
              }}
              onClick={() => setQWillChange('no')}
            >
              否（NO）
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <div style={decisionBox}>变化时需要更新页面吗？</div>
            <button
              type="button"
              style={{
                ...btnStyle,
                padding: '0.25rem 0.7rem',
                background: qNeedUiUpdate === 'yes' ? 'var(--react-cyan-light)' : 'transparent',
                color: qNeedUiUpdate === 'yes' ? 'var(--react-cyan)' : 'var(--text-muted)',
                borderColor: qNeedUiUpdate === 'yes' ? 'var(--react-cyan)' : 'var(--border-color)',
              }}
              onClick={() => setQNeedUiUpdate('yes')}
            >
              是（YES）
            </button>
            <button
              type="button"
              style={{
                ...btnStyle,
                padding: '0.25rem 0.7rem',
                background: qNeedUiUpdate === 'no' ? 'var(--react-cyan-light)' : 'transparent',
                color: qNeedUiUpdate === 'no' ? 'var(--react-cyan)' : 'var(--text-muted)',
                borderColor: qNeedUiUpdate === 'no' ? 'var(--react-cyan)' : 'var(--border-color)',
              }}
              onClick={() => setQNeedUiUpdate('no')}
            >
              否（NO）
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <div style={decisionBox}>能从其他 state 或 props 计算出来吗？</div>
            <button
              type="button"
              style={{
                ...btnStyle,
                padding: '0.25rem 0.7rem',
                background: qDerivable === 'yes' ? 'var(--react-cyan-light)' : 'transparent',
                color: qDerivable === 'yes' ? 'var(--react-cyan)' : 'var(--text-muted)',
                borderColor: qDerivable === 'yes' ? 'var(--react-cyan)' : 'var(--border-color)',
              }}
              onClick={() => setQDerivable('yes')}
            >
              是（YES）
            </button>
            <button
              type="button"
              style={{
                ...btnStyle,
                padding: '0.25rem 0.7rem',
                background: qDerivable === 'no' ? 'var(--react-cyan-light)' : 'transparent',
                color: qDerivable === 'no' ? 'var(--react-cyan)' : 'var(--text-muted)',
                borderColor: qDerivable === 'no' ? 'var(--react-cyan)' : 'var(--border-color)',
              }}
              onClick={() => setQDerivable('no')}
            >
              否（NO）
            </button>
          </div>

          <div style={{ marginTop: '0.5rem' }}>
            <p style={{ margin: '0 0 0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>建议：</p>
            <div style={decisionStyle}>{decisionResult}</div>
          </div>
        </div>
      </div>
      <p>举个例子，「购物车总价」就不应该是 state，因为它可以从「商品列表」这个 state 直接算出来。如果你把它也存成 state，你就要时刻保持两份数据同步，这会制造很多 bug。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>State 是局部的</h2>
      <p>每个组件的 state 都是<strong>独立</strong>的。</p>
      <div className="demo-box">
        <p className="demo-label">两个「购物项」各自维护数量，改一个不会影响另一个</p>
        <div className="demo-output" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
            <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>商品 A ¥10</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button type="button" style={{ ...btnStyle, padding: '0.35rem 0.6rem' }} onClick={() => setCartQty1((q) => Math.max(1, q - 1))}>−</button>
              <span>{cartQty1}</span>
              <button type="button" style={{ ...btnStyle, padding: '0.35rem 0.6rem' }} onClick={() => setCartQty1((q) => q + 1)}>+</button>
            </div>
          </div>
          <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
            <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>商品 B ¥20</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button type="button" style={{ ...btnStyle, padding: '0.35rem 0.6rem' }} onClick={() => setCartQty2((q) => Math.max(1, q - 1))}>−</button>
              <span>{cartQty2}</span>
              <button type="button" style={{ ...btnStyle, padding: '0.35rem 0.6rem' }} onClick={() => setCartQty2((q) => q + 1)}>+</button>
            </div>
          </div>
        </div>
      </div>
      <p>如果你在页面上放了两个 <code>CartItem</code> 组件，它们各自有自己的 <code>quantity</code>，互不干扰。修改一个，另一个不受影响。</p>
      <p>这也是 React 组件化思想的精髓：每个组件管好自己的状态，对外只暴露必要的接口。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>一个容易踩的坑：State 更新不是即时的</h2>
      <CodeBlock
        language="jsx"
        code={'function Example() {\n  const [count, setCount] = useState(0);\n\n  const handleClick = () => {\n    setCount(count + 1);\n    console.log(count); // 这里打印的还是 0，不是 1！\n  };\n}'}
      />
      <div className="demo-box">
        <p className="demo-label">点一下「+1」：下面「当前显示」会变，但「点击那一刻读到的 count」仍是旧值</p>
        <div className="demo-output">
          <button type="button" style={btnStyle} onClick={() => { lastCountWhenClicked.current = countAsync; setCountAsync((c) => c + 1); }}>+1</button>
          <p style={{ marginTop: '0.75rem', marginBottom: '0.25rem' }}>当前显示：<strong style={{ color: 'var(--react-cyan)' }}>{countAsync}</strong></p>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>你刚点的那一下，函数里读到的 count：<strong>{lastCountWhenClicked.current}</strong></p>
        </div>
      </div>
      <p>调用 <code>setCount</code> 之后，<code>count</code> 不会立刻变。React 会在这次事件处理完之后，统一更新并重新渲染。所以在 <code>setCount</code> 后面立刻读 <code>count</code>，拿到的还是旧值。</p>
      <p>如果你发现数据更新了但某个地方逻辑不对，先检查一下是不是踩了这个坑。</p>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

      <h2>总结</h2>
      <p>State 其实就是：<strong>组件自己管理的、会变化的、变了需要更新 UI 的数据</strong>。</p>
      <p>用 <code>useState</code> 来声明它，用 set 函数来更新它，React 会自动帮你把变化反映到页面上。</p>
      <p>掌握了 state，你就掌握了 React 里「数据驱动视图」这个核心理念的一半。另一半是 props（父传子的数据），那是另一个故事了。</p>
      <p>但说真的，光是把 state 用顺了，你就能做出很多有意思的东西了。从点赞按钮到表单输入、从折叠展开到计数器，React 里大部分的交互逻辑，都是从一个简单的 <code>useState</code> 开始的。</p>
    </>
  )
}
