import { convertBase64UrlToBlob } from './utils';

/**
 * @description 下载图片
 * @param urlData base64 url {string}
 * @returns void
 */
function downloadImage (urlData: string) {
  let a = document.createElement('a');
  let blob = convertBase64UrlToBlob(urlData);

  a.download = 'defaut_image';
  a.href = URL.createObjectURL(blob);
  a.dispatchEvent(new MouseEvent('click'));
}

export {
  downloadImage
}