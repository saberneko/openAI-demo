import { Input, Button } from '@arco-design/web-react';
import { IconRefresh } from '@arco-design/web-react/icon';
import classNames from 'classnames';

import styles from './index.module.scss';

const TextArea = Input.TextArea;

interface IPromptArea {
  value?: any;
  loading?: boolean;
  onChange?: () => void;
  onCreatePrompt?: (value: any) => void;
}

export default function PromptArea(props: IPromptArea) {
  const { loading = false } = props;

  const handleClick = () => {
    props.onCreatePrompt && props.onCreatePrompt(props.value);
  }

  const btnDisabled = !props.value || typeof props.value == 'string' && props.value.trim().length == 0;

  const iconClassNames = classNames(styles.icon, {
    [styles.iconLoading]: loading,
  })
  
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
      <Button
        type="text"
        className={styles.perfectButton}
        disabled={btnDisabled}
        onClick={handleClick}
      ><IconRefresh className={iconClassNames}/> perfect your prompt</Button> 
    </div>
  )
}