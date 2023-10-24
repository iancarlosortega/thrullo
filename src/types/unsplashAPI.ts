export interface UnsplashAPI {
	total: number;
	total_pages: number;
	results: Photo[];
}

export interface Photo {
	id: string;
	slug: string;
	created_at: string;
	updated_at: string;
	promoted_at: null | string;
	width: number;
	height: number;
	color: string;
	blur_hash: string;
	description: null | string;
	alt_description: string;
	breadcrumbs: any[];
	urls: Urls;
	links: ResultLinks;
	likes: number;
	liked_by_user: boolean;
	current_user_collections: any[];
	sponsorship: null;
	topic_submissions: ResultTopicSubmissions;
	user: User;
	tags: Tag[];
}

export interface ResultLinks {
	self: string;
	html: string;
	download: string;
	download_location: string;
}

export interface Tag {
	type: Type;
	title: string;
	source?: Source;
}

export interface Source {
	ancestry: Ancestry;
	title: string;
	subtitle: string;
	description: string;
	meta_title: string;
	meta_description: string;
	cover_photo: CoverPhoto;
}

export interface Ancestry {
	type: Category;
	category: Category;
	subcategory?: Category;
}

export interface Category {
	slug: string;
	pretty_slug: string;
}

export interface CoverPhoto {
	id: string;
	slug: string;
	created_at: string;
	updated_at: string;
	promoted_at: null | string;
	width: number;
	height: number;
	color: string;
	blur_hash: string;
	description: null | string;
	alt_description: string;
	breadcrumbs: Breadcrumb[];
	urls: Urls;
	links: ResultLinks;
	likes: number;
	liked_by_user: boolean;
	current_user_collections: any[];
	sponsorship: null;
	topic_submissions: CoverPhotoTopicSubmissions;
	premium: boolean;
	plus: boolean;
	user: User;
}

export interface Breadcrumb {
	slug: string;
	title: string;
	index: number;
	type: Type;
}

export enum Type {
	LandingPage = 'landing_page',
	Search = 'search',
}

export interface CoverPhotoTopicSubmissions {
	wallpapers?: Monochrome;
	'textures-patterns'?: BusinessWork;
	monochrome?: Monochrome;
	'current-events'?: BusinessWork;
}

export interface BusinessWork {
	status: Status;
	approved_on?: string;
}

export enum Status {
	Approved = 'approved',
	Rejected = 'rejected',
}

export interface Monochrome {
	status: Status;
}

export interface Urls {
	raw: string;
	full: string;
	regular: string;
	small: string;
	thumb: string;
	small_s3: string;
}

export interface User {
	id: string;
	updated_at: string;
	username: string;
	name: string;
	first_name: string;
	last_name: null | string;
	twitter_username: null | string;
	portfolio_url: null | string;
	bio: null | string;
	location: null | string;
	links: UserLinks;
	profile_image: ProfileImage;
	instagram_username: null | string;
	total_collections: number;
	total_likes: number;
	total_photos: number;
	accepted_tos: boolean;
	for_hire: boolean;
	social: Social;
}

export interface UserLinks {
	self: string;
	html: string;
	photos: string;
	likes: string;
	portfolio: string;
	following: string;
	followers: string;
}

export interface ProfileImage {
	small: string;
	medium: string;
	large: string;
}

export interface Social {
	instagram_username: null | string;
	portfolio_url: null | string;
	twitter_username: null | string;
	paypal_email: null;
}

export interface ResultTopicSubmissions {
	'business-work'?: BusinessWork;
	'work-from-home'?: BusinessWork;
	interiors?: BusinessWork;
	entrepreneur?: BusinessWork;
}
