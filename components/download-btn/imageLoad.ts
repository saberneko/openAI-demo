import { convertBase64UrlToBlob } from './utils';

function downLoad (urlData: any) {
  let a = document.createElement('a');
  let blob = convertBase64UrlToBlob(urlData);

  a.download = 'defaut_image';
  a.href = URL.createObjectURL(blob);
  a.dispatchEvent(new MouseEvent('click'));
}

export {
  downLoad
}