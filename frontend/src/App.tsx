import React from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import HomePage from './components/HomePage'
import Sidebar from './components/Sidebar'
import ListingsMain from './components/ListingsMain'
import Dashboard from './components/Dashboard'
import Submissions from './components/Submissions'

const Layout = () => {
	return (
		<div className="flex flex-col min-h-screen font-sans bg-wax-cream text-wax-black">
			<NavBar />
			<div className="flex flex-grow min-h-screen">
				<Sidebar />
				<div className="items-center justify-center w-full px-8 py-4 bg-wax-cream">
					<Outlet />
				</div>
			</div>
		</div>
	)
}

const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{ path: '/', element: <ListingsMain /> },
			{ path: '/listings', element: <HomePage /> },
			{ path: '/dashboard', element: <Dashboard /> },
			{ path: '/submissions', element: <Submissions /> },
		],
	},
])

const App = () => {
	return <RouterProvider router={router} />
}
export default App
