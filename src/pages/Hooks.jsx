export default function Hooks() {
  return (
    <>
      <h1>Hooks 入门</h1>
      <p>
        Hooks 是 React 16.8 引入的特性，让你在函数组件里使用 state 和其他 React 能力，而不用写 class。
      </p>

      <h2>为什么有 Hooks？</h2>
      <ul>
        <li>在组件之间复用状态逻辑很难（高阶组件、render props 会让代码难懂）</li>
        <li>复杂组件难以理解（生命周期里塞满不相关的逻辑）</li>
        <li>class 对人和机器都不友好（this、绑定、打包体积）</li>
      </ul>
      <p>Hooks 让你把相关逻辑拆成更小的函数，按「做什么」组织，而不是按生命周期。</p>

      <h2>使用 Hooks 的规则</h2>
      <ol>
        <li><strong>只在最顶层使用</strong>：不要在循环、条件或嵌套函数里调用 Hook，保证每次渲染调用顺序一致</li>
        <li><strong>只在 React 函数里使用</strong>：在函数组件或自定义 Hook 里调用，不要在普通 JS 函数里调用</li>
      </ol>
      <p>遵守这两条规则，React 才能正确地把多个 useState / useEffect 和组件对应起来。</p>

      <h2>常用 Hooks 一览</h2>
      <ul>
        <li><code>useState</code>：状态</li>
        <li><code>useEffect</code>：副作用（订阅、请求、DOM 等）</li>
        <li><code>useContext</code>：消费 Context</li>
        <li><code>useReducer</code>：复杂 state 逻辑</li>
        <li><code>useCallback</code> / <code>useMemo</code>：缓存函数和值，配合性能优化</li>
      </ul>
    </>
  )
}
