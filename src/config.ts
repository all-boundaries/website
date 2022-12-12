export const SITE = {
	title: 'all boundaries',
	description: 'Talking about boundaries in software, architecture, organisations, etc',
	defaultLanguage: 'en_UK',
};

export const OPEN_GRAPH = {
	image: {
		src: 'https://github.com/withastro/astro/blob/main/assets/social/banner-minimal.png?raw=true',
		alt:
			'astro logo on a starry expanse of space,' +
			' with a purple saturn-like planet floating in the right foreground',
	},
	twitter: '',
};

// This is the type of the frontmatter you put in the docs markdown files.
export type Frontmatter = {
	title: string;
	description: string;
	layout: string;
	image?: { src: string; alt: string };
	dir?: 'ltr' | 'rtl';
	ogLocale?: string;
	lang?: string;
};

export const KNOWN_LANGUAGES = {
	English: 'en',
} as const;
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const GITHUB_EDIT_URL = `https://github.com/all-boundaries/website`;

//export const COMMUNITY_INVITE_URL = `https://astro.build/chat`;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
	indexName: 'XXXXXXXXXX',
	appId: 'XXXXXXXXXX',
	apiKey: 'XXXXXXXXXX',
};

export type Sidebar = Record<
	typeof KNOWN_LANGUAGE_CODES[number],
	Record<string, { text: string; link: string }[]>
>;
export const SIDEBAR: Sidebar = {
	en: {
        '👋': [
            { text: 'Introduction', link: 'en/introduction' }
        ],
		'Service one': [
			{ text: 'Context', link: 'en/serviceone/context' },
			{ text: 'HTTP-based', link: 'en/serviceone/http' },
			{ text: 'Database', link: 'en/serviceone/database' },
			{ text: 'Streaming', link: 'en/serviceone/streaming' },
			{ text: 'Closed-box', link: 'en/serviceone/closedbox' },
		],
	},
};
