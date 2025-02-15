import React from 'react';
import { StyleSheet, Text, View, TextInput as TextInputComp } from 'react-native';
import { StackNavigationOptions } from '@react-navigation/stack';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import StatusBar from '../containers/StatusBar';
import * as List from '../containers/List';
import I18n from '../i18n';
import log, { events, logEvent } from '../utils/log';
import { TSupportedThemes, withTheme } from '../theme';
import SafeAreaView from '../containers/SafeAreaView';
import TextInput from '../containers/TextInput';
import Button from '../containers/Button';
import { getUserSelector } from '../selectors/login';
import { PADDING_HORIZONTAL } from '../containers/List/constants';
import { themes } from '../lib/constants';
import { Encryption } from '../lib/encryption';
import RocketChat from '../lib/rocketchat';
import { logout as logoutAction } from '../actions/login';
import { showConfirmationAlert, showErrorAlert } from '../utils/info';
import EventEmitter from '../utils/events';
import { LISTENER } from '../containers/Toast';
import debounce from '../utils/debounce';
import sharedStyles from './Styles';
import { IUser } from '../definitions';

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: PADDING_HORIZONTAL
	},
	title: {
		fontSize: 16,
		...sharedStyles.textMedium
	},
	description: {
		fontSize: 14,
		paddingVertical: 10,
		...sharedStyles.textRegular
	},
	changePasswordButton: {
		marginBottom: 4
	}
});

interface IE2EEncryptionSecurityViewState {
	newPassword: string;
}

interface IE2EEncryptionSecurityViewProps {
	theme?: TSupportedThemes;
	user: IUser;
	server: string;
	encryptionEnabled: boolean;
	logout(): void;
}

class E2EEncryptionSecurityView extends React.Component<IE2EEncryptionSecurityViewProps, IE2EEncryptionSecurityViewState> {
	private newPasswordInputRef: any = React.createRef();

	static navigationOptions = (): StackNavigationOptions => ({
		title: I18n.t('E2E_Encryption')
	});

	state = { newPassword: '' };

	onChangePasswordText = debounce((text: string) => this.setState({ newPassword: text }), 300);

	setNewPasswordRef = (ref: TextInputComp) => (this.newPasswordInputRef = ref);

	changePassword = () => {
		const { newPassword } = this.state;
		if (!newPassword.trim()) {
			return;
		}
		showConfirmationAlert({
			title: I18n.t('Are_you_sure_question_mark'),
			message: I18n.t('E2E_encryption_change_password_message'),
			confirmationText: I18n.t('E2E_encryption_change_password_confirmation'),
			onPress: async () => {
				logEvent(events.E2E_SEC_CHANGE_PASSWORD);
				try {
					const { server } = this.props;
					await Encryption.changePassword(server, newPassword);
					EventEmitter.emit(LISTENER, { message: I18n.t('E2E_encryption_change_password_success') });
					this.newPasswordInputRef?.clear();
					this.newPasswordInputRef?.blur();
				} catch (e) {
					log(e);
					showErrorAlert(I18n.t('E2E_encryption_change_password_error'));
				}
			}
		});
	};

	resetOwnKey = () => {
		showConfirmationAlert({
			title: I18n.t('Are_you_sure_question_mark'),
			message: I18n.t('E2E_encryption_reset_message'),
			confirmationText: I18n.t('E2E_encryption_reset_confirmation'),
			onPress: async () => {
				logEvent(events.E2E_SEC_RESET_OWN_KEY);
				try {
					const res = await RocketChat.e2eResetOwnKey();
					/**
					 * It might return an empty object when TOTP is enabled,
					 * that's why we're using strict equality to boolean
					 */
					if (res === true) {
						const { logout } = this.props;
						logout();
					}
				} catch (e) {
					log(e);
					showErrorAlert(I18n.t('E2E_encryption_reset_error'));
				}
			}
		});
	};

	renderChangePassword = () => {
		const { newPassword } = this.state;
		const { theme, encryptionEnabled } = this.props;
		if (!encryptionEnabled) {
			return null;
		}
		return (
			<>
				<List.Section>
					<Text style={[styles.title, { color: themes[theme!].headerTitleColor }]}>
						{I18n.t('E2E_encryption_change_password_title')}
					</Text>
					<Text style={[styles.description, { color: themes[theme!].bodyText }]}>
						{I18n.t('E2E_encryption_change_password_description')}
					</Text>
					<TextInput
						inputRef={this.setNewPasswordRef}
						placeholder={I18n.t('New_Password')}
						returnKeyType='send'
						secureTextEntry
						onSubmitEditing={this.changePassword}
						testID='e2e-encryption-security-view-password'
						theme={theme}
						onChangeText={this.onChangePasswordText}
					/>
					<Button
						onPress={this.changePassword}
						title={I18n.t('Save_Changes')}
						theme={theme}
						disabled={!newPassword.trim()}
						style={styles.changePasswordButton}
						testID='e2e-encryption-security-view-change-password'
					/>
				</List.Section>

				<List.Separator />
			</>
		);
	};

	render() {
		const { theme } = this.props;
		return (
			<SafeAreaView testID='e2e-encryption-security-view' style={{ backgroundColor: themes[theme!].backgroundColor }}>
				<StatusBar />
				<List.Container>
					<View style={styles.container}>
						{this.renderChangePassword()}

						<List.Section>
							<Text style={[styles.title, { color: themes[theme!].headerTitleColor }]}>
								{I18n.t('E2E_encryption_reset_title')}
							</Text>
							<Text style={[styles.description, { color: themes[theme!].bodyText }]}>
								{I18n.t('E2E_encryption_reset_description')}
							</Text>
							<Button
								onPress={this.resetOwnKey}
								title={I18n.t('E2E_encryption_reset_button')}
								theme={theme}
								type='secondary'
								backgroundColor={themes[theme!].chatComponentBackground}
								testID='e2e-encryption-security-view-reset-key'
							/>
						</List.Section>
					</View>
				</List.Container>
			</SafeAreaView>
		);
	}
}

const mapStateToProps = (state: any) => ({
	server: state.server.server,
	user: getUserSelector(state),
	encryptionEnabled: state.encryption.enabled
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
	logout: () => dispatch(logoutAction(true))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(E2EEncryptionSecurityView));
