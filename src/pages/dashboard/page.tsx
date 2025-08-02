import { AppSidebar } from '@/components/app-sidebar';
import { PostCard } from '@/components/PostCard';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthProvider';
import type { Comment, Post } from '@/types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function Page() {
	const { token } = useAuth();
	const [posts, setPosts] = useState<Post[]>([]);
	const [page, setPage] = useState('dashboard');
	const hash = useLocation().hash;

	// Fetch posts when the component mounts
	useEffect(() => {
		async function fetchPosts(): Promise<Post[]> {
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
	}, [token]);

	useEffect(() => {
		const pageFromHash = hash.replace('#', '') || 'dashboard';
		console.log(pageFromHash);
		setPage(pageFromHash);
	}, [hash]);

	// Deletes posts based on id
	async function handleDelete(id: number): Promise<void> {
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

	async function toggleVisibility(slug: string, is_published: boolean): Promise<void> {
		// Toggle the publish status of a post
		is_published = !is_published;
		try {
			fetch(`http://localhost:3000/api/posts/${slug}/publish`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					slug,
					is_published,
				}),
			});
			setPosts(prevPosts => {
				return prevPosts.map(post => {
					const isTargetPost = post.slug === slug;
					if (isTargetPost) {
						return {
							...post,
							is_published: is_published,
						};
					}
					return post;
				});
			});
		} catch (error) {
			console.error('Error toggling post visibility:', error);
		}
	}

	function renderPageContent(page: string) {
		switch (page) {
			case 'all-posts':
				return renderPosts(posts, handleDelete, toggleVisibility);

			case 'drafts':
				return renderPosts(
					posts.filter(post => post.is_published === false),
					handleDelete,
					toggleVisibility
				);

			case 'published':
				return renderPosts(
					posts.filter(post => post.is_published === true),
					handleDelete,
					toggleVisibility
				);

			case 'comments':
				return <div>Comments page coming soon</div>;

			case 'dashboard':
			default:
				return <div>Welcome to your dashboard</div>;
		}
	}

	function renderPosts(
		posts: Post[],
		handleDelete: (id: number) => Promise<void>,
		toggleVisibility: (slug: string, is_published: boolean) => Promise<void>
	) {
		return posts.map(post => (
			<PostCard key={post.id} post={post} onDelete={handleDelete} toggleVisibility={toggleVisibility} />
		));
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
					{renderPageContent(page)}

					<div className='bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min' />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
