import { AppSidebar } from '@/components/app-sidebar';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthProvider';
import { useEffect, useState } from 'react';

export default function Page() {
	const { token } = useAuth();
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		async function fetchPosts() {
			const response = await fetch('http://localhost:3000/api/posts', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (!response.ok) {
				throw new Error('Failed to fetch posts');
			}
			return response.json();
		}

		fetchPosts()
			.then(posts => {
				setPosts(posts);
				console.log(posts);
			})
			.catch(error => {
				console.error('Error fetching posts:', error);
			});
	}, []);

	async function handleDelete(id: number) {
		console.log('post id to delete is: ', id);
		const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (!response.ok) {
			throw new Error('Failed to fetch posts');
		}
		setPosts(prev => prev.filter(post => post.id !== id));
		return response.json();
	}

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
					<SidebarTrigger className='-ml-1' />
					<Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4' />
				</header>
				<div className='flex flex-1 flex-col gap-4 p-4'>
					{/* <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
						<div className='bg-muted/50 aspect-video rounded-xl' />
						<div className='bg-muted/50 aspect-video rounded-xl' />
						<div className='bg-muted/50 aspect-video rounded-xl' />
					</div> */}
					{posts.map(post => {
						return (
							<>
								<Card key={post.id}>
									<CardHeader>
										<CardTitle className='text-xl font-bold'>{post.title}</CardTitle>
										<CardDescription>Alejandro Salcido</CardDescription>
										{/* <CardAction>Card Action</CardAction> */}
									</CardHeader>
									<CardContent>
										<p>{post.body}</p>
									</CardContent>
									<CardFooter>
										{post.comments && post.comments.length > 0 && (
											<div className='mt-4'>
												<h3 className='text-lg font-semibold'>Comments:</h3>
												<ul>
													{post.comments.map(comment => (
														<li key={comment.id} className='text-gray-600'>
															<strong>{comment.author}:</strong>
															<br></br>
															{comment.body}
														</li>
													))}
												</ul>
											</div>
										)}
									</CardFooter>
									<div className='flex justify-left gap-4 px-6'>
										<Button className='cursor-pointer' variant={'default'}>
											Edit post
										</Button>
										<Dialog>
											<DialogTrigger>
												<Button className='cursor-pointer' variant='destructive'>
													Delete post
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Are you absolutely sure?</DialogTitle>
													<DialogDescription>
														This action cannot be undone. This will permanently delete the blogpost{' '}
														<strong>"{post.title}"</strong> and remove the data from our servers.
													</DialogDescription>
												</DialogHeader>

												<div className='flex justify-end gap-2 mt-4'>
													<DialogClose asChild>
														<Button className='cursor-pointer' variant='outline'>
															Cancel
														</Button>
													</DialogClose>
													<DialogClose asChild>
														<Button
															className='cursor-pointer'
															variant='destructive'
															onClick={() => handleDelete(post.id)}
														>
															Confirm Delete
														</Button>
													</DialogClose>
												</div>
											</DialogContent>
										</Dialog>
									</div>
								</Card>
							</>
						);
					})}
					<div className='bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min' />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
