import React, { ChangeEvent, forwardRef, useImperativeHandle, useRef } from 'react';
import { Form, Button, Upload, Message, Radio } from '@arco-design/web-react';
import { IMAGE_FIELD, UPLOAD_IMAGE_TOOLTIP } from '../../utils/const';
import PromptArea from '../prompt-area';

import styles from './index.module.scss';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

type FormValue = {
  formData: FormData
}

interface IFormConfigureProps {
  /** 表单提交状态 */
  submitLoading?: boolean;
  /** 加载prompt状态 */
  promptLoading?: boolean;
  /** 图片尺寸大小变化回调 */
  onImageSizeChange?: (value: any, event: ChangeEvent) => void;
  /** 提交表单时 */
  onSubmit?: (v: FormValue) => void;
  onCreatePrompt: (value: any) => void;
}

const FormConfigure = forwardRef(function (props: IFormConfigureProps, ref) {
  const { submitLoading = false, promptLoading } = props;
	const [form] = Form.useForm();
  const formRef = useRef(null);

  const onSubmit = async (event: Event) => {
    event.preventDefault();
		try {
			await form.validate();
			const formValues = form.getFields();
			const formData = handleFormData(formValues);
			// 生成图片
      props.onSubmit && props.onSubmit({ formData });
		} catch (e) {
			console.error(e);
			Message.error('validate failed');
		}
  }

  const handleBeforeUpload = (file: File): boolean | Promise<any> => {
    return new Promise((resolve, reject) => {
      // 大于4MB不能上传
      if (file.size / (1024 * 1024) < 4) {
        resolve(true);
      } else {
        Message.error('The file must be less than 4MB, Please upload again');
        reject('cancel');
      }
    })
  }

  useImperativeHandle(ref, () => {
    return {
      getFormInstance() {
        return formRef.current;
      }
    }
  }, [])

  return (
    <div className={styles.formWrapper}>
      <Form ref={formRef} form={form} disabled={submitLoading}>
        <FormItem
          label="Prompt"
          field="prompt"
          required
          rules={[
            {
              validator(v, cb) {
                if (!v) {
                  return cb('Prompt is required')
                }
                return cb();
              }
            }
          ]}
        >
          <PromptArea
            loading={promptLoading}
            onCreatePrompt={props.onCreatePrompt}
          />
        </FormItem>
        <FormItem
          label="Size"
          field="size"
          initialValue={'512x512'}
        >
          <RadioGroup onChange={props.onImageSizeChange}>
            <Radio value='256x256'>256x256</Radio>
            <Radio value='512x512'>512x512</Radio>
            <Radio value='1024x1024'>1024x1024</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem
          label="Image"
          field="image"
          triggerPropName="fileList"
          tooltip={UPLOAD_IMAGE_TOOLTIP}
        >
          <Upload
            listType="picture-card"
            imagePreview
            name="files"
            limit={1}
            accept="image/png"
            action="/"
            beforeUpload={handleBeforeUpload}
          />
        </FormItem>
        <FormItem wrapperCol={{ offset: 5 }}>
          <Button
            type="primary"
            loading={submitLoading}
            onClick={onSubmit}
          >Generate Image</Button>
        </FormItem>
      </Form>
    </div>
  )
});

function handleFormData(formValues: Partial<any>) {
	const formData = new FormData();
	for (let [field, value] of Object.entries(formValues)) {
		if (field === IMAGE_FIELD) {
			formData.append(field, value[0]?.originFile);
		} else {
			formData.append(field, value);
		}
	}

	return formData;
}

export default FormConfigure;