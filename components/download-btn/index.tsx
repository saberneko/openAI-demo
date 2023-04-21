import React, { useCallback } from 'react';
import { Button, ButtonProps } from '@arco-design/web-react';
import { downloadImage } from './imageLoad';

interface IDownloadButtonProps extends ButtonProps {
  /** base64格式 */
  imgUrl: string;
}

export default function DownloadButton(props: IDownloadButtonProps) {
  const { imgUrl, children = 'Download', onClick, ...restProps } = props;

  const handleDownload = useCallback(() => {
    downloadImage(imgUrl);
  }, [imgUrl]);

  return (
    <Button onClick={handleDownload} {...restProps}>{children}</Button>
  )
}