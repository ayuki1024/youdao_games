// 词库配置文件
// 你可以在这里自由增删修改单词，不需要改 game.js

window.GAME_CONFIG = {
  // 默认难度等级（1、2、3）
  defaultLevel: 1,

  // 按等级划分的词库
  // 你可以只改这里的 words/totalWords，不需要碰 game.js
  levels: {
    1: {
      name: "一级（基础）",
      // 每局要打多少个单词
      totalWords: 15,
      // 基础关键字 / 语法
      words: [
        "int",
        "char",
        "bool",
        "for",
        "while",
        "if",
        "else",
        "return",
        "break",
        "continue",
        "main",
        "struct",
        "namespace",
        "include",
        "using"
      ]
    },
    2: {
      name: "二级（进阶容器与算法）",
      totalWords: 15,
      words: [
        "vector",
        "string",
        "pair",
        "map",
        "set",
        "queue",
        "stack",
        "priority_queue",
        "push_back",
        "size",
        "begin",
        "end",
        "sort",
        "lower_bound",
        "upper_bound"
      ]
    },
    3: {
      name: "三级（竞赛常用短语）",
      totalWords: 15,
      words: [
        "long long",
        "bits/stdc++.h",
        "iostream",
        "using namespace std",
        "ios::sync_with_stdio(false)",
        "cin.tie(nullptr)",
        "memset",
        "vector<int>",
        "pair<int,int>",
        "priority_queue<int>",
        "sort(a,a+n)",
        "for(int i=0;i<n;i++)",
        "while(cin>>x)",
        "push_back(x)",
        "lower_bound(a,a+n,x)"
      ]
    }
  }
};


``