import React, { ChangeEvent } from 'react';
import { Form, Input, Button, Upload, Message, Radio, Grid } from '@arco-design/web-react';

import styles from './index.module.scss';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;

const IMAGE_FIELD = 'image';

type FormValue = {
  formData: FormData
}

interface IFormConfigureProps {
  /** 表单提交状态 */
  loading?: boolean;
  /** 图片尺寸大小变化回调 */
  onImageSizeChange?: (value: any, event: ChangeEvent) => void;
  /** 提交表单时 */
  onSubmit?: (v: FormValue) => void;
}

export default function FormConfigure(props: IFormConfigureProps) {
  const { loading = false } = props;
	const [form] = Form.useForm();

  const onSubmit = async (event: Event) => {
    event.preventDefault();
		try {
			await form.validate();
			const formValues = form.getFields();
			const formData = handleFormData(formValues);
			// 生成图片
			// runGenerate({ formData })
      props.onSubmit && props.onSubmit({ formData });
		} catch (e) {
			console.error(e);
			Message.error('validate failed');
		}
  }

  return (
    <div className={styles.formWrapper}>
      <Form form={form} disabled={loading}>
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
          <TextArea placeholder='Please enter prompt' className={styles.promptArea}/>
        </FormItem>
        <FormItem
          label="Size"
          field="size"
        >
          <RadioGroup defaultValue='512x512' onChange={props.onImageSizeChange}>
            <Radio value='256x256'>256x256</Radio>
            <Radio value='512x512'>512x512</Radio>
            <Radio value='1024x1024'>1024x1024</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem
          label="Image"
          field="image"
          triggerPropName="fileList"
        >
          <Upload
            listType="picture-card"
            imagePreview
            name="files"
            limit={1}
            action="/"
          />
        </FormItem>
        <FormItem wrapperCol={{ offset: 5 }}>
          <Button
            type="primary"
            loading={loading}
            onClick={onSubmit}
          >Generate Image</Button>
        </FormItem>
      </Form>
    </div>
  )
}

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