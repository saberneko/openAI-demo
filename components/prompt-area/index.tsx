import { Input } from '@arco-design/web-react';
import { IconRefresh } from '@arco-design/web-react/icon';

import styles from './index.module.scss';

const TextArea = Input.TextArea;

interface IPromptArea {
  value?: any;
  onChange?: () => void;
  onCreatePrompt: (value: any) => void;
}

export default function PromptArea(props: IPromptArea) {
  const handleClick = () => {
    props.onCreatePrompt && props.onCreatePrompt(props.value);
  }
  return (
    <div className={styles.promptArea}>
      <TextArea
        showWordLimit
        maxLength={1000}
        placeholder='Please enter prompt'
        value={props.value}
        onChange={props.onChange}
        className={styles.textArea}
      />
      <div onClick={handleClick}><IconRefresh /> perfect your prompt</div>
    </div>
  )
}