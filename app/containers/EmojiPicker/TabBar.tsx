import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import styles from './styles';
import { themes } from '../../lib/constants';
import { TSupportedThemes } from '../../theme';

interface ITabBarProps {
	goToPage: Function;
	activeTab: number;
	tabs: [];
	tabEmojiStyle: object;
	theme: TSupportedThemes;
}

export default class TabBar extends React.Component<Partial<ITabBarProps>> {
	shouldComponentUpdate(nextProps: any) {
		const { activeTab, theme } = this.props;
		if (nextProps.activeTab !== activeTab) {
			return true;
		}
		if (nextProps.theme !== theme) {
			return true;
		}
		return false;
	}

	render() {
		const { tabs, goToPage, tabEmojiStyle, activeTab, theme } = this.props;

		return (
			<View style={styles.tabsContainer}>
				{tabs!.map((tab, i) => (
					<TouchableOpacity
						activeOpacity={0.7}
						key={tab}
						onPress={() => goToPage!(i)}
						style={styles.tab}
						testID={`reaction-picker-${tab}`}>
						<Text style={[styles.tabEmoji, tabEmojiStyle]}>{tab}</Text>
						{activeTab === i ? (
							<View style={[styles.activeTabLine, { backgroundColor: themes[theme!].tintColor }]} />
						) : (
							<View style={styles.tabLine} />
						)}
					</TouchableOpacity>
				))}
			</View>
		);
	}
}
