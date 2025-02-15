import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';

import { TSupportedThemes } from '../theme';
import { ProfileStackParamList } from '../stacks/types';
import { IUser } from './IUser';

export interface IParams {
	name: string;
	username: string;
	email: string | null;
	newPassword: string;
	currentPassword: string;
}

export interface IAvatarButton {
	key: string;
	child: React.ReactNode;
	onPress: () => void;
	disabled: boolean;
}

export interface INavigationOptions {
	navigation: StackNavigationProp<ProfileStackParamList, 'ProfileView'>;
	isMasterDetail?: boolean;
}

export interface IProfileViewProps {
	user: IUser;
	baseUrl: string;
	Accounts_AllowEmailChange: boolean;
	Accounts_AllowPasswordChange: boolean;
	Accounts_AllowRealNameChange: boolean;
	Accounts_AllowUserAvatarChange: boolean;
	Accounts_AllowUsernameChange: boolean;
	Accounts_CustomFields: string;
	setUser: Function;
	theme: TSupportedThemes;
}

export interface IAvatar {
	data: {} | string | null;
	url?: string;
	contentType?: string;
	service?: any;
}

export interface IAvatarSuggestion {
	[service: string]: {
		url: string;
		blob: string;
		contentType: string;
	};
}

export interface IProfileViewState {
	saving: boolean;
	name: string;
	username: string;
	email: string | null;
	newPassword: string | null;
	currentPassword: string | null;
	avatarUrl: string | null;
	avatar: IAvatar;
	avatarSuggestions: IAvatarSuggestion;
	customFields: {
		[key: string | number]: string;
	};
}
