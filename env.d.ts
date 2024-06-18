declare namespace NodeJS {
	export interface ProcessEnv extends Dict<string> {
	  NUXT_PUBLIC_API_URL: string | undefined;
	  NUXT_PUBLIC_BOOK_COVERS_URL: string | undefined;
	  NUXT_PUBLIC_MIDTRANS_SNAP_URL: string | undefined;
	  NUXT_PUBLIC_MIDTRANS_CLIENT_KEY: string | undefined;
	}
}
