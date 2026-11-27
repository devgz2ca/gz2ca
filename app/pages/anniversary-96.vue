<template>
  <div class="anniversary-page">
    <button
      class="tour-control"
      type="button"
      :aria-pressed="tourStarted"
      @click="togglePhotoTour"
    >
      <span aria-hidden="true">{{ tourStarted ? 'Ⅱ' : '▶' }}</span>
      {{ tourStarted ? '暂停导览' : '继续导览' }}
    </button>
    <main>
      <section id="welcome" class="hero-section">
        <div class="hero-image">
          <img
            src="/gz2-yingyuan-gate-2020.jpg"
            alt="广州市第二中学应元路校区校门"
            width="1280"
            height="853"
            fetchpriority="high"
          />
        </div>
        <div class="hero-shade"></div>
        <div class="hero-copy">
          <p class="eyebrow"><span></span> GUANGZHOU NO. 2 MIDDLE SCHOOL · CANADA ALUMNI</p>
          <p class="hero-years">1930 <i>—</i> 2026</p>
          <h1><span class="hero-number">96</span><span class="hero-title">九十六载<br />薪火相传</span></h1>
          <p class="hero-subtitle">广州市第二中学建校96周年纪念</p>
          <p class="hero-message">岁月流转，初心不变。<br />跨越山海，情系二中。</p>
          <div class="hero-actions">
            <a class="button button-gold" href="#history">走进二中校史 <span aria-hidden="true">↓</span></a>
            <a class="button button-outline" href="#alumni">认识加拿大校友 <span aria-hidden="true">↗</span></a>
          </div>
          <p v-if="tourMessage" class="tour-message" role="status">{{ tourMessage }}</p>
        </div>
        <div class="hero-side-note">从广州出发 · 走向世界</div>
        <a class="scroll-cue" href="#history" aria-label="向下浏览校史"><span></span> SCROLL TO EXPLORE</a>
        <p class="hero-credit"><a href="https://commons.wikimedia.org/wiki/File:%E5%B9%BF%E5%B7%9E%E4%BA%8C%E4%B8%AD%E5%BA%94%E5%85%83%E8%B7%AF%E6%A0%A1%E5%8C%BA%E6%A0%A1%E9%97%A8_2020.jpg" target="_blank" rel="noopener noreferrer">应元路校门照片：Tim Wu · CC BY-SA 4.0 ↗</a></p>
      </section>

      <section id="history" class="history-section section-shell">
        <header class="section-heading">
          <p class="section-kicker">01 / THE YEARS</p>
          <h2>岁月如歌 <span>·</span> 九十六载历程</h2>
          <p>从广州城里的书声琅琅，到跨越山海的校友情谊。每一个年份，都是二中人共同的记忆。</p>
        </header>
        <ol class="history-timeline">
          <li v-for="(item, index) in milestones" :key="item.year" class="history-item" :class="{ 'history-item-current': index === milestones.length - 1 }">
            <span class="history-year">{{ item.year }}</span>
            <span class="history-marker" aria-hidden="true"></span>
            <div class="history-copy">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </li>
        </ol>
        <p class="history-note">校史年份按本专题提供的历史节点整理。</p>
      </section>

      <section id="memories" class="memories-section section-shell">
        <header class="section-heading section-heading-light">
          <p class="section-kicker">02 / SCHOOL MEMORIES</p>
          <h2>青春记忆 <span>·</span> 难忘二中</h2>
          <p>老照片里的书香与今天熟悉的校园，连接着一代代二中人的青春。</p>
        </header>
        <div class="memory-grid">
          <figure class="memory-photo memory-archive">
            <img src="/gz2-library-1930s.jpg" alt="广州市第二中学三十年代图书馆内的阅读场景" width="1280" height="960" loading="lazy" />
            <figcaption><span>旧日书声</span><small>三十年代 · 校园图书馆 · 公有领域</small><a href="https://commons.wikimedia.org/wiki/File:20%E4%B8%96%E7%BA%AA30%E5%B9%B4%E4%BB%A3%E7%9A%84%E5%B9%BF%E5%B7%9E%E4%BA%8C%E4%B8%AD%E5%9B%BE%E4%B9%A6%E9%A6%86.jpg" target="_blank" rel="noopener noreferrer">查看图片来源 ↗</a></figcaption>
          </figure>
          <figure class="memory-photo memory-gate">
            <img src="/gz2-yingyuan-gate-2020.jpg" alt="广州市第二中学应元路校区入口" width="1280" height="853" loading="lazy" />
            <figcaption><span>应元路校区</span><small>2020 · 摄影：Tim Wu · CC BY-SA 4.0</small><a href="https://commons.wikimedia.org/wiki/File:%E5%B9%BF%E5%B7%9E%E4%BA%8C%E4%B8%AD%E5%BA%94%E5%85%83%E8%B7%AF%E6%A0%A1%E5%8C%BA%E6%A0%A1%E9%97%A8_2020.jpg" target="_blank" rel="noopener noreferrer">查看图片来源 ↗</a></figcaption>
          </figure>
          <figure class="memory-photo memory-science">
            <img src="/gz2-science-city-2022.jpg" alt="广州市第二中学科学城校区航拍" width="1280" height="853" loading="lazy" />
            <figcaption><span>校园新篇</span><small>2022 · 科学城校区 · 摄影：Tim Wu · CC BY-SA 4.0</small><a href="https://commons.wikimedia.org/wiki/File:GZEZ_Science_City_Campus_Aerial_View_20220625-D.jpg" target="_blank" rel="noopener noreferrer">查看图片来源 ↗</a></figcaption>
          </figure>
          <div class="memory-placeholder">
            <span class="placeholder-index">ARCHIVE 04</span>
            <span class="placeholder-seal">留<br />白</span>
            <div><h3>课堂与师生</h3><p>待校友提供并授权</p></div>
          </div>
          <div class="memory-placeholder memory-placeholder-light">
            <span class="placeholder-index">ARCHIVE 05</span>
            <span class="placeholder-seal">待<br />续</span>
            <div><h3>毕业与重逢</h3><p>期待你的二中记忆</p></div>
          </div>
        </div>
        <p class="memory-attribution">历史与校园照片按原作展示；作者、来源及许可信息见各图说明。</p>
        <div v-if="gallery.length" class="alumni-photo-reel" aria-live="polite">
          <div class="reel-heading"><div><p class="section-kicker">ALUMNI MOMENTS</p><h3>校友相聚 · 此刻珍藏</h3></div><span class="reel-count">{{ String(slideIndex + 1).padStart(2, '0') }} <i>/</i> {{ String(gallery.length).padStart(2, '0') }}</span></div>
          <Transition name="photo-fade" mode="out-in">
            <figure :key="currentSlide?._id" class="reel-frame">
              <img :src="currentSlide?.src" :alt="currentSlide?.event_name || '广州市第二中学加拿大校友活动照片'" loading="lazy" />
              <figcaption><span>{{ currentSlide?.event_name || '广州市第二中学加拿大校友活动' }}</span><time v-if="currentSlide?.ts">{{ formatDate(currentSlide.ts) }}</time></figcaption>
            </figure>
          </Transition>
          <div class="reel-controls">
            <button type="button" aria-label="上一张校友活动照片" @click="changeSlide(-1)">←</button>
            <div class="reel-progress"><span :style="{ width: `${((slideIndex + 1) / gallery.length) * 100}%` }"></span></div>
            <button type="button" aria-label="下一张校友活动照片" @click="changeSlide(1)">→</button>
          </div>
        </div>
        <p v-else-if="!galleryLoading" class="reel-empty"><NuxtLink to="/gallery">校友活动照片正在整理中 · 前往活动相册 ↗</NuxtLink></p>
      </section>

      <section id="alumni" class="alumni-section section-shell">
        <div class="alumni-copy">
          <p class="section-kicker">03 / ONE SCHOOL, MANY HOMES</p>
          <h2>跨越山海<br /><em>情系二中</em></h2>
          <p class="alumni-subtitle">从广州出发，走向世界。无论身在何方，我们都是二中人。</p>
          <p class="alumni-body">从温哥华、多伦多、渥太华、蒙特利尔，到更多海外城市，加拿大校友因母校相识，在不同地方继续生活、工作与相聚。地图标记的是校友情谊所到之处，不代表任何个人的实时位置。</p>
          <NuxtLink to="/alumni" class="text-link">认识我们的校友 <span aria-hidden="true">↗</span></NuxtLink>
        </div>
        <div class="world-map-wrap">
          <svg class="world-map" viewBox="0 0 1000 480" role="img" aria-labelledby="map-title map-desc">
            <title id="map-title">广州与加拿大校友城市示意图</title>
            <desc id="map-desc">示意标出广州、多伦多、温哥华、渥太华和蒙特利尔，展示校友情谊连接两地，不表示个人实时位置。</desc>
            <g class="map-graticule" fill="none">
              <path d="M50 120H950M25 240H975M50 360H950" />
              <path d="M250 35C190 150 190 330 250 445M500 20C440 150 440 330 500 460M750 35C810 150 810 330 750 445" />
            </g>
            <g class="land-shapes">
              <path d="M90 105 130 72 197 60 224 80 273 72 299 98 285 123 310 141 300 169 270 177 256 205 228 215 214 245 184 232 173 206 148 193 141 163 115 147 106 126Z" />
              <path d="M246 252 273 265 289 297 282 327 299 350 288 385 269 421 252 398 250 365 233 336 238 307 222 282Z" />
              <path d="M430 105 469 83 495 92 506 116 484 131 464 124Z" />
              <path d="M455 150 493 139 520 163 512 195 497 213 487 251 464 271 448 250 440 215 424 190 435 168Z" />
              <path d="M505 104 550 80 602 82 627 65 680 78 709 67 759 83 808 75 860 96 883 122 853 143 817 137 790 158 755 151 729 172 693 162 666 183 637 167 610 183 580 161 552 166 526 145Z" />
              <path d="M817 270 850 256 886 264 903 285 892 306 859 313 832 299Z" />
              <path d="M894 371 918 359 943 372 938 393 910 399Z" />
              <path d="M885 118 905 103 921 112 915 132Z" />
            </g>
            <g class="map-routes" fill="none">
              <path d="M770 184Q520 45 260 155" />
              <path d="M770 184Q455 12 175 145" />
              <path d="M770 184Q515 70 284 151" />
              <path d="M770 184Q525 54 300 138" />
            </g>
            <g class="map-city city-canada"><circle cx="175" cy="145" r="5" /><text x="135" y="130">温哥华</text></g>
            <g class="map-city city-canada"><circle cx="260" cy="155" r="5" /><text x="218" y="180">多伦多</text></g>
            <g class="map-city city-canada"><circle cx="284" cy="151" r="4" /><text x="262" y="128">渥太华</text></g>
            <g class="map-city city-canada"><circle cx="300" cy="138" r="4" /><text x="303" y="130">蒙特利尔</text></g>
            <g class="map-city city-guangzhou"><circle cx="770" cy="184" r="7" /><circle cx="770" cy="184" r="14" /><text x="787" y="190">广州</text></g>
            <text class="map-region" x="160" y="245">CANADA</text>
            <text class="map-region" x="710" y="250">ASIA PACIFIC</text>
          </svg>
          <div class="map-caption"><span><i></i> 加拿大校友城市</span><span><i></i> 母校 · 广州</span></div>
        </div>
      </section>

      <section id="greetings" class="greetings-section section-shell">
        <header class="section-heading">
          <p class="section-kicker">04 / WITH LOVE FROM ALUMNI</p>
          <h2>同心祝福 <span>·</span> 共庆华诞</h2>
          <p>把一句祝福寄回母校，让相隔山海的心意在九十六周年相聚。</p>
        </header>
        <div class="greeting-feature">
          <span class="greeting-quote" aria-hidden="true">“</span>
          <blockquote>愿母校薪火相传，桃李芬芳；愿每一位二中人，心中常有归处。</blockquote>
          <p>广州市第二中学加拿大校友网 · 贺母校九十六周年</p>
          <span class="greeting-year">1930 <i>—</i> 2026</span>
        </div>
        <div class="greeting-invitation">
          <div><h3>下一份祝福，来自你</h3><p>投稿入口正在筹备，欢迎联系加拿大校友会参与周年祝福征集。</p></div>
          <button class="button button-navy" type="button" @click="showGreetingNotice = !showGreetingNotice">送上我的祝福 <span aria-hidden="true">↗</span></button>
        </div>
        <p v-if="showGreetingNotice" class="greeting-notice" role="status">祝福投稿功能待接入。你可以先通过 <NuxtLink to="/about">关于母校页面</NuxtLink> 联系加拿大校友会。</p>
      </section>

      <section class="closing-section">
        <img src="/gz2-yingyuan-gate-2020.jpg" alt="" width="1280" height="853" loading="lazy" />
        <div class="closing-shade"></div>
        <div class="closing-copy">
          <p class="section-kicker">GUANGZHOU · CANADA · ALWAYS</p>
          <h2>母校九十六载，<br />情系一生。</h2>
          <p>感谢母校，感谢老师，感谢每一位二中人。</p>
          <span class="closing-rule"></span>
          <h3>广州二中人 <i>·</i> 缘聚加拿大</h3>
          <NuxtLink to="/" class="closing-link">回到加拿大校友网首页 <span aria-hidden="true">↗</span></NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { get } from '~/utils/http'

interface GalleryPhoto {
  _id: string
  src: string
  thumb: string
  ts?: string
  event_name?: string
}

const milestones = [
  { year: '1930', title: '广州市立第二中学创办', description: '学校在广州创立，开启薪火相传的教育历程。' },
  { year: '1947', title: '学校复校', description: '战后复校，校园弦歌再续。' },
  { year: '1951', title: '正式定名为广州市第二中学', description: '学校正式定名，延续至今。' },
  { year: '1956', title: '被评为广州市重点中学', description: '办学质量与教育成果获得认可。' },
  { year: '1994', title: '获评广东省首批省一级学校', description: '成为广东省首批省一级学校之一。' },
  { year: '2007', title: '通过广东省国家级示范性普通高中验收', description: '办学发展迈入新的阶段。' },
  { year: '2026', title: '迎来建校96周年', description: '加拿大校友与海内外二中人同贺母校九十六周年。' }
]

const gallery = ref<GalleryPhoto[]>([])
const galleryLoading = ref(true)
const galleryError = ref(false)
const slideIndex = ref(0)
const tourStarted = ref(false)
const tourMessage = ref('')
const showGreetingNotice = ref(false)
let slideTimer: ReturnType<typeof setInterval> | undefined
let tourTimer: ReturnType<typeof setInterval> | undefined

const currentSlide = computed(() => gallery.value[slideIndex.value])

const startPhotoTour = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    tourMessage.value = '系统已开启减少动态效果；请使用页面导航自行浏览。'
    return
  }
  if (tourTimer) clearInterval(tourTimer)
  tourStarted.value = true
  tourMessage.value = '自动导览已开始；手动滚动页面即可暂停。'
  const sections = ['history', 'memories', 'alumni', 'greetings', 'closing']
  let index = 0
  tourTimer = setInterval(() => {
    if (index >= sections.length) {
      stopPhotoTour()
      tourMessage.value = '导览结束，感谢与二中同行。'
      return
    }
    document.getElementById(sections[index])?.scrollIntoView({ behavior: 'smooth' })
    index += 1
  }, 16000)
}

const stopPhotoTour = () => {
  if (tourTimer) clearInterval(tourTimer)
  tourTimer = undefined
  if (tourStarted.value) tourMessage.value = '自动导览已暂停，可随时继续。'
  tourStarted.value = false
}

const togglePhotoTour = () => {
  if (tourStarted.value) {
    stopPhotoTour()
  } else {
    startPhotoTour()
  }
}

const pauseTourOnInteraction = (event: Event) => {
  if (event.target instanceof Element && event.target.closest('.tour-control')) return
  stopPhotoTour()
}

const changeSlide = (direction: number) => {
  if (!gallery.value.length) return
  slideIndex.value = (slideIndex.value + direction + gallery.value.length) % gallery.value.length
}

const formatDate = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long' }).format(date)
}

const loadGallery = async () => {
  try {
    const response = await get<{ success: boolean; media: GalleryPhoto[] }>('/api/media')
    gallery.value = response.success ? response.media : []
    if (gallery.value.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      slideTimer = setInterval(() => {
        slideIndex.value = (slideIndex.value + 1) % gallery.value.length
      }, 6000)
    }
  } catch {
    galleryError.value = true
  } finally {
    galleryLoading.value = false
  }
}

onMounted(() => {
  loadGallery()
  window.addEventListener('wheel', pauseTourOnInteraction, { passive: true })
  window.addEventListener('touchmove', pauseTourOnInteraction, { passive: true })
  window.addEventListener('keydown', pauseTourOnInteraction)
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) startPhotoTour()
})

onBeforeUnmount(() => {
  if (slideTimer) clearInterval(slideTimer)
  if (tourTimer) clearInterval(tourTimer)
  window.removeEventListener('wheel', pauseTourOnInteraction)
  window.removeEventListener('touchmove', pauseTourOnInteraction)
  window.removeEventListener('keydown', pauseTourOnInteraction)
})

definePageMeta({ layout: 'default' })

useHead({
  title: '建校96周年 · 广州市第二中学加拿大校友网',
  meta: [{ name: 'description', content: '广州市第二中学1930—2026建校96周年纪念。跨越山海，情系二中；广州二中人，缘聚加拿大。' }]
})
</script>

<style scoped>
.anniversary-page {
  --navy: #14243b;
  --gold: #c9a96e;
  --ivory: #f7f4ed;
  --charcoal: #252525;
  --muted: #73736f;
  color: var(--charcoal);
  background: var(--ivory);
  font-family: "Noto Serif SC", "Songti SC", "STSong", Georgia, serif;
  overflow: clip;
}
.anniversary-page *, .anniversary-page *::before, .anniversary-page *::after { box-sizing: border-box; }
.tour-control { position: fixed; z-index: 45; top: 96px; right: 22px; display: inline-flex; min-height: 38px; align-items: center; gap: 8px; padding: 0 13px; border: 1px solid rgba(201,169,110,.65); color: #fff; background: rgba(20,36,59,.94); font: 11px "Songti SC", "STSong", serif; cursor: pointer; }
.tour-control span { color: var(--gold); }
.tour-control:hover { border-color: var(--gold); background: #233b5b; }
.tour-control:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }
.hero-section { position: relative; display: flex; min-height: min(850px, calc(100svh - 80px)); align-items: center; overflow: hidden; color: #fff; background: var(--navy); }
.hero-image, .hero-image img, .hero-shade { position: absolute; inset: 0; width: 100%; height: 100%; }
.hero-image img { object-fit: cover; object-position: center 43%; animation: hero-arrive 1.2s ease-out both; }
.hero-shade { background: linear-gradient(90deg, rgba(10,22,39,.94) 0%, rgba(13,28,47,.78) 42%, rgba(13,28,47,.18) 100%), linear-gradient(0deg, rgba(10,22,39,.58), transparent 35%); }
.hero-copy { position: relative; z-index: 1; width: min(760px, 72vw); padding: 76px clamp(28px, 10vw, 150px); animation: rise-in .9s .12s both; }
.eyebrow, .section-kicker { color: var(--gold); font: 10px/1.5 Georgia, "Songti SC", serif; letter-spacing: 1.7px; }
.eyebrow { display: flex; align-items: center; gap: 10px; margin: 0 0 27px; }
.eyebrow span { width: 24px; height: 1px; background: var(--gold); }
.hero-years { margin: 0 0 3px; color: rgba(255,255,255,.82); font: 15px Georgia, serif; letter-spacing: 4px; }
.hero-years i, .greeting-year i { padding: 0 8px; color: var(--gold); font-style: normal; }
.hero-copy h1 { display: flex; align-items: center; gap: 20px; margin: 0; font-weight: 400; }
.hero-number { color: var(--gold); font: 400 clamp(150px, 22vw, 300px)/.93 Georgia, "Times New Roman", serif; letter-spacing: 0; }
.hero-title { color: #fff; font-size: clamp(24px, 3.2vw, 42px); line-height: 1.55; white-space: nowrap; }
.hero-subtitle { margin: 25px 0 12px; color: rgba(255,255,255,.9); font-size: 15px; letter-spacing: 2px; }
.hero-message { color: rgba(255,255,255,.72); font-size: 14px; line-height: 2; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 29px; }
.button { display: inline-flex; min-height: 46px; align-items: center; justify-content: center; gap: 22px; padding: 0 20px; border: 1px solid transparent; font: 12px "Songti SC", "STSong", serif; text-decoration: none; transition: background .2s, color .2s, border-color .2s; cursor: pointer; }
.button-gold { color: var(--navy); background: var(--gold); }
.button-gold:hover { background: #e0c58f; }
.button-outline { border-color: rgba(255,255,255,.58); color: #fff; background: transparent; }
.button-outline:hover { border-color: var(--gold); color: var(--gold); }
.tour-message { margin: 12px 0 0; color: #e9d8b8; font-size: 12px; }
.hero-side-note { position: absolute; z-index: 1; right: 38px; top: 50%; color: rgba(255,255,255,.76); font-size: 11px; letter-spacing: 2px; writing-mode: vertical-rl; }
.scroll-cue { position: absolute; z-index: 1; bottom: 30px; left: clamp(28px, 10vw, 150px); display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,.7); font: 9px Georgia, serif; letter-spacing: 1.3px; text-decoration: none; }
.scroll-cue span { display: block; width: 35px; height: 1px; background: var(--gold); }
.hero-credit { position: absolute; z-index: 1; right: 24px; bottom: 14px; margin: 0; font: 9px Georgia, serif; }
.hero-credit a { color: rgba(255,255,255,.65); text-decoration: none; }
.section-shell { padding: clamp(76px, 10vw, 142px) clamp(24px, 10vw, 148px); }
.section-heading { max-width: 760px; margin: 0 auto 54px; text-align: center; }
.section-kicker { margin: 0 0 16px; }
.section-heading h2 { margin: 0 0 16px; color: var(--navy); font-size: clamp(30px, 4vw, 48px); font-weight: 400; line-height: 1.35; }
.section-heading h2 span { color: var(--gold); }
.section-heading > p:last-child { max-width: 580px; margin: 0 auto; color: var(--muted); font-size: 14px; line-height: 1.9; }
.history-section { background: var(--ivory); }
.history-timeline { position: relative; display: grid; max-width: 880px; gap: 0; margin: 0 auto; padding: 0; list-style: none; }
.history-timeline::before { position: absolute; top: 16px; bottom: 24px; left: 111px; width: 1px; background: rgba(201,169,110,.65); content: ""; }
.history-item { position: relative; display: grid; grid-template-columns: 90px 42px 1fr; gap: 0 22px; padding: 15px 0 23px; }
.history-year { color: var(--navy); font: 21px Georgia, serif; }
.history-marker { position: relative; z-index: 1; width: 9px; height: 9px; margin: 8px auto 0; border: 1px solid var(--gold); border-radius: 50%; background: var(--ivory); }
.history-item-current .history-marker { border-color: var(--gold); background: var(--gold); box-shadow: 0 0 0 5px rgba(201,169,110,.16); }
.history-copy h3 { margin: 0 0 6px; color: var(--navy); font-size: 17px; font-weight: 500; }
.history-copy p { margin: 0; color: var(--muted); font-size: 13px; line-height: 1.8; }
.history-note { max-width: 880px; margin: 26px auto 0; color: #918c81; font-size: 10px; text-align: right; }
.memories-section { color: #fff; background: var(--navy); }
.section-heading-light h2 { color: #fff; }
.section-heading-light > p:last-child { color: rgba(255,255,255,.64); }
.memory-grid { display: grid; max-width: 1120px; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: start; gap: 16px; margin: 0 auto; }
.memory-photo { min-width: 0; margin: 0; background: #0e1b2c; }
.memory-photo img { display: block; width: auto; max-width: 100%; max-height: 100vh; max-height: 100svh; height: auto; margin: 0 auto; object-fit: contain; background: #0e1b2c; }
.memory-photo:hover img { transform: none; }
.memory-archive img { object-position: center; filter: sepia(.12); }
.memory-photo figcaption { display: flex; flex-direction: column; gap: 5px; min-height: 78px; padding: 12px 13px; background: #0e1b2c; }
.memory-photo figcaption span { font-size: 15px; }
.memory-photo figcaption small, .memory-photo figcaption a { color: rgba(255,255,255,.72); font-size: 10px; line-height: 1.5; }
.memory-photo figcaption a { width: fit-content; text-decoration: underline; text-underline-offset: 3px; }
.memory-placeholder { position: relative; display: flex; min-height: 190px; flex-direction: column; justify-content: space-between; overflow: hidden; padding: 15px; border: 1px solid rgba(201,169,110,.36); background: linear-gradient(145deg, rgba(255,255,255,.035), transparent 65%); }
.memory-placeholder::before, .memory-placeholder::after { position: absolute; width: 100px; height: 100px; border: 1px solid rgba(201,169,110,.13); border-radius: 50%; content: ""; }
.memory-placeholder::before { right: -40px; top: -50px; }.memory-placeholder::after { right: -22px; top: -32px; }
.placeholder-index { color: var(--gold); font: 9px Georgia, serif; letter-spacing: 1.2px; }
.placeholder-seal { position: absolute; top: 26px; right: 18px; display: grid; width: 42px; height: 42px; place-content: center; border: 1px solid rgba(201,169,110,.5); color: var(--gold); font-size: 12px; line-height: 1.2; text-align: center; }
.memory-placeholder h3 { margin: 0 0 6px; color: #fff; font-size: 15px; font-weight: 400; }
.memory-placeholder p { margin: 0; color: rgba(255,255,255,.57); font-size: 10px; }
.memory-placeholder-light { color: var(--navy); background: rgba(255,255,255,.08); }
.memory-placeholder-light h3 { color: #fff; }
.memory-attribution { max-width: 1120px; margin: 12px auto 0; color: rgba(255,255,255,.5); font-size: 10px; text-align: right; }
.alumni-photo-reel { max-width: 1120px; margin: 72px auto 0; }
.reel-heading { display: flex; align-items: end; justify-content: space-between; margin-bottom: 18px; }
.reel-heading .section-kicker { margin-bottom: 8px; }
.reel-heading h3 { margin: 0; font-size: 23px; font-weight: 400; }
.reel-count { color: rgba(255,255,255,.65); font: 13px Georgia, serif; }
.reel-count i { padding: 0 6px; color: var(--gold); font-style: normal; }
.reel-frame { position: relative; display: block; height: auto; min-height: 0; overflow: visible; margin: 0; background: transparent; }
.reel-frame img { display: block; width: auto; max-width: 100%; max-height: 100vh; max-height: 100svh; height: auto; margin: 0 auto; object-fit: contain; }
.reel-frame figcaption { position: static; display: flex; justify-content: space-between; gap: 12px; padding: 12px 0 0; color: white; font-size: 13px; }
.reel-frame time { color: rgba(255,255,255,.75); font-size: 11px; }
.reel-controls { display: flex; align-items: center; gap: 16px; margin-top: 14px; }
.reel-controls button { width: 35px; height: 35px; flex: 0 0 auto; border: 1px solid rgba(255,255,255,.3); border-radius: 50%; color: #fff; background: transparent; cursor: pointer; }
.reel-controls button:hover { border-color: var(--gold); color: var(--gold); }
.reel-progress { height: 1px; flex: 1; background: rgba(255,255,255,.18); }
.reel-progress span { display: block; height: 100%; background: var(--gold); transition: width .25s ease; }
.reel-empty { max-width: 1120px; margin: 40px auto 0; color: rgba(255,255,255,.64); font-size: 12px; text-align: center; }
.reel-empty a { color: inherit; }
.alumni-section { display: grid; grid-template-columns: minmax(240px, .75fr) minmax(0, 1.25fr); align-items: center; gap: clamp(30px, 7vw, 100px); background: #fff; }
.alumni-copy .section-kicker { margin-bottom: 22px; }
.alumni-copy h2 { margin: 0 0 24px; color: var(--navy); font-size: clamp(42px, 5vw, 68px); font-weight: 400; line-height: 1.2; }
.alumni-copy h2 em { color: #9c7d4a; font-style: normal; }
.alumni-subtitle { color: var(--navy); font-size: 16px; line-height: 1.9; }
.alumni-body { max-width: 390px; color: var(--muted); font-size: 13px; line-height: 1.95; }
.text-link { display: inline-flex; gap: 16px; align-items: center; margin-top: 15px; padding-bottom: 7px; border-bottom: 1px solid var(--gold); color: var(--navy); font-size: 12px; text-decoration: none; }
.text-link span { color: #9c7d4a; }
.world-map-wrap { min-width: 0; padding: 22px 10px 12px; border-top: 1px solid #e8e1d4; border-bottom: 1px solid #e8e1d4; }
.world-map { display: block; width: 100%; height: auto; overflow: visible; }
.map-graticule path { stroke: #e9e5dc; stroke-width: 1; stroke-dasharray: 2 7; }
.land-shapes path { fill: #e7e2d7; stroke: #d7d0c2; stroke-width: 1; }
.map-routes path { stroke: var(--gold); stroke-dasharray: 4 6; stroke-width: 1.5; }
.map-city circle { fill: #fff; stroke: var(--navy); stroke-width: 2; }
.map-city text { fill: var(--navy); font: 12px "Songti SC", "STSong", serif; }
.city-guangzhou circle:first-child { fill: var(--gold); stroke: var(--gold); }
.city-guangzhou circle:nth-child(2) { fill: none; stroke: var(--gold); stroke-width: 1; opacity: .7; }
.city-guangzhou text { fill: #8b6a36; font-size: 14px; font-weight: 600; }
.map-region { fill: #a7a094; font: 9px Georgia, serif; letter-spacing: 1.5px; }
.map-caption { display: flex; justify-content: center; gap: 25px; color: var(--muted); font-size: 10px; }
.map-caption span { display: flex; align-items: center; gap: 7px; }
.map-caption i { width: 7px; height: 7px; border: 1px solid var(--navy); border-radius: 50%; }
.map-caption span:last-child i { border-color: var(--gold); background: var(--gold); }
.greetings-section { background: var(--ivory); }
.greeting-feature { position: relative; max-width: 820px; margin: 0 auto; padding: clamp(34px, 6vw, 72px); border-top: 1px solid var(--gold); border-bottom: 1px solid var(--gold); text-align: center; }
.greeting-quote { display: block; height: 50px; color: var(--gold); font: 92px/.9 Georgia, serif; }
.greeting-feature blockquote { max-width: 690px; margin: 12px auto 20px; color: var(--navy); font-size: clamp(21px, 3vw, 34px); line-height: 1.8; }
.greeting-feature > p { margin: 0; color: var(--muted); font-size: 11px; }
.greeting-year { position: absolute; right: 0; bottom: -34px; color: #9a8d75; font: 11px Georgia, serif; }
.greeting-invitation { display: flex; max-width: 820px; align-items: center; justify-content: space-between; gap: 20px; margin: 62px auto 0; }
.greeting-invitation h3 { margin: 0 0 7px; color: var(--navy); font-size: 18px; font-weight: 500; }
.greeting-invitation p { margin: 0; color: var(--muted); font-size: 12px; line-height: 1.8; }
.button-navy { flex: 0 0 auto; color: #fff; background: var(--navy); }
.button-navy:hover { background: #233b5b; }
.greeting-notice { max-width: 820px; margin: 18px auto 0; color: #6d624e; font-size: 12px; line-height: 1.8; }
.greeting-notice a { color: var(--navy); text-decoration: underline; text-underline-offset: 3px; }
.closing-section { position: relative; display: grid; min-height: 590px; min-height: min(720px, 78svh); place-items: center; overflow: hidden; color: #fff; background: var(--navy); text-align: center; }
.closing-section > img, .closing-shade { position: absolute; inset: 0; width: 100%; height: 100%; }
.closing-section > img { object-fit: cover; object-position: center 58%; }
.closing-shade { background: linear-gradient(0deg, rgba(10,20,35,.93), rgba(15,29,48,.67)); }
.closing-copy { position: relative; z-index: 1; padding: 72px 24px; }
.closing-copy .section-kicker { margin-bottom: 23px; }
.closing-copy h2 { margin: 0 0 18px; font-size: clamp(36px, 5.3vw, 68px); font-weight: 400; line-height: 1.35; }
.closing-copy > p:not(.section-kicker) { color: rgba(255,255,255,.75); font-size: 14px; }
.closing-rule { display: block; width: 42px; height: 1px; margin: 30px auto 23px; background: var(--gold); }
.closing-copy h3 { margin: 0 0 29px; color: #fff; font-size: 17px; font-weight: 400; letter-spacing: 2px; }
.closing-copy h3 i { padding: 0 5px; color: var(--gold); font-style: normal; }
.closing-link { display: inline-flex; gap: 14px; align-items: center; color: var(--gold); font-size: 12px; text-decoration: none; }
.closing-link:hover { color: #f0d7a4; }
.photo-fade-enter-active, .photo-fade-leave-active { transition: opacity .35s ease; }
.photo-fade-enter-from, .photo-fade-leave-to { opacity: 0; }
@keyframes rise-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes hero-arrive { from { transform: scale(1.025); } to { transform: scale(1); } }
@media (max-width: 900px) {
  .hero-copy { width: 82vw; padding-left: 7vw; }
  .hero-number { font-size: clamp(140px, 25vw, 240px); }
  .hero-title { font-size: clamp(22px, 3vw, 34px); }
  .hero-side-note { right: 17px; }
  .section-shell { padding-right: 7vw; padding-left: 7vw; }
  .memory-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .memory-placeholder { min-height: 180px; }
  .alumni-section { grid-template-columns: 1fr; gap: 36px; }
  .alumni-copy { max-width: 630px; }
}
@media (max-width: 600px) {
  .hero-section { min-height: min(760px, calc(100svh - 72px)); align-items: center; }
  .tour-control { top: 88px; right: 12px; min-height: 34px; padding: 0 10px; font-size: 10px; }
  .hero-image img { object-position: 55% center; }
  .hero-shade { background: linear-gradient(90deg, rgba(10,22,39,.88), rgba(13,28,47,.36)), linear-gradient(0deg, rgba(10,22,39,.65), transparent 55%); }
  .hero-copy { width: 100%; padding: 58px 22px 90px; }
  .eyebrow { max-width: 290px; font-size: 8px; letter-spacing: 1px; }
  .hero-years { font-size: 12px; }
  .hero-copy h1 { align-items: flex-end; gap: 10px; }
  .hero-number { font-size: clamp(132px, 39vw, 190px); }
  .hero-title { padding-bottom: 12px; font-size: clamp(19px, 6vw, 27px); }
  .hero-subtitle { max-width: 300px; font-size: 13px; line-height: 1.8; }
  .hero-message { font-size: 13px; }
  .hero-actions { gap: 8px; }
  .button { min-height: 42px; gap: 11px; padding: 0 13px; font-size: 11px; }
  .hero-side-note { display: none; }
  .scroll-cue { bottom: 27px; left: 22px; font-size: 8px; }
  .hero-credit { right: 12px; bottom: 7px; font-size: 7px; }
  .section-shell { padding: 76px 20px; }
  .section-heading { margin-bottom: 38px; }
  .section-heading h2 { font-size: 29px; }
  .section-heading > p:last-child { font-size: 12px; }
  .history-timeline::before { left: 68px; }
  .history-item { grid-template-columns: 55px 26px 1fr; gap: 0 10px; padding: 12px 0 20px; }
  .history-year { font-size: 17px; }
  .history-copy h3 { font-size: 14px; line-height: 1.6; }
  .history-copy p { font-size: 11px; }
  .history-note { font-size: 9px; }
  .memory-grid { grid-template-columns: 1fr; gap: 12px; }
  .memory-placeholder { min-height: 150px; padding: 10px; }
  .memory-photo figcaption { gap: 3px; min-height: 65px; padding: 10px 9px; }
  .memory-photo figcaption span { font-size: 12px; }
  .memory-photo figcaption small, .memory-photo figcaption a { font-size: 8px; }
  .placeholder-index { font-size: 7px; }
  .placeholder-seal { top: 23px; right: 10px; width: 32px; height: 32px; font-size: 10px; }
  .memory-placeholder h3 { max-width: 100px; font-size: 12px; }
  .memory-placeholder p { font-size: 9px; }
  .memory-attribution { font-size: 8px; line-height: 1.7; text-align: left; }
  .alumni-copy h2 { font-size: 46px; }
  .alumni-subtitle { font-size: 14px; }
  .alumni-body { font-size: 12px; }
  .world-map-wrap { margin: 0 -12px; padding: 12px 0; }
  .map-city text { font-size: 19px; }
  .map-region { font-size: 11px; }
  .map-caption { gap: 14px; font-size: 9px; }
  .greeting-feature { padding: 30px 15px; }
  .greeting-feature blockquote { font-size: 22px; }
  .greeting-feature > p { font-size: 10px; line-height: 1.7; }
  .greeting-invitation { align-items: flex-start; flex-direction: column; margin-top: 52px; }
  .greeting-invitation h3 { font-size: 16px; }
  .greeting-invitation p { font-size: 11px; }
  .closing-section { min-height: 570px; }
  .closing-copy h2 { font-size: 38px; }
}
@media (prefers-reduced-motion: reduce) {
  .anniversary-page *, .anniversary-page *::before, .anniversary-page *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
</style>