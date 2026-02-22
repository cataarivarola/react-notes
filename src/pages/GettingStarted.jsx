import CodeBlock from '../components/CodeBlock'
import PopoverCard from '../components/PopoverCard'

export default function GettingStarted() {
  return (
    <>
      <h1>快速开始</h1>
      <p>
        使用{' '}
        <PopoverCard
          trigger={<button type="button" className="inline-link-button">Vite</button>}
          title="Vite"
        >
          <p style={{ margin: 0 }}>
            Vite 是新一代前端构建工具，基于原生 ESM，开发时秒级冷启动、热更新极快。官网：
            {' '}
            <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">vite.dev</a>
          </p>
        </PopoverCard>
        {' '}
        创建 React 项目是最快的方式之一。
      </p>
      <p>Vite 是一个构建工具，它可以帮助我们快速创建一个 React 项目。</p>

      <h2>创建项目</h2>
      <CodeBlock
        language="bash"
        code={`npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev`}
      />

      <h2>项目结构</h2>
      <CodeBlock
        language="text"
        code={`my-react-app/
├── public/          # 静态资源
├── src/
│   ├── App.jsx      # 根组件
│   ├── main.jsx     # 入口
│   └── index.css    # 全局样式
├── index.html
├── package.json
└── vite.config.js`}
      />

      <h2>第一个组件</h2>
      <p>在 <code>App.jsx</code> 中写一个简单组件：</p>
      <CodeBlock
        language="jsx"
        code={`function App() {
  return (
    <div>
      <h1>Hello, React!</h1>
    </div>
  );
}

export default App;`}
      />

      <h2>运行与构建</h2>
      <ul>
        <li><code>npm run dev</code>：启动开发服务器，支持热更新</li>
        <li><code>npm run build</code>：打包生产版本到 <code>dist/</code></li>
        <li><code>npm run preview</code>：预览打包后的站点</li>
      </ul>
    </>
  )
}
