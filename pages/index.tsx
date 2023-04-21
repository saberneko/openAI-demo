import React, { useState, useMemo } from 'react';
import { Image, Spin, Grid } from '@arco-design/web-react';
import { IconDownload } from '@arco-design/web-react/icon';
import FormConfigure from '../components/form';
import ImageGallery from '../components/image-gallery';
import DownLoadButton from '../components/download-btn';

import useRequest from '../services/useRequest';
import { apiGenerate } from '../services/api';

import styles from '../styles/index.module.scss';

const Row = Grid.Row;
const Col = Grid.Col;

export default function Home() {
	const [imgUrl, setImgUrl] = useState('');
	const [imgSize, setImgSize] = useState('512x512');

	const {
		loading: submitLoading,
		run: runGenerate
	} = useRequest(apiGenerate, {
		manual: true,
		onSuccess(data) {
			setImgUrl(data.result);
		}
	});

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
						loading={submitLoading}
						onImageSizeChange={handleImageSize}
						onSubmit={handleSubmit}
					/>
					<Row>
						<Col offset={5}>
							<DownLoadButton
								type="primary"
								style={{
									visibility: submitLoading ? 'visible' : 'hidden'
								}}
								className={styles.downloadBtn}
								disabled={submitLoading}
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