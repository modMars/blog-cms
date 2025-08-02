import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthProvider';
import { Editor } from '@tinymce/tinymce-react';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import slugify from 'slugify';

// TODO Edit page
export default function PostEditor() {
	const { token } = useAuth();
	const editorRef = useRef(null);
	const [title, setTitle] = useState('');
	const [postContent, setPostContent] = useState('');
	const [editorReady, setEditorReady] = useState(false);
	const [contentSet, setContentSet] = useState(false);
	const [visibility, setVisibility] = useState(true);

	const params = useParams();
	const isEditMode = Boolean(params.slug);

	useEffect(() => {
		async function fetchPost() {
			try {
				if (!isEditMode) {
					console.log('Not in edit mode, skipping fetch');
					return;
				}
				const slugParam = params.slug || '';
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

	//If the editor is ready and the post content is set, initialize the editor with the post content, preventing overwriting it multiple times.
	useEffect(() => {
		if (editorReady && postContent && editorRef.current && !contentSet) {
			editorRef.current.setContent(postContent);
			setContentSet(true);
		}
	}, [editorReady, postContent, contentSet]);

	const updatePost = () => {
		if (editorRef.current) {
			console.log(editorRef.current.getContent());
			editorRef.current.uploadImages().then(res => {
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
						published_at: visibility ? new Date().toISOString() : null,
					}),
				});
			});
		}
	};

	const createPost = () => {
		if (editorRef.current) {
			editorRef.current.uploadImages().then(res => {
				const slug = slugify(title, { lower: true, strict: true });
				fetch(`http://localhost:3000/api/posts/`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						title,
						body: editorRef.current.getContent(),
						slug,
						is_published: visibility,
						published_at: visibility ? new Date().toISOString() : null,
						date_of_creation: new Date().toISOString(),
					}),
				});
			});
		}
	};

	const handleVisibilityChange = (value: string) => {
		if (value === 'draft') {
			console.log('Draft selected');
			setVisibility(false);
		} else if (value === 'publish') {
			console.log('Publish selected');
			setVisibility(true);
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
								{isEditMode ? (
									<BreadcrumbPage className='line-clamp-1'>Edit Post</BreadcrumbPage>
								) : (
									<BreadcrumbPage className='line-clamp-1'>Create Post</BreadcrumbPage>
								)}
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
							images_upload_handler: (blobInfo, progress) => {
								return new Promise((resolve, reject) => {
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
											// Make sure this is a valid image URL
											if (result?.location || result?.url) {
												resolve(result.location || result.url); // TinyMCE inserts this into the post body
											} else {
												reject({ message: 'Upload succeeded but no image URL returned', remove: true });
											}
										})
										.catch(err => {
											reject({ message: 'Image upload failed', remove: true });
										});
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
					<Label htmlFor='visibility'>Visibility</Label>
					<Select defaultValue='publish' onValueChange={value => handleVisibilityChange(value)}>
						<SelectTrigger className='w-[180px]'>
							<SelectValue placeholder='publish' id='visibility' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='publish'>Publish</SelectItem>
							<SelectItem value='draft'>Draft</SelectItem>
						</SelectContent>
					</Select>
					{isEditMode ? (
						<Button className='cursor-pointer' onClick={updatePost}>
							Update post
						</Button>
					) : (
						<Button className='cursor-pointer' onClick={createPost}>
							Create post
						</Button>
					)}

					<div className='bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min' />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
