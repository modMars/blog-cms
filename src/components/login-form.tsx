import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export function LoginForm({ className, ...props }: React.ComponentProps<'form'>) {
	const { login } = useAuth();
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const username = e.target.username.value;
		const password = e.target.password.value;
		console.log('Logging in with:', { username, password });
		try {
			await login(username, password);
			setError(null);
			navigate('/');
		} catch (err: any) {
			console.error('Login failed:', err);
			setError(err.message || 'Login failed. Please check your credentials.');
		}
	}

	return (
		<form className={cn('flex flex-col gap-6', className)} onSubmit={handleSubmit} {...props}>
			<div className='flex flex-col items-center gap-2 text-center'>
				<h1 className='text-2xl font-bold'>Login to your account</h1>
				<p className='text-muted-foreground text-sm text-balance'>Enter your username to access your account.</p>
			</div>

			{error && (
				<Alert variant='destructive'>
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<div className='grid gap-6'>
				<div className='grid gap-3'>
					<Label htmlFor='username'>Username</Label>
					<Input id='username' type='username' required />
				</div>
				<div className='grid gap-3'>
					<div className='flex items-center'>
						<Label htmlFor='password'>Password</Label>
					</div>
					<Input id='password' type='password' required />
				</div>
				<Button type='submit' className='w-full cursor-pointer'>
					Login
				</Button>
				<div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'></div>
			</div>
		</form>
	);
}
