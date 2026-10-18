# 飞书 hot100【Python】本地镜像

源页面：<https://icnuwaxf6iuf.feishu.cn/wiki/RINJwjsqni3YnqkWxpJcfGC9n0g>

## 启动

```bash
cd /Users/jonathan/Documents/GitHub/leetcode-record/feishu-hot100
npm install
npm run build
npm start
```

然后打开 <http://127.0.0.1:4173>。

## 内容

- `docs/hot100-python.md`：从飞书页面按原块顺序转换的 Markdown。
- `assets/`：清理广告文字和二维码后保留的 19 张题解配图。
- `dist/`：`npm run build` 生成的本地静态站点。

该知识库链接的侧栏只显示一个节点，未发现子级文档。飞书正文使用临时图片地址，因此图片通过已登录会话的预览器逐张保存到本地。
