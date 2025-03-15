import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import './App.css'
import routes from './routes/routes'
import { Children } from 'react'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element}>
          {route.Children && route.Children.map((child, childIndex) => (
            <Route key={childIndex} path={child.path} element={child.element} />
          ))}
        </Route>
      ))}
    </Routes>
    </BrowserRouter>
  )
}

export default App
