import { memo, ReactNode, SyntheticEvent, PropsWithChildren } from "react";

interface NavigationOption {
	href: string;
	title: string | ReactNode;
	active: boolean;
	id: string;
	onClick: (e: SyntheticEvent<HTMLAnchorElement>) => void;
}
export interface NavigationProps {
	navigations: NavigationOption[];
	icons?: boolean;
	kind?: string;
	variant?: string;
}
export interface TabNavProps
	extends PropsWithChildren<{
		active: boolean;
		href?: string;
		onClick?: (e: SyntheticEvent<HTMLAnchorElement>) => void;
	}> {}

export const Navigation = memo(({ navigations }: NavigationProps) => {
	return (
		<div className="wrapper-navigation">
			<nav className="navi-wrapper">
				{navigations.map((item) => (
					<TabNav
						href={item.href}
						active={item.active}
						key={item.id}
						onClick={item.onClick}
					>
						{item.title}
					</TabNav>
				))}
			</nav>
		</div>
	);
});

const TabNav = memo(({ href, onClick, active, children }: TabNavProps) => {
	return (
		<>
			<a
				href={href}
				onClick={onClick}
				className={`nav-item ${active ? "w-800 " : "w-400 purple"}`}
			>
				{active && <span className="nav-background"></span>}
				<span tabIndex={-1}>{children}</span>
			</a>
		</>
	);
});
