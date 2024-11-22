import React from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import HomePage from './components/Browse'
import Sidebar from './components/Sidebar'
import ListingsMain from './components/ListingsMain'
import Dashboard from './components/Dashboard'
import Submissions from './components/Submissions'
import ItemDetails from './components/ItemDetails'
import ListingDetails from './components/ListingDetails'

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
			{ path: '/browse', element: <HomePage /> },
			{ path: '/dashboard', element: <Dashboard /> },
			{ path: '/submissions', element: <Submissions /> },
			{ path: '/item/:id', element: <ItemDetails /> },
			{ path: '/listing/:id', element: <ListingDetails /> },
		],
	},
])

const App = () => {
	return <RouterProvider router={router} />
}
export default App
