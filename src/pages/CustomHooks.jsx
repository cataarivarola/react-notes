import CodeBlock from '../components/CodeBlock'

export default function CustomHooks() {
  return (
    <>
      <h1>自定义 Hooks</h1>
      <p>
        自定义 Hook 是一个以 <code>use</code> 开头的函数，内部可以调用其他 Hooks。用来把组件间重复的状态逻辑抽出来复用。
      </p>

      <h2>为什么要自定义 Hook？</h2>
      <p>当多个组件需要同一套逻辑（例如「订阅窗口大小」「倒计时」「请求列表」）时，可以把逻辑抽到一个 <code>useXxx</code> 里，组件里只调用这个 Hook，代码更简洁、逻辑更集中。</p>

      <h2>示例：useWindowWidth</h2>
      <CodeBlock
        language="jsx"
        code={`function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

function MyComponent() {
  const width = useWindowWidth();
  return <p>窗口宽度: \${'{width}'}</p>;
}`}
      />

      <h2>示例：useFetch</h2>
      <CodeBlock
        language="javascript"
        code={`function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}`}
      />

      <h2>规则</h2>
      <p>自定义 Hook 内部也要遵守 Hooks 规则：只在顶层和 React 函数里调用 Hooks。命名以 <code>use</code> 开头，便于工具和人工识别。</p>
    </>
  )
}
