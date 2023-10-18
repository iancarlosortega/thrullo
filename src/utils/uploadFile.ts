import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function uploadFile(
	file: File,
	bucket: string,
	name: string,
	config?: AxiosRequestConfig
) {
	const supabase = createClientComponentClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();

	// Create form data
	const blob = new Blob([file]);
	const formData = new FormData();
	formData.append('cacheControl', '3600');
	formData.append('', blob);

	return axios.post(
		`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${bucket}/${name}`,
		formData,
		{
			headers: {
				'Content-Type': 'multipart/form-data',
				authorization: `Bearer ${session?.access_token}`,
				'x-upsert': 'true', // optionally set upsert to true to overwrite existing files
			},
			onUploadProgress: config?.onUploadProgress,
			onDownloadProgress: config?.onDownloadProgress,
		}
	);
}
