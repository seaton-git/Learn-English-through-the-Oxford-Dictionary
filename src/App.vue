<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { Item, wordsModules } from './sources/index'
import Settings from './components/Settings.vue'

// 所有单词/短语
const wordsList = ref(wordsModules)

// 展开行的keys
const expandKeys = ref<string[]>([])

// 播放音频地址
const audioPath = ref('')

/**
 * @description: 播放发音
 * @param {*} item 单词、短语信息
 * @param {*} type uk | us，英音 | 美音
 * @return {*}
 */
const onPlayKey = (item: Item, type: string = 'uk'): void => {
  const { k, g, u } = item

  const fillInStr = `__${type === 'uk' ? 'gb' : 'us'}`
  const audioName = type === 'uk' ? g : u

  let formatKey = k

  if (formatKey.length < 5) {
    formatKey += fillInStr.substring(0, (5 - formatKey.length))
  }

  const f = formatKey.substring(0, 1)
  const s = formatKey.substring(0, 3)
  const t = formatKey.substring(0, 5)

  const sourceUrl = `https://www.oxfordlearnersdictionaries.com/media/english/${type}_pron/${f}/${s}/${t}/${audioName}.mp3`

  if ((window as any).WeixinJSBridge) {
    (window as any).WeixinJSBridge.invoke('getNetworkType', {}, async () => {
      const audio: HTMLAudioElement = document?.getElementById('audio') as HTMLAudioElement

      audioPath.value = sourceUrl

      await nextTick()

      audio.play()
    }, false)
  } else {
    const audio = new Audio(sourceUrl)

    audio.play()
  }
}

/**
 * @description: 查看辅助信息（释义、例句）
 * @param {*} item 单词、短语信息
 * @return {*}
 */
const onViewKey = (item: Item): void => {
  const { k, m } = item

  const key = (k + m).slice(0, -1)

  const existIndex = expandKeys.value.findIndex(i => i === key)

  if (existIndex > -1) {
    expandKeys.value.splice(existIndex, 1)
  } else {
    expandKeys.value.push(key)
  }
}

/**
 * @description: 过滤单词/短语
 * @param {*} level CEFR级别
 * @param {*} keyWords 关键字
 * @return {*}
 */
const onFilter = ({ level }: { level?: string[], keyWords?: string }): void => {
  if (level && !level.length) {
    wordsList.value = []

    return
  }

  const filterResult = wordsModules.map(m => {
    const modFilterResult = m.words.filter(mf => level?.includes(mf.l))

    return { key: m.key, words: modFilterResult }
  })

  wordsList.value = filterResult
}
</script>

<template>
  <div class="content">
    <audio id="audio" :src="audioPath" :loop="false"></audio>
    <template v-for="mod in wordsList" :key="mod.key">
      <h2 :id="mod.key" class="title">{{ mod.key }}</h2>
      <ul class="words-wrapper">
        <template v-for="item in mod.words" :key="item.k + item.m">
          <li>
            <div :id="item.k" class="words" @click="() => onViewKey(item)">
              <div class="ls">
                <span class="level">{{ item.l }}</span>
                <strong>{{ item.k }}</strong>
                <em class="morpheme">{{ item.m }}</em>
              </div>
              <div class="rs">
                <button @click.stop="() => onPlayKey(item, 'uk')">英</button>
                <button @click.stop="() => onPlayKey(item, 'us')">美</button>
              </div>
            </div>
            <div v-show="expandKeys.indexOf((item.k + item.m).slice(0, -1)) !== -1">
              <div class="interpretation">释义：{{ item.i }}</div>
              <template v-if="item.e">
                <div class="example">
                  <template v-for="example in item.e?.split(';')">
                    <p v-for="exampleItem, pii in example?.split('\n')" :class="pii === 0 ? 'en' : ''">{{ exampleItem }}</p>
                  </template>
                </div>
              </template>
            </div>
          </li>
        </template>
      </ul>
    </template>
  </div>
  <Settings @filter="(params: any) => onFilter(params)" />
</template>

<style lang="less">
.content {
  width: 100%;

  .title {
    color: #666;
    text-align: left;
  }

  .words-wrapper {
    margin: 0;
    padding: 0 0.75rem 1rem 0.75rem;
    text-align: left;
    li {
      list-style: none;
      overflow: hidden;
      border-radius: 0.25rem;
      border-bottom: 1px solid #dedede;
    }
  }

  .words {
    cursor: pointer;
    color: #bd7a04;
    font-size: 1rem;
    padding: 0.35rem 0.75rem;
    background-color: rgba(189, 122, 4, .1);
    display: flex;
    align-items: center;
    justify-content: space-between;

    .ls {
      display: flex;
      align-items: center;
    }

    .level {
      color: #fff;
      font-size: 0.65rem;
      font-weight: bold;
      width: 0.85rem;
      height: 0.75rem;
      border-radius: 0.25rem;
      background-color: #666;
      margin-right: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 1px;
      padding: 1px 1px 0 1px;
      line-height: 1;
    }

    .morpheme {
      color: #666;
      font-weight: bold;
      margin-left: 0.75rem;
    }

    .rs {
      button {
        width: 3rem;
        margin-left: 0.75rem;
        user-select: none;
      }
    }
  }

  .interpretation {
    color: #bd7a04;
    font-size: 0.8rem;
    padding: 0.25rem 0.75rem 0 0.75rem;
    background-color: #fcf9f9;
  }

  .example {
    color: #999;
    font-size: 0.75rem;
    white-space: pre-line;
    padding: 0 0.75rem 0.25rem 0.75rem;
    background-color: #fcf9f9;
    p {
      margin: 0;
      line-height: 1.3;

      &.en {
        color: #bd7a04;
        font-size: 0.8rem;
        padding-top: 0.25rem;
      }
    }
  }
}
</style>
