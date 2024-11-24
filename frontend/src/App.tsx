import React, { useEffect } from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import useAuthStore from './stores/authStore'
import './App.css'
import NavBar from './components/NavBar'
import Browse from './components/Browse'
import Sidebar from './components/Sidebar'
import ListingsMain from './components/ListingsMain'
import Dashboard from './components/Dashboard'
import Submissions from './components/Submissions'
import ItemDetails from './components/ItemDetails'
import ListingDetails from './components/ListingDetails'
import ReleaseDetails from './components/ReleaseDetails'
import AlbumDetails from './components/AlbumDetails'
import ArtistDetails from './components/ArtistDetails'
import Watchlist from './components/Watchlist'
import { initializeSubscriptions } from './stores/subscriptions'

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
			{ path: '/browse', element: <Browse /> },
			{ path: '/dashboard', element: <Dashboard /> },
			{ path: '/submissions', element: <Submissions /> },
			{ path: '/item/:id', element: <ItemDetails /> },
			{ path: '/listing/:id', element: <ListingDetails /> },
			{ path: '/release/:id', element: <ReleaseDetails /> },
			{ path: '/album/:id', element: <AlbumDetails /> },
			{ path: '/artist/:id', element: <ArtistDetails /> },
			{ path: '/watchlist', element: <Watchlist /> },
		],
	},
])

const App = () => {
	const scheduleTokenRefresh = useAuthStore(
		(state) => state.scheduleTokenRefresh
	)
	useEffect(() => {
		const cleanup = initializeSubscriptions()
		return () => {
			cleanup()
		}
	}, [])

	useEffect(() => {
		scheduleTokenRefresh() // Start token refresh process on app load
	}, [scheduleTokenRefresh])

	return <RouterProvider router={router} />
}
export default App
