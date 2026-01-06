# Landing Page Specification (High-End Premium)

## 1. Brand Philosophy & Concept
- **Identity**: **"The Digital Atelier"** (디지털 아틀리에)
- **Core Value**: **"Tangible Elegance"** (손에 잡힐 듯한 우아함). 디지털이지만 종이의 질감, 금박의 반짝임, 빛의 산란을 완벽하게 구현하여 아날로그의 깊이감을 선사함.
- **Target Emotion**: 선망성(Desire), 자부심(Pride), 설렘(Flutter).
  - *"여기서 만들면 하객들이 센스 있다고 하겠다."*

### 1.1. Visual Language: "Silent Luxury"
- **Color Palette**:
  - **Void Black**: `#0A0A0A` (깊이감 있는 검정, 배경)
  - **Moonlight Silver**: `#E6E6E6` (은은한 달빛 같은 텍스트)
  - **Champagne Gold**: `#D4AF37` (극소량의 포인트, 금박 효과)
  - **Paper White**: `#F2F0EB` (질감이 느껴지는 따뜻한 화이트, 카드 영역)
- **Typography**:
  - **Title**: *Playfair Display* (Italic) - 우아하고 클래식한 세리프.
  - **Subtitle**: *Cormorant Garamond* - 섬세하고 얇은 세리프.
  - **Body**: *Montserrat* - 현대적이고 절제된 산세리프 (최소한으로 사용).
- **Motion Identity**: **"Fluid & Magnetic"**. 물 흐르듯 부드럽지만, 중요한 순간에는 자석처럼 시선을 끌어당기는 묵직한 움직임.

## 2. Cinematic User Journey (Section Details)

### 2.1. Intro: The Opening (Hero Section)
- **Concept**: **"Invitation to the Premiere"**. 영화 시사회 오프닝 시퀀스.
- **Visual**:
  - 어두운 화면에서 빛줄기(Light Ray)가 서서히 들어오며 종이의 거친 질감(Texture)을 훑고 지나감.
  - 그 빛 속에서 금박으로 새겨진 "Invitation" 타이포그래피가 반짝임(WebGL Shader Effect).
- **Copy**:
  - *"Your Story, Masterfully Crafted."* (당신의 이야기, 장인의 손길로.)
  - *"결혼식의 품격은 초대장에서 시작됩니다."*
- **Interaction**: 스크롤 시 빛의 각도가 바뀌며 마치 실제 금박 카드를 손에 쥐고 기울이는 듯한 경험 제공.

### 2.2. Value Proposition: Digital Craftsmanship
- **Concept**: **"Micro-Detailing"**.
- **Layout**: 화면을 분할하여 왼쪽에는 실제 종이 청첩장, 오른쪽에는 모바일 청첩장을 배치하되, 경계가 모호하게 블렌딩.
- **Visual Strategy**:
  - **Macro Shot (초근접 촬영)**: 모바일 화면 속 폰트의 잉크 번짐 효과, 종이의 요철, 씰링 왁스의 입체감을 확대해서 보여줌.
- **Copy**: *"종이의 온기, 디지털의 영원함. 그 경계를 지우다."*

### 2.3. Showcase: The Collection (Not Templates)
- **Concept**: **"Museum Exhibition"**.
- **Layout**: 가로로 길게 이어지는 **Horizontal Gallery**.
- **Content**:
  - 디자인을 '템플릿'이라 부르지 않고 **'오브제(Objet)'** 또는 **'컬렉션'**으로 명명.
  - 예: *No.1 "Minimal Blanc"*, *No.2 "Royal Navy"*, *No.3 "Garden Whisper"*.
- **Interaction**:
  - 작품(청첩장) 가까이 마우스를 가져가면, 조명이 켜지듯 하이라이트 되며 주변이 어두워짐(Spotlight Effect).
  - 클릭 시 모달이 아닌, 화면 전체가 해당 테마의 분위기(색감, BGM)로 전환되는 **Immersive Transition**.

### 2.4. Feature: The Magic Mirror (Instant Preview)
- **Concept**: **"Fitting Room"**. 명품 옷을 시착해보는 경험.
- **UX Flow**:
  1.  고급스러운 프레임 안에 "가장 아름다운 웨딩 사진을 한 장 놓아주세요" 문구.
  2.  사진 Drop 시, 로딩 바 대신 **"재단 중(Tailoring)..."** 이라는 문구와 함께 잉크가 번지는 애니메이션.
  3.  완성 시, 3가지 무드의 컬렉션이 3D 공간에 둥둥 떠다니며 사용자 사진이 완벽하게 합성된 모습을 보여줌.
  4.  **CTA**: *"이 컬렉션으로 소장하기"*

### 2.5. Editorial: Real Stories
- **Concept**: **"Vogue Magazine Interview"**.
- **Layout**: 잡지 에디토리얼 디자인. 실제 커플의 웨딩 화보와 그들이 만든 청첩장을 교차 배치.
- **Content**:
  - *"하객들에게 가장 많이 들었던 말은 '너답다'는 것이었어요."* - Shin & Kim.
  - 단순 후기가 아닌, **스타일과 취향**에 대한 인터뷰 발췌.

### 2.6. Membership & Pricing
- **Concept**: **"Private Club Invitation"**.
- **Design**: 블랙 카드(Black Card) 느낌의 디자인.
- **Copy**: *"특별한 분들을 위한, 단 하나의 멤버십."*
- **Strategy**: 가격을 나열하기보다, **"All-Inclusive Premium"** 단일 플랜(또는 소수의 티어)으로 구성하여 고민의 여지를 줄이고 신뢰감 부여.
- **Key Benefit (Premium)**:
  - **Personalized Slug**: `blanc.kr/우리의-기록` 같이 기억하기 쉬운 고유 주소 제공.
  - **Original Quality**: 4K 영상 및 원본 화질 영구 보존.

## 3. Technical Requirements for "High-End" Feel
- **WebGL / Shaders**: (필수) 금박 효과, 종이 질감, 빛 반사(Refraction) 표현을 위해 React Three Fiber + Shaders 활용.
- **Smooth Scroll (Lenis)**: (필수) 묵직하고 부드러운 스크롤감. 스크롤 멈춤 시 미세한 관성 유지.
- **Sound Design**: (선택) 섹션 전환 시 아주 미세한 종이 넘기는 소리(ASMR)나 피아노 앰비언스 사운드.
- **Font Loading**: 폰트 로딩 시 깜빡임(FOIT) 절대 금지. 프리로딩 및 페이드인 처리.

## 4. Micro-Copy Strategy (Tone & Manner)
- **Do**: "작품", "소장", "초대", "기록", "서약", "아름다운".
- **Don't**: "기능", "템플릿", "전송", "입력", "빠른", "가성비".