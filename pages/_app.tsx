import type { AppProps } from 'next/app';

import "@arco-design/web-react/dist/css/arco.css";
import '../styles/global.css';

export default function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
}