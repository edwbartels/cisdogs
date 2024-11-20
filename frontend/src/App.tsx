import React from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import HomePage from './components/HomePage'
import Sidebar from './components/Sidebar'
import ListingsMain from './components/ListingsMain'
import Dashboard from './components/Dashboard'

const Layout = () => {
	return (
		<div className="min-h-screen font-sans bg-wax-cream text-wax-black">
			<NavBar />
			<Sidebar />
			<Outlet />
		</div>
	)
}

const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{ path: '/', element: <HomePage /> },
			{ path: '/listings', element: <ListingsMain /> },
			{ path: '/dashboard', element: <Dashboard /> },
		],
	},
])

const App = () => {
	return <RouterProvider router={router} />
}
export default App
