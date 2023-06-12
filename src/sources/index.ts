/*
 * @Author: seatonwang seatonwang@163.com
 * @Date: 2023-06-08 10:54:08
 * @LastEditors: seatonwang seatonwang@163.com
 * @LastEditTime: 2023-06-09 16:40:53
 * @FilePath: /learn-english-through-the-oxford-dictionary/src/sources/index.ts
 * @Description: 单词/短句
 * 
 * Copyright (c) 2023 by Seaton, All Rights Reserved. 
 */

/**
 * 约定大于规范！!!!!!!
 * 
 * 每个单词/短句都使用完整属性名，文档太过冗余、形式主义
 * 
 * 故，单词/短语格式的约定定义如下：
 *  [k: 'abandon', m: 'adj.', i: '放弃', g: 'gb.mp3', u: 'us.mp3', l: 'A1', e: '']
 * 等同于：
 *  [key: 单词, morpheme: 词性, interpretation: 解释/释义, g: 英音, u: 美音, level: 级别（CEFR）, e: 例句，支持\n换行]
 * 
 * 如果需要扩展。。，再说
 */
export interface Item {
  k: string,
  m: string,
  i: string,
  g: string,
  u: string,
  l: string,
  e?: string, // 中英文之间使用 \n 换行。如果有多个例句，例句之间使用 ; 分隔
}

const modules = import.meta.glob('./modules/*.ts', { import: 'default', eager: true })

const wordsModuleList: { key: string; words: Item[] }[] = []

Object.keys(modules).forEach((key) => {
  const module = modules[key] as []

  wordsModuleList.push({key: key.replace(/(.*\/)*([^.]+).*/ig, '$2').toUpperCase(), words: module})
})

export const wordsModules = wordsModuleList