import CodeBlock from '../components/CodeBlock'

export default function TypeScript() {
  return (
    <>
      <h1>与 TypeScript 结合</h1>
      <p>
        用 TypeScript 写 React 可以获得更好的类型提示和重构体验。用 Vite 创建项目时选 <code>react-ts</code> 模板即可。
      </p>

      <h2>组件 Props 类型</h2>
      <CodeBlock
        language="typescript"
        code={`interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      \${'{label}'}
    </button>
  );
}`}
      />

      <h2>Children 与事件类型</h2>
      <CodeBlock
        language="typescript"
        code={`interface CardProps {
  title: string;
  children: React.ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    <div>
      <h2>\${'{title}'}</h2>
      \${'{children}'}
    </div>
  );
}

// 事件类型
function Input() {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  return <input onChange={handleChange} />;
}`}
      />

      <h2>useState 类型</h2>
      <CodeBlock
        language="typescript"
        code={`const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);`}
      />

      <h2>useRef</h2>
      <CodeBlock
        language="typescript"
        code={`const inputRef = useRef<HTMLInputElement>(null);
// 使用: inputRef.current?.focus();`}
      />

      <h2>泛型组件</h2>
      <CodeBlock
        language="typescript"
        code={`interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>\${'{items.map(renderItem)}'}</ul>;
}`}
      />
    </>
  )
}
