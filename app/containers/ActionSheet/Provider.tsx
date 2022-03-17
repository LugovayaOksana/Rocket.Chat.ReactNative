import React, { ForwardedRef, forwardRef, useContext, useRef } from 'react';

import ActionSheet, { TActionSheetItem } from './ActionSheet';
import { useTheme } from '../../theme';

interface IActionSheetProvider {
	showActionSheet: ({
		options,
		headerHeight,
		customHeader
	}: {
		options: TActionSheetItem[];
		headerHeight: number;
		customHeader: React.ReactElement | null;
	}) => void;
	hideActionSheet: () => void;
}

const context = React.createContext<IActionSheetProvider>({
	showActionSheet: () => {},
	hideActionSheet: () => {}
});

export const useActionSheet = () => useContext(context);

const { Provider, Consumer } = context;

export const withActionSheet = (Component: any): any =>
	forwardRef((props: any, ref: ForwardedRef<any>) => (
		<Consumer>{(contexts: any) => <Component {...props} {...contexts} ref={ref} />}</Consumer>
	));

export const ActionSheetProvider = React.memo(({ children }: { children: JSX.Element | JSX.Element[] }) => {
	const ref: ForwardedRef<any> = useRef();
	const { theme }: any = useTheme();

	const getContext = () => ({
		showActionSheet: (options: any) => {
			ref.current?.showActionSheet(options);
		},
		hideActionSheet: () => {
			ref.current?.hideActionSheet();
		}
	});

	return (
		<Provider value={getContext()}>
			<ActionSheet ref={ref} theme={theme}>
				<>{children}</>
			</ActionSheet>
		</Provider>
	);
});
