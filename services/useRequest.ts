import { useState, useCallback, useEffect } from 'react';
import { Message } from '@arco-design/web-react';

interface UseRequestReturnType<P, T> {
	/** 返回的数据 */
	data: T | any;
	/** loading状态 */
	loading: boolean;
	/** 触发请求执行 */
	run: (params: P | any) => void;
}

interface Options<P, T> {
	/** 手动执行run方法请求数据 */
	manual?: boolean;
	/** 默认参数 */
	defaultParams?: P,
	/** 请求成功的回调 */
	onSuccess?: (data: T, params: P) => void;
	/** 请求失败的回调 */
	onError?: (e: Error, params: P) => void;
}

export default function useRequest<P = any, T = any>(
	request: (params: P | any) => Promise<any>,
	options?: Options<P, T>
): UseRequestReturnType<P, T> {
	const [data, setData] = useState(null);

	const [loading, setLoading] = useState(false);

	const run = useCallback(
		async (params: P | any) => {
			setLoading(true);

			try {
				const response = await request(params);

				const result = await response.json();

				if (response.status !== 200) {
					throw response.error || new Error(`Request failed with status ${response.status}: ${result.error?.message}`);
				}

				setData(result);
				setLoading(false);

				options?.onSuccess && options.onSuccess(result, params);
			} catch (error: any) {
				console.log(error);
				Message.error(error?.message);
				options?.onError && options.onError(error?.message, params)
			}

			setLoading(false);
		},
		[request, options]
	)

	useEffect(() => {
		if (!options || !options?.manual) {
			run(options?.defaultParams);
		}
	}, [options?.defaultParams, options?.manual]);

	return {
		data,
		loading,
		run
	}
}