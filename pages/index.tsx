import React, { useState, useMemo, useRef } from 'react';
import { Grid} from '@arco-design/web-react';
import { IconDownload } from '@arco-design/web-react/icon';
import FormConfigure from '../components/form';
import ImageGallery from '../components/image-gallery';
import DownLoadButton from '../components/download-btn';
import { PROMPT_FIELD } from '../utils/const';

import useRequest from '../services/useRequest';
import { apiGenerate, apiCreatePrompt } from '../services/api';

import styles from '../styles/index.module.scss';

const Row = Grid.Row;
const Col = Grid.Col;

interface FormConfigure {
	getFormInstance: () => any;
}

export default function Home() {
	const [imgUrl, setImgUrl] = useState('');
	const [imgSize, setImgSize] = useState('512x512');
	const formRef = useRef<FormConfigure | null>(null);

	// 优化Prompt
	const {
		run: runCreatePrompt
	} = useRequest(apiCreatePrompt, {
		manual: true,
		onSuccess(data) {
			const formIns = formRef.current?.getFormInstance();
			formIns.setFieldValue(PROMPT_FIELD, data.result);
		}
	});

	// 生成图片
	const {
		loading: submitLoading,
		run: runGenerate
	} = useRequest(apiGenerate, {
		manual: true,
		onSuccess(data) {
			setImgUrl(data.result);
		}
	});

	const handleCreatePrompt = (value: any) => {
		runCreatePrompt({ input: value });
	}

	const handleSubmit = (values: any) => {
		runGenerate(values)
	}

	const handleImageSize = (value: any) => {
		setImgSize(value);
	}

	return (
		<div className={styles.pageWrapper}>
			<div className={styles.pageContent}>
				<div className={styles.configureWrapper}>
					<FormConfigure
						ref={formRef}
						loading={submitLoading}
						onSubmit={handleSubmit}
						onCreatePrompt={handleCreatePrompt}
						onImageSizeChange={handleImageSize}
					/>
					<Row>
						<Col offset={5}>
							<DownLoadButton
								type="primary"
								className={styles.downloadBtn}
								disabled={submitLoading || !imgUrl}
								icon={<IconDownload />}
								imgUrl={imgUrl}
							/>
						</Col>
					</Row>
				</div>
				<div className={styles.imageWrapper}>
					<ImageGallery
						loading={submitLoading}
						imgSize={imgSize}
						imgUrl={imgUrl}
					/>
				</div>
			</div>
		</div>
	)
}