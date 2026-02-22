// 类似 GitBook 的导航配置
export const navConfig = [
  {
    title: '入门',
    path: '/',
    children: [
      { title: '简介', path: '/' },
      { title: '快速开始', path: '/getting-started' },
    ],
  },
  {
    title: '核心概念',
    path: '/concepts',
    children: [
      { title: 'JSX 简介', path: '/concepts/jsx' },
      { title: '组件', path: '/concepts/components' },
      { title: 'Props', path: '/concepts/props' },
      { title: 'State', path: '/concepts/state' },
      { title: '生命周期', path: '/concepts/lifecycle' },
      { title: '事件处理', path: '/concepts/events' },
      { title: '条件渲染', path: '/concepts/conditional' },
      { title: '列表与 Key', path: '/concepts/lists' },
    ],
  },
  {
    title: '进阶',
    path: '/advanced',
    children: [
      { title: 'Hooks 入门', path: '/advanced/hooks' },
      { title: 'useState', path: '/advanced/useState' },
      { title: 'useEffect', path: '/advanced/useEffect' },
      { title: 'useReducer', path: '/advanced/useReducer' },
      { title: 'useContext', path: '/advanced/context' },
      { title: '自定义 Hooks', path: '/advanced/custom-hooks' },
    ],
  },
  {
    title: '实践',
    path: '/practice',
    children: [
      { title: '性能优化', path: '/practice/performance' },
      { title: '与 TypeScript 结合', path: '/practice/typescript' },
    ],
  },
]
