export default function Dashboard() {
	return (
		<div className='grid min-h-svh lg:grid-cols-2'>
			<div className='flex flex-col items-center justify-center bg-gray-100 p-4'>
				<h1 className='text-2xl font-bold'>Dashboard</h1>
				<p className='mt-2 text-gray-600'>Welcome to your dashboard!</p>
			</div>
			<div className='flex items-center justify-center bg-white p-4'>
				<p className='text-lg'>Content goes here...</p>
			</div>
		</div>
	);
}
