import { Route, Routes } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import Dashboard from './pages/dashboard/page';
import Login from './pages/login/page';

function App() {
	return (
		<Routes>
			<Route path='/login' element={<Login />} />
			<Route
				path='/'
				element={
					<RequireAuth>
						<Dashboard />
					</RequireAuth>
				}
			/>
		</Routes>
	);
}

export default App;
