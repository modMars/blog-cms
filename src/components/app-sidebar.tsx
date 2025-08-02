import {
	AudioWaveform,
	Blocks,
	Code,
	Command,
	FileClock,
	Folder,
	Home,
	Megaphone,
	MessageCircleQuestion,
	Paintbrush2,
	Rocket,
	Settings,
	Settings2,
	Sliders,
	Sparkles,
	Trash2,
	User,
} from 'lucide-react';
import * as React from 'react';

import { NavFavorites } from '@/components/nav-favorites';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavWorkspaces } from '@/components/nav-workspaces';
import { TeamSwitcher } from '@/components/team-switcher';
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';

// This is sample data.
const data = {
	teams: [
		{
			name: 'Alejandro Salcido',
			logo: Command,
			plan: 'Enterprise',
		},
	],
	navMain: [
		{
			title: 'Home',
			url: '/',
			icon: Home,
			isActive: true,
		},
		{
			title: 'Create Post',
			url: '/new',
			icon: Blocks,
			isActive: true,
		},
	],
	navSecondary: [
		{
			title: 'Media Library',
			url: '#',
			icon: AudioWaveform,
		},
		{
			title: 'Categories',
			url: '#',
			icon: Sparkles,
		},
		{
			title: 'Settings',
			url: '#',
			icon: Settings2,
		},
		{
			title: 'Trash',
			url: '#',
			icon: Trash2,
		},
		{
			title: 'Help',
			url: '#',
			icon: MessageCircleQuestion,
		},
	],
	favorites: [
		{
			name: 'Dashboard',
			url: '/#',
			emoji: Home,
		},
		{
			name: 'Posts',
			url: '/#all-posts',
			emoji: Blocks,
		},
		{
			name: 'Drafts',
			url: '/#drafts',
			emoji: FileClock,
		},
		{
			name: 'Published',
			url: '/#published',
			emoji: Rocket,
		},
		{
			name: 'Comments',
			url: '/#comments',
			emoji: MessageCircleQuestion,
		},
	],
	workspaces: [
		{
			name: 'Settings',
			emoji: Settings,
			pages: [
				{ name: 'Profile', icon: User },
				{ name: 'General', icon: Sliders },
				{ name: 'Trash', icon: Trash2 },
			],
		},
		{
			name: 'Categories',
			emoji: Folder,
			pages: [
				{ name: 'Design', icon: Paintbrush2 },
				{ name: 'Development', icon: Code },
				{ name: 'Marketing', icon: Megaphone },
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar className='border-r-0' {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
				<NavMain items={data.navMain} />
			</SidebarHeader>
			<SidebarContent>
				<NavFavorites favorites={data.favorites} />
				<NavWorkspaces workspaces={data.workspaces} />
				<NavSecondary items={data.navSecondary} className='mt-auto' />
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
