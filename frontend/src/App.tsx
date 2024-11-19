import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import Sidebar from './components/Sidebar';

const Layout = () => {
	return (
		<div className="font-sans min-h-screen bg-wax-cream text-wax-black">
			<NavBar />
			<Sidebar />
			<Outlet />
		</div>
	);
};

const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [{ path: '/', element: <HomePage /> }],
	},
]);

const App = () => {
	return <RouterProvider router={router} />;
};
export default App;
