export interface Comment {
	id: number;
	blogpost_id: number;
	parent_comment_id?: number;
	author: string;
	body: string;
	is_visible: boolean;
	date_of_creation: string;
}

export interface Post {
	id: number;
	title: string;
	body: string;
	slug: string;
	is_published: boolean;
	comments?: Comment[];
	published_at?: string;
	date_of_creation?: string;
}
