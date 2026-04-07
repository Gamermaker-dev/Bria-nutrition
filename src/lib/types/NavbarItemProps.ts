import type { ResolvedPathname } from '$app/types';

export type NavbarItemProps = {
	text: string;
	href?: ResolvedPathname;
    action?: string;
    subItems?: NavbarItemProps[];
};
