import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import useAuthStore from './stores/authStore'
import './App.css'
import NavBar from './components/Nav/NavBar'
import Browse from './components/Items/Browse'
import Sidebar from './components/Nav/Sidebar'
import ListingsMain from './components/Listings/ListingsMain'
import Dashboard from './components/Dashboard/Dashboard'
import Submissions from './components/Releases/Submissions'
import ItemDetails from './components/Items/ItemDetails'
import ListingDetails from './components/Listings/ListingDetails'
import ReleaseDetails from './components/Releases/ReleaseDetails'
import AlbumDetails from './components/Albums/AlbumDetails'
import ArtistDetails from './components/Artists/ArtistDetails'
import Watchlist from './components/Watchlist/Watchlist'
import { initializeSubscriptions } from './stores/subscriptions'
import Releases from './components/Releases/Releases'
import Albums from './components/Albums/Albums'
import Artists from './components/Artists/Artists'
import Profile from './components/Profile/Profile'

const Layout = () => {
	return (
		<div className="flex flex-col min-h-screen font-sans bg-wax-cream text-wax-black dark:bg-waxDark-gray dark:text-wax-cream">
			<div className="fixed top-0 left-0 h-16 w-full items-center bg-wax-black text-wax-silver flex  px-1 z-50">
				<NavBar />
			</div>

			<div className="flex h-full pt-16">
				<div className="fixed top-16 left-0 w-48 h-[calc(100vh-4rem)] bg-wax-silver shadow-md justify-between dark:bg-waxDark-silver">
					<Sidebar />
					<div
						className="fixed mb-2 bottom-0 cursor-pointer text-center w-48 font-semibold text-wax-gray hover:underline dark:text-waxDark-cream"
						onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
					>
						^ Back to Top ^
					</div>
				</div>

				<div className="flex-1 ml-48 overflow-y-auto p-8">
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
			{ path: '/releases', element: <Releases /> },
			{ path: '/albums', element: <Albums /> },
			{ path: '/artists', element: <Artists /> },
			{ path: '/profile/:userId', element: <Profile /> },
		],
	},
])

const App = () => {
	const scheduleTokenRefresh = useAuthStore(
		(state) => state.scheduleTokenRefresh
	)
	const { isDarkMode } = useAuthStore((state) => state)
	if (isDarkMode) {
		document.getElementById('root')?.classList.toggle('dark', isDarkMode)
	}
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
