import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import GettingStarted from './pages/GettingStarted'
import Jsx from './pages/Jsx'
import Components from './pages/Components'
import Props from './pages/Props'
import State from './pages/State'
import Lifecycle from './pages/Lifecycle'
import Events from './pages/Events'
import Conditional from './pages/Conditional'
import Lists from './pages/Lists'
import Hooks from './pages/Hooks'
import UseState from './pages/UseState'
import UseReducer from './pages/UseReducer'
import UseEffect from './pages/UseEffect'
import CustomHooks from './pages/CustomHooks'
import UseContext from './pages/UseContext'
import Performance from './pages/Performance'
import TypeScript from './pages/TypeScript'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="getting-started" element={<GettingStarted />} />
        <Route path="concepts/jsx" element={<Jsx />} />
        <Route path="concepts/components" element={<Components />} />
        <Route path="concepts/props" element={<Props />} />
        <Route path="concepts/state" element={<State />} />
        <Route path="concepts/lifecycle" element={<Lifecycle />} />
        <Route path="concepts/events" element={<Events />} />
        <Route path="concepts/conditional" element={<Conditional />} />
        <Route path="concepts/lists" element={<Lists />} />
        <Route path="advanced/hooks" element={<Hooks />} />
        <Route path="advanced/useState" element={<UseState />} />
        <Route path="advanced/useReducer" element={<UseReducer />} />
        <Route path="advanced/useEffect" element={<UseEffect />} />
        <Route path="advanced/context" element={<UseContext />} />
        <Route path="advanced/custom-hooks" element={<CustomHooks />} />
        <Route path="practice/performance" element={<Performance />} />
        <Route path="practice/typescript" element={<TypeScript />} />
      </Route>
    </Routes>
  )
}
