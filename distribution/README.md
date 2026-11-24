# 插件索引（可选）

这个目录是一份可以直接托管的 DSH 插件索引，只列出本插件自己。适合想让别人
「在发现里搜到并一键安装」，又不想把插件混进第三方公共索引的场景。

## 发布

1. 发布 npm 包（`pnpm publish`）——索引里的版本源是 `{ "type": "npm" }`。
2. 把 `distribution/` 整个目录放到任意静态主机：GitHub Pages、Cloudflare Pages、
   对象存储都可以。要求：
   - HTTPS（HTTP 索引可被链路上的任何人篡改）；
   - 直接返回 2xx，不经过重定向；
   - `index.json` 是 UTF-8 JSON，小于 128 MiB。
3. 记住最终 URL，例如：
   `https://Travis13197.github.io/dsh-natsci-writing/index.json`

## 使用者怎么装

插件页 → 打开「自定义插件索引」（实验性）→ 发现 → 添加索引源 → 粘贴上面的 URL
→ 在卡片上安装。

## 版本更新

改完 `package.json` 的 `version` 后重新生成，否则索引仍指向旧版本：

```sh
node scripts/build-index.mjs
```

索引里的 `publishTimestamp` 由脚本写入当前时间；`engines.dsh` 与 `package.json`
保持一致，DSH 安装时会再检查一次。

## 说明

- 图标以 base64 `data:` URL 内联，单文件即可用，无需额外 `icons/` 目录。
- 只列一个插件；如果以后拆成多个包，在这个 `plugins` 数组里追加条目即可。
- 索引是第三方内容：DSH 校验格式，但不会验证索引里的声明。
