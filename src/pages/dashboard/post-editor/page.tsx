import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthProvider';
import { Editor } from '@tinymce/tinymce-react';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import slugify from 'slugify';

// TODO Edit page
export default function EditPage() {
	const { token } = useAuth();
	const editorRef = useRef(null);
	const [title, setTitle] = useState('');
	const [postContent, setPostContent] = useState('');
	const [editorReady, setEditorReady] = useState(false);
	const [contentSet, setContentSet] = useState(false);

	const params = useParams();

	useEffect(() => {
		const slugParam = params.slug || '';

		async function fetchPost() {
			try {
				const response = await fetch(`http://localhost:3000/api/posts/${slugParam}`, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					throw new Error('Failed to fetch post');
				}

				const [post] = await response.json();
				console.log('Fetched post:', post);
				console.log('Post content:', post.body);
				console.log('Post title:', post.title);
				setTitle(post.title);
				setPostContent(post.body);
			} catch (error) {
				console.error('Error fetching post:', error);
			}
		}

		fetchPost();
	}, [params.slug, token]);

	useEffect(() => {
		if (editorReady && postContent && editorRef.current && !contentSet) {
			editorRef.current.setContent(postContent);
			setContentSet(true); // prevent re-setting later
		}
	}, [editorReady, postContent, contentSet]);

	const updatePost = () => {
		if (editorRef.current) {
			console.log(editorRef.current.getContent());
			editorRef.current.uploadImages().then(res => {
				// const slug = slugify(title, { lower: true, strict: true });
				const slug = params.slug;
				fetch(`http://localhost:3000/api/posts/${slug}`, {
					method: 'PUT',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						title,
						body: editorRef.current.getContent(),
						slug,
					}),
				});
			});
		}
	};

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
					<SidebarTrigger className='-ml-1' />
					<Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4' />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbPage className='line-clamp-1'>Create New Post</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</header>
				<div className='flex flex-1 flex-col gap-4 p-4'>
					<Label htmlFor='title'>Title</Label>
					<Input
						className='text-2xl!important h-fit'
						type='text'
						value={title ?? ''}
						onChange={e => setTitle(e.target.value)}
					/>
					<Editor
						tinymceScriptSrc='/tinymce/tinymce.min.js'
						licenseKey='gpl'
						onInit={(_, editor) => {
							editorRef.current = editor;
							setEditorReady(true);
						}}
						init={{
							images_upload_handler: function (blobInfo, success, failure) {
								const formData = new FormData();
								formData.append('file', blobInfo.blob(), blobInfo.filename());

								fetch('http://localhost:3000/api/images', {
									method: 'POST',
									headers: {
										Authorization: `Bearer ${token}`,
									},
									body: formData,
								})
									.then(response => response.json())
									.then(result => {
										// Call success callback with the uploaded image URL
										success(result.location || result.url);
									})
									.catch(() => {
										failure('Image upload failed');
									});
							},
							selector: 'textarea#codesample',
							height: 800,
							menubar: false,
							toolbar_mode: 'sliding',
							toolbar:
								'undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright | bullist numlist outdent indent | link image media table code codesample | removeformat',
							plugins: [
								'autolink',
								'lists',
								'link',
								'image',
								'media',
								'charmap',
								'anchor',
								'searchreplace',
								'visualblocks',
								'code',
								'codesample',
								'fullscreen',
								'insertdatetime',
								'table',
								'emoticons',
								'wordcount',
								'quickbars',
							],
							images_upload_url: 'http://localhost:3000/api/images',
							quickbars_insert_toolbar: 'quickimage quicktable | hr codesample',
							content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
						}}
					/>
					<Button className='cursor-pointer' onClick={updatePost}>
						Update post
					</Button>

					<div className='bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min' />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
