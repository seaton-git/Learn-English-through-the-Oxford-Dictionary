<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

// LocalStorage 的键值
enum Storage {
  bookmark = 'bookmark', // 书签
  checkedLevel = 'checkedLevel', // 已选择的CEFR
}
const indexList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Y', 'Z']

const emit = defineEmits(['filter'])

// 是否开启设置面板
const isActived = ref(false)

// 书签key
const inputBookmark = ref('')

const checkedList = ref<string[]>([])

/**
 * @description: 开启/关闭设置面板
 * @return {*}
 */
const onActiveSettings = (): void => {
  isActived.value = !isActived.value
}

/**
 * @description: 过滤CEFR级别
 * @return {*}
 */
const onFilterLevel = (): void => {
  if (!checkedList.value.length) return

  // 保存已选级别，下次直接回显过滤
  localStorage.setItem(Storage.checkedLevel, checkedList.value.join(','))

  emit('filter', { level: checkedList.value })
}

/**
 * @description: 保存书签锚点
 * @return {*}
 */
const onSaveBookMark = (): void => {
  const key = inputBookmark.value?.trim()

  localStorage.setItem(Storage.bookmark, key)
}

/**
 * @description: 跳转书签
 * @param {*} void
 * @return {*}
 */
const onScrollBookMark = (): void => {
  const key = localStorage.getItem(Storage.bookmark) || ''

  if (!key) return

  document.getElementById(key)?.scrollIntoView()
}

onMounted(async () => {
  const key = localStorage.getItem(Storage.bookmark) || ''
  const level = localStorage.getItem(Storage.checkedLevel) || ''

  inputBookmark.value = key
  checkedList.value = level ? level.split(',') : ['A1', 'A2', 'B1', 'B2', 'C1']

  await nextTick()

  onFilterLevel()
})
</script>

<template>
  <div class="settings">
    <button class="entrance" @click="() => onActiveSettings()">
      <div class="f"><div class="s"></div></div>
    </button>
    <div :class="isActived ? 'items active' : 'items'">
      <div class="index-section">
        <a class="index" :href="`#${item}`" v-for="item in indexList" :key="item">{{ item }}</a>
      </div>
      <fieldset class="bookmark-section">
        <legend>书签（不同词性、相同拼写的单词，以第一个为锚点）</legend>
        <input type="text" v-model="inputBookmark" />
        <button @click.stop="() => onSaveBookMark()">保存</button>
        <button @click.stop="() => onScrollBookMark()">跳转</button>
      </fieldset>
      <fieldset class="level-section">
        <legend :class="checkedList.length ? '' : 'not-selected'">选择CEFR级别</legend>
        <div class="level">
          <input type="checkbox" id="A1" value="A1" v-model="checkedList" />
          <label for="A1">A1</label>
        </div>
        <div class="level">
          <input type="checkbox" id="A2" value="A2" v-model="checkedList" />
          <label for="A2">A2</label>
        </div>
        <div class="level">
          <input type="checkbox" id="B1" value="B1" v-model="checkedList" />
          <label for="B1">B1</label>
        </div>
        <div class="level">
          <input type="checkbox" id="B2" value="B2" v-model="checkedList" />
          <label for="B2">B2</label>
        </div>
        <div class="level">
          <input type="checkbox" id="C1" value="C1" v-model="checkedList" />
          <label for="C1">C1</label>
        </div>
        <div class="level">
          <button @click.stop="() => onFilterLevel()">确认</button>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<style lang="less">
.settings {
  .entrance {
    width: 3rem;
    height: 3rem;
    border-radius: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    background-color: rgba(0, 0, 0, 0.18);
    bottom: 5rem;
    left: -0.2rem;
    position: fixed;

    .f, .s {
      width: 80%;
      height: 80%;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.12);
    }

    .s {
      background-color: rgba(0, 0, 0, 0.1);
    }

    &:active {
      width: 5.2rem;
      height: 5.2rem;
    }
  }

  .items {
    width: 0;
    height: 0;
    border-radius: 4px;
    overflow: hidden;
    background-color: #fcf9f9;
    bottom: 8.2rem;
    left: 1.5rem;
    position: fixed;
    transition: all 0.2s ease-out;
    box-shadow: 5px 5px 10px -4px #bd7a04;

    &.active {
      width: 88vw;
      height: 18rem;
    }
  }

  .index-section {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0.75rem;
    border-bottom: 1px solid #dedede;

    .index {
      color: #bd7a04;
      font-size: 1rem;
      font-weight: bold;
      text-decoration: none;
      flex: 0 0 calc(100% / 13 - 2px);
    }
  }

  .bookmark-section {
    color: #666;
    font-size: 0.75rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 1rem;
    border: 1px solid #bd7a04;

    input {
      outline: none;
    }
  }

  .level-section {
    color: #666;
    font-size: 0.75rem;
    font-weight: bold;
    display: flex;
    flex-wrap: wrap;
    margin-top: 1rem;
    border: 1px solid #bd7a04;

    .not-selected {
      color: #f40505;
    }

    .level {
      flex: 0 0 33%;
      color: #bd7a04;
      font-size: 1rem;
    }
  }
}
</style>
