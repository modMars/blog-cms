import { Route, Routes } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import Dashboard from './pages/dashboard/page';
import PostEditor from './pages/dashboard/post-editor/page';
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
			<Route
				path='/edit/:slug'
				element={
					<RequireAuth>
						<PostEditor />
					</RequireAuth>
				}
			/>
			<Route
				path='/new'
				element={
					<RequireAuth>
						<PostEditor />
					</RequireAuth>
				}
			/>
		</Routes>
	);
}

export default App;
