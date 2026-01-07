# Realistic Journey Theme Assets Specification

실사(포토리얼리스틱) 스타일 가로 스크롤 청첩장을 위한 에셋 목록입니다.

---

## 에셋 생성 가이드

### 필수 키워드

```
✅ 필수: "transparent background, PNG format"
✅ 권장: "photo realistic, high resolution, 4K"
❌ 피하기: "illustration, cartoon, anime, drawing"
```

### 파일 형식

| 용도 | 형식 | 이유 |
|------|------|------|
| 하늘/배경 | JPG | 투명 불필요, 파일 크기 절약 |
| 그 외 모든 요소 | PNG | 투명 배경 필수 |

---

## 1. 배경 레이어 (하늘)

| 파일명 | 설명 | 프롬프트 예시 |
|--------|------|--------------|
| `sky-spring.jpg` | 봄 하늘 (구름 포함) | "spring blue sky with soft white clouds, photo realistic, high resolution" |
| `sky-sunset.jpg` | 노을 하늘 | "golden hour sunset sky, orange pink gradient, photo realistic" |
| `sky-night.jpg` | 밤하늘 (별) | "night sky with stars, dark blue, photo realistic" |
| `sky-wedding.jpg` | 핑크 하늘 | "dreamy pink pastel sky, soft clouds, romantic, photo realistic" |

---

## 2. 자연 요소

> ⚠️ 모두 **투명 배경 PNG** 필수

| 파일명 | 설명 | 프롬프트 예시 |
|--------|------|--------------|
| `cherry-tree-1.png` | 벚꽃 나무 #1 | "cherry blossom tree, pink flowers, photo realistic, transparent background, PNG" |
| `cherry-tree-2.png` | 벚꽃 나무 #2 | "cherry blossom tree side view, full bloom, transparent background" |
| `autumn-tree.png` | 단풍 나무 | "autumn maple tree, orange red leaves, photo realistic, transparent background" |
| `pine-tree.png` | 소나무/상록수 | "pine tree silhouette, photo realistic, transparent background" |
| `grass-foreground.png` | 잔디 전경 | "green grass field foreground, photo realistic, transparent background" |
| `flowers-pink.png` | 핑크 꽃밭 | "pink flower field, roses and peonies, transparent background" |

---

## 3. 건물/장소

> ⚠️ 모두 **투명 배경 PNG** 필수

| 파일명 | 설명 | 프롬프트 예시 |
|--------|------|--------------|
| `cafe-building.png` | 카페 건물 | "cozy european style cafe exterior, warm lighting, transparent background" |
| `park-bench.png` | 공원 벤치 | "wooden park bench with flowers, transparent background" |
| `street-lamp.png` | 가로등 | "vintage street lamp, warm light glow, transparent background" |
| `wedding-arch.png` | 웨딩 아치 | "floral wedding arch, white roses and greenery, transparent background" |
| `wedding-venue.png` | 웨딩홀 외관 | "elegant wedding chapel exterior, white building, transparent background" |
| `beach-palm.png` | 해변 야자수 | "palm tree on beach, sunset, transparent background" |

---

## 4. 커플

> ⚠️ 모두 **투명 배경 PNG** 필수
> 💡 실루엣 스타일 권장 (실사 인물은 어색할 수 있음)

| 파일명 | 설명 | 프롬프트 예시 |
|--------|------|--------------|
| `couple-walking.png` | 걷는 커플 실루엣 | "couple walking silhouette, holding hands, transparent background" |
| `couple-proposal.png` | 프로포즈 실루엣 | "man proposing to woman silhouette, romantic, transparent background" |
| `couple-wedding-back.png` | 웨딩 커플 뒷모습 | "bride and groom back view, walking together, transparent background" |
| `couple-wedding-front.png` | 웨딩 커플 정면 | "bride and groom front view, elegant, transparent background" |

---

## 5. 파티클/소품

> ⚠️ 모두 **투명 배경 PNG** 필수
> 💡 작은 크기 (256x256 ~ 512x512)

| 파일명 | 설명 | 프롬프트 예시 |
|--------|------|--------------|
| `petal-pink.png` | 벚꽃잎 하나 | "single cherry blossom petal, pink, transparent background" |
| `leaf-autumn.png` | 낙엽 하나 | "single autumn maple leaf, orange, transparent background" |
| `snowflake.png` | 눈송이 | "snowflake, white, transparent background" |
| `confetti.png` | 컨페티/꽃가루 | "golden confetti pieces, scattered, transparent background" |
| `firefly.png` | 반딧불 | "glowing firefly, warm light, transparent background" |
| `butterfly.png` | 나비 | "butterfly, pastel colors, transparent background" |

---

## 스토리별 에셋 매핑

| 장면 (진행률) | 하늘 | 배경 요소 | 자연 요소 | 커플 | 파티클 |
|--------------|------|----------|----------|------|--------|
| **봄** (0-25%) | sky-spring | - | cherry-tree-1, cherry-tree-2, grass | couple-walking | petal-pink, butterfly |
| **만남** (25-50%) | sky-spring | cafe-building, park-bench, street-lamp | cherry-tree-1 | couple-walking | petal-pink |
| **연애** (50-70%) | sky-sunset | beach-palm | autumn-tree | couple-walking | leaf-autumn |
| **프로포즈** (70-85%) | sky-night | - | pine-tree | couple-proposal | firefly |
| **결혼** (85-100%) | sky-wedding | wedding-venue, wedding-arch | flowers-pink | couple-wedding-front | confetti |

---

## 파일 구조

```
public/
└── assets/
    └── realistic/
        ├── sky/
        │   ├── sky-spring.jpg
        │   ├── sky-sunset.jpg
        │   ├── sky-night.jpg
        │   └── sky-wedding.jpg
        │
        ├── nature/
        │   ├── cherry-tree-1.png
        │   ├── cherry-tree-2.png
        │   ├── autumn-tree.png
        │   ├── pine-tree.png
        │   ├── grass-foreground.png
        │   └── flowers-pink.png
        │
        ├── buildings/
        │   ├── cafe-building.png
        │   ├── park-bench.png
        │   ├── street-lamp.png
        │   ├── wedding-arch.png
        │   ├── wedding-venue.png
        │   └── beach-palm.png
        │
        ├── couple/
        │   ├── couple-walking.png
        │   ├── couple-proposal.png
        │   ├── couple-wedding-back.png
        │   └── couple-wedding-front.png
        │
        └── particles/
            ├── petal-pink.png
            ├── leaf-autumn.png
            ├── snowflake.png
            ├── confetti.png
            ├── firefly.png
            └── butterfly.png
```

---

## 에셋 총계

| 카테고리 | 개수 |
|----------|------|
| 하늘/배경 | 4 |
| 자연 요소 | 6 |
| 건물/장소 | 6 |
| 커플 | 4 |
| 파티클/소품 | 6 |
| **총합** | **26** |

---

## 권장 이미지 크기

| 카테고리 | 권장 크기 | 비고 |
|----------|----------|------|
| 하늘/배경 | 1920x1080 이상 | 가로로 긴 형태 |
| 나무/건물 | 1024x1024 ~ 2048x2048 | 세로로 긴 형태 |
| 커플 | 1024x1024 | 정사각형 |
| 파티클 | 256x256 ~ 512x512 | 작은 크기 |

---

## 추가 참고사항

1. **실루엣 vs 실사 인물**
   - 커플은 실루엣 스타일 권장
   - 실사 인물은 배경과 어울리지 않을 수 있음

2. **일관된 스타일**
   - 모든 에셋이 비슷한 색감/톤 유지
   - 조명 방향 일관성 (좌측 상단 광원 권장)

3. **해상도**
   - 최소 1024px 이상 권장
   - 레티나 디스플레이 대응 필요

4. **파일 최적화**
   - PNG: TinyPNG 등으로 압축
   - JPG: 품질 80-90% 권장
