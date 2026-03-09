# C++ 信息学竞赛打字游戏

一个基于网页的 C++ 编程语法打字训练游戏，通过打字让飞机飞行，避开障碍物。

## 功能特性

- **自动开始**：输入任意字母即可自动开始游戏
- **重力系统**：飞机默认会缓慢下坠，完成单词后可以跃起
- **障碍物系统**：从右向左生成岩石障碍，需要快速打字避开
- **三级难度**：单词库分为一级（基础）、二级（进阶）、三级（竞赛常用短语）
- **实时统计**：显示时间、正确率、WPM（每分钟正确字符数）

## 技术栈

- 纯前端实现（HTML + CSS + JavaScript）
- 无需服务器，可直接在浏览器中运行

## 快速开始

### 方式一：直接打开（推荐）

1. 克隆或下载项目
2. 用浏览器打开 `public/index.html` 即可开始游戏

### 方式二：使用本地服务器（可选）

如果需要通过 HTTP 访问（避免某些浏览器的安全限制）：

```bash
# 使用 Python（如果已安装）
cd public
python -m http.server 8000

# 或使用 Node.js 的 http-server（需要先安装：npm install -g http-server）
cd public
http-server -p 8000
```

然后在浏览器访问 `http://localhost:8000`

## 配置单词库

编辑 `public/words.js` 文件，可以：

- **修改默认难度等级**：更改 `defaultLevel`（1、2、3）
- **自定义各级单词**：修改 `levels[1|2|3].words` 数组
- **调整每局题目数**：修改 `levels[1|2|3].totalWords`

示例：

```js
window.GAME_CONFIG = {
  defaultLevel: 1,  // 默认使用一级难度
  levels: {
    1: {
      name: "一级（基础）",
      totalWords: 15,
      words: ["int", "for", "while", ...]  // 你的单词列表
    },
    // ...
  }
};
```

## 游戏参数调整

在 `public/game.js` 文件顶部可以调整以下参数：

- `GRAVITY`: 飞机下坠加速度（默认 20 px/s²）
- `JUMP_STRENGTH`: 完成单词时的跳跃力度（默认 40）
- `OBSTACLE_SPEED`: 障碍物移动速度（默认 220 px/s）
- `OBSTACLE_SPAWN_INTERVAL`: 障碍物生成间隔（默认 2000ms）
- `COLLISION_PAD_X/Y`: 碰撞判定框的缩小像素（默认 10/8）

## 项目结构

```
typing/
├── public/
│   ├── index.html      # 主页面
│   ├── style.css       # 样式文件
│   ├── game.js         # 游戏核心逻辑
│   ├── words.js        # 词库配置文件
│   └── imgs/           # 图片资源
│       ├── background.png
│       ├── rock.png
│       └── planes/
│           └── planeRed1.png
├── .gitignore
└── README.md
```

## 开发计划

- [ ] 添加难度选择 UI
- [ ] 支持自定义主题
- [ ] 添加音效
- [ ] 历史记录统计

## 许可证

MIT License

