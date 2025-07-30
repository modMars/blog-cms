import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
	user: string | null;
	token: string | null;
	loading: boolean;
	login: (username: string, password: string) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<string | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const savedToken = localStorage.getItem('jwt');
		const savedUser = localStorage.getItem('user');

		if (savedToken && savedUser) {
			setToken(savedToken);
			setUser(savedUser);
		}
		setLoading(false);
	}, []);

	useEffect(() => {
		if (loading) return; // wait until loading is false
		if (!token) return; // don't check if no token

		const checkToken = async () => {
			try {
				const res = await fetch('/api/users', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (!res.ok) {
					console.log('Token is invalid or expired, logging out.');
					logout();
				} else {
					console.log('Token is valid, user is authenticated.');
				}
			} catch (error) {
				console.log('Token is invalid or expired, logging out.');
				logout();
			}
		};

		checkToken();
	}, [token, loading]);

	const login = async (username: string, password: string) => {
		setLoading(true);
		const res = await fetch('http://localhost:3000/api/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password }),
		});

		const data = await res.json();

		if (!res.ok) {
			setLoading(false);
			throw new Error(data.message || 'Login failed');
		}

		localStorage.setItem('jwt', data.token);
		localStorage.setItem('user', data.user);

		setToken(data.token);
		setUser(data.user);
		setLoading(false);
	};

	const logout = () => {
		localStorage.removeItem('jwt');
		localStorage.removeItem('user');
		setToken(null);
		setUser(null);
		navigate('/login');
	};

	return <AuthContext.Provider value={{ user, token, loading, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth must be used within an AuthProvider');
	return context;
};
