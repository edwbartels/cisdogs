import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';
import './App.css';
import HomePage from './components/HomePage';

const Layout = () => {
	return (
		<div className="font-sans min-h-screen">
			<NavBar />
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
