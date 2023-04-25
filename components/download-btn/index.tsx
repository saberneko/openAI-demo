import React, { useCallback } from 'react';
import { Button, ButtonProps, Message } from '@arco-design/web-react';
import { downloadImage } from './imageLoad';
import { isBase64Image } from './utils';

interface IDownloadButtonProps extends ButtonProps {
  /** base64格式 */
  imgUrl?: string;
}

export default function DownloadButton(props: IDownloadButtonProps) {
  const { imgUrl = '', children = 'Download', onClick, ...restProps } = props;

  const handleDownload = useCallback(() => {
    if (isBase64Image(imgUrl)) {
      downloadImage(imgUrl);
    }
  }, [imgUrl]);

  return (
    <Button role="download-button" onClick={handleDownload} {...restProps}>{children}</Button>
  )
}