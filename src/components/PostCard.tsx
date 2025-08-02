import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import type { Post } from '@/types';
import { Eye, Pencil, Trash } from 'lucide-react';
import React from 'react';

interface PostCardProps {
	post: Post;
	onDelete: (id: number) => Promise<void>;
	toggleVisibility: (slug: string, is_published: boolean) => Promise<void>;
}

export function PostCard({ post, onDelete, toggleVisibility }: PostCardProps) {
	return (
		<Card key={post.id} className='relative'>
			<CardHeader>
				{post.is_published ? (
					<CardTitle className='text-xl font-bold'>{post.title}</CardTitle>
				) : (
					<CardTitle className='text-xl font-bold'>Draft: {post.title}</CardTitle>
				)}
				<CardDescription>Alejandro Salcido</CardDescription>
			</CardHeader>
			<CardContent>
				<p>{post.body}</p>
			</CardContent>
			<CardFooter>
				{post.comments?.length ? (
					<div className='mt-4'>
						<h3 className='text-lg font-semibold'>Comments:</h3>
						<ul>
							{post.comments.map(comment => (
								<li key={comment.id} className='text-gray-600'>
									<strong>{comment.author}:</strong>
									<br />
									{comment.body}
								</li>
							))}
						</ul>
					</div>
				) : null}
			</CardFooter>
			<div className='flex justify-left gap-4 px-6'>
				<Button
					asChild
					variant='default'
					className='cursor-pointer'
					onClick={() => toggleVisibility(post.slug, post.is_published)}
				>
					{post.is_published ? (
						<p>
							<Eye size={32} color='#ffffff' strokeWidth={1.75} />
							Hide
						</p>
					) : (
						<p>
							<Eye size={32} color='#ffffff' strokeWidth={1.75} />
							Publish
						</p>
					)}
				</Button>
				<Button asChild variant='default'>
					<a href={`/edit/${post.slug}`}>
						<Pencil />
						Edit Post
					</a>
				</Button>
				<Dialog>
					<DialogTrigger asChild>
						<Button variant='destructive' className='cursor-pointer'>
							<Trash /> Delete post
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Are you absolutely sure?</DialogTitle>
							<DialogDescription>
								This will permanently delete <strong>"{post.title}"</strong>.
							</DialogDescription>
						</DialogHeader>
						<div className='flex justify-end gap-2 mt-4'>
							<DialogClose asChild>
								<Button variant='outline' className='cursor-pointer'>
									Cancel
								</Button>
							</DialogClose>
							<DialogClose asChild>
								<Button variant='destructive' className='cursor-pointer' onClick={() => onDelete(post.id)}>
									Confirm Delete
								</Button>
							</DialogClose>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</Card>
	);
}
