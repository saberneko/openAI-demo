import React from 'react';
import { Button, ButtonProps } from '@arco-design/web-react';
import { downLoad } from './imageLoad';

interface IProps extends ButtonProps {
  imgUrl: string;
}

export default function DownLoadButton(props: IProps) {
  const { imgUrl, children = 'Download', onClick, ...restProps } = props;

  const handleDownLoad = () => {
    downLoad(imgUrl);
  }

  return (
    <Button onClick={handleDownLoad} {...restProps}>{children}</Button>
  )
}