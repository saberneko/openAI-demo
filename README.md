# OpenAI-demo

基于 nextjs 的 OpenAI demo

![image](https://github.com/saberneko/openAI-demo/blob/master/IMG/demo-2.jpeg)

支持输入 prompt 和图片，图片遵循 openAI API 标准, 必须是 PNG 图片，小于 4MB，正方形, 有透明的部分

> The image to edit. Must be a valid PNG file, less than 4MB, and square. If mask is not provided, image must have transparency, which will be used as the mask.

## 运行前的准备

在项目根目录下新建 .env 文件，填入你的 OpenAI API KEY

```bash
// .env
OPENAI_API_KEY={你的OpenAI API KEY}
```

启动项目

```bash
$ git clone git@github.com:saberneko/openAI-demo.git

$ cd openAI-demo

$ npm install

$ npm run dev
```

## 实现过程记录

[AIGC demo 记录](https://www.yuque.com/g/saberneko/vf81ru/collaborator/join?token=VCtrTh6qYXgSlwXi#)
