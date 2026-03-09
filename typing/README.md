# 键跃飞鸟 - 独立打字游戏源码

这个 `typing` 目录保存的是「键跃飞鸟」打字游戏的**独立版本源码**，方便单独预览或复用。

## 目录结构

- `public/index.html`：游戏入口页面（纯静态，无构建步骤）。
- `public/style.css`：页面与游戏的样式。
- `public/game.js`：游戏主逻辑（重力、障碍物、统计等）。
- `public/words.js`：词库与难度配置，只需要改这里的单词即可。

> 注意：项目实际在首页里使用的是 `miniGames/typing` 下的同一套实现，`typing/public` 主要作为独立演示与备份，不直接挂在 `index.html` 菜单上。
