import type { Lesson } from "@/lib/unit-lessons";

/** 關鍵字詳解頁（/learn/<slug>）：每頁對準一個搜尋關鍵字，詳解直接放在網頁上。 */
export type LearnPage = {
  slug: string;
  keyword: string;
  title: string;
  h1: string;
  description: string;
  level: string;
  teaches: string;
  short: { id: string; title: string };
  related: { href: string; label: string }[];
  lesson: Lesson;
  updated: string;
};

export const LEARN_PAGES: LearnPage[] = [
  {
    slug: "conditional-probability",
    keyword: "條件機率 詳解",
    title: "條件機率詳解：學測 5 題由淺到深，附貝氏定理與常見錯誤｜Saber數學",
    h1: "條件機率詳解：學測 5 題由淺到深",
    description: "條件機率怎麼算？從擲骰子、抽籤到貝氏定理與星期二男孩問題，5 題學測程度題目，網頁上直接看逐步詳解和常見錯誤。",
    level: "高中",
    teaches: "條件機率、乘法原理、貝氏定理、縮小樣本空間",
    short: { id: "iuCR9YthgjA", title: "兩顆骰子點數和 7 的機率是 1/6，不是 1/11｜學測一眼懂 #20" },
    related: [
      { href: "/units/prob", label: "排列組合與機率：5 題完整詳解" },
      { href: "/learn/vector-dot-product", label: "向量內積詳解" },
      { href: "/quiz?src=learn-condprob", label: "做 5 題小卷，看自己的弱點" },
    ],
    updated: "2026-10-22",
    lesson: {
      intro: "條件機率 $P(B\\mid A)$ 的意思是：已經知道 $A$ 發生了，在這個前提下 $B$ 發生的機率。核心公式是 $P(B\\mid A)=\\dfrac{P(A\\cap B)}{P(A)}$，也就是把樣本空間縮小成 $A$，再看裡面有多少是 $B$。下面 5 題由淺到深，後兩題是學測後段難度。",
      problems: [
        {
          title: "縮小樣本空間",
          question: "同時擲兩顆公正骰子，已知點數和為 8，求其中有一顆是 3 點的機率。",
          steps: [
            "已知和為 8，樣本空間縮小成 $(2,6),(3,5),(4,4),(5,3),(6,2)$，共 5 種，每種機率相同。",
            "其中有 3 點的是 $(3,5),(5,3)$，共 2 種。",
            "所以機率 $=\\dfrac{2}{5}$。",
          ],
          answer: "$\\dfrac{2}{5}$",
        },
        {
          title: "至少一個男孩，兩個都是男孩",
          question: "某家庭有兩個孩子，每個孩子是男孩或女孩的機率各為 $\\dfrac{1}{2}$ 且互相獨立。已知至少有一個男孩，求兩個都是男孩的機率。",
          steps: [
            "兩個孩子分老大、老二，樣本空間是 男男、男女、女男、女女，共 4 種。",
            "至少一個男孩：男男、男女、女男，共 3 種。",
            "其中兩個都是男孩只有 男男 1 種，所以機率 $=\\dfrac{1}{3}$。",
          ],
          answer: "$\\dfrac{1}{3}$",
        },
        {
          title: "抽籤不放回，已知後面的結果",
          question: "10 支籤中有 3 支有獎，甲先抽一支（不放回），乙再抽一支。已知乙抽到有獎，求甲也抽到有獎的機率。",
          steps: [
            "$P(\\text{甲獎且乙獎})=\\dfrac{3}{10}\\times\\dfrac{2}{9}=\\dfrac{1}{15}$。",
            "乙抽到有獎的機率不受先後影響：$P(\\text{乙獎})=\\dfrac{3}{10}\\times\\dfrac{2}{9}+\\dfrac{7}{10}\\times\\dfrac{3}{9}=\\dfrac{6+21}{90}=\\dfrac{3}{10}$。",
            "$P(\\text{甲獎}\\mid\\text{乙獎})=\\dfrac{1/15}{3/10}=\\dfrac{2}{9}$。",
            "直覺檢查：乙那支有獎已經確定，甲是從剩下 9 支（其中 2 支有獎）抽，所以是 $\\dfrac{2}{9}$。",
          ],
          answer: "$\\dfrac{2}{9}$",
        },
        {
          title: "貝氏定理：檢驗陽性真的有病嗎",
          question: "某疾病的盛行率是 $1\\%$。檢驗時，患者有 $90\\%$ 會呈陽性；沒有患病的人也有 $5\\%$ 會呈陽性。某人檢驗呈陽性，求他真的患病的機率。",
          steps: [
            "患病且陽性：$0.01\\times 0.9=0.009$。",
            "沒病但陽性：$0.99\\times 0.05=0.0495$。",
            "陽性的總機率：$0.009+0.0495=0.0585$。",
            "$P(\\text{患病}\\mid\\text{陽性})=\\dfrac{0.009}{0.0585}=\\dfrac{90}{585}=\\dfrac{2}{13}$，大約 $15.4\\%$。",
          ],
          answer: "$\\dfrac{2}{13}$",
        },
        {
          title: "星期二出生的男孩",
          question: "某家庭有兩個孩子，每個孩子的性別與出生是星期幾都是等可能且互相獨立。已知其中至少有一個是星期二出生的男孩，求兩個都是男孩的機率。",
          steps: [
            "每個孩子有 性別 $\\times$ 星期 $=2\\times 7=14$ 種等可能情況，兩個孩子共 $14^2=196$ 種。",
            "沒有任何星期二男孩：每個孩子有 $13$ 種，共 $13^2=169$ 種。所以至少一個星期二男孩有 $196-169=27$ 種。",
            "兩個都是男孩：每個孩子 7 種，共 $49$ 種；其中沒有星期二男孩的有 $6^2=36$ 種。所以兩男且至少一個星期二男孩有 $49-36=13$ 種。",
            "機率 $=\\dfrac{13}{27}$。",
          ],
          answer: "$\\dfrac{13}{27}$",
        },
      ],
      mistakes: [
        "把 $P(B\\mid A)$ 和 $P(A\\mid B)$ 搞混。第 4 題中「患者呈陽性的機率」是 $90\\%$，但「陽性的人是患者的機率」只有大約 $15\\%$。",
        "兩個孩子的題目沒有分老大、老二，把 男女 和 女男 當成同一種，第 2 題就會錯算成 $\\dfrac{1}{2}$。",
        "已知條件寫進分子卻忘了縮小分母。條件機率的分母永遠是已知事件 $A$ 的機率。",
        "以為抽籤順序會改變後抽者的中獎機率。不放回抽籤時，每一個人中獎的機率都相同。",
      ],
    },
  },
  {
    slug: "vector-dot-product",
    keyword: "學測 向量 內積",
    title: "向量內積詳解：學測 5 題（垂直、夾角、長度、正射影、面積）｜Saber數學",
    h1: "向量內積詳解：學測 5 題一次學會",
    description: "向量內積怎麼用？垂直求未知數、求夾角、求長度、正射影與三角形面積，5 題學測程度題目，網頁上直接看逐步詳解和常見錯誤。",
    level: "高中",
    teaches: "向量內積、垂直條件、夾角、正射影、以向量求三角形面積",
    short: { id: "qz9QK22q6y8", title: "兩個向量垂直，t 是多少？內積等於 0｜學測一眼懂 #24" },
    related: [
      { href: "/units/vector", label: "向量：免費練習題附詳解" },
      { href: "/learn/conditional-probability", label: "條件機率詳解" },
      { href: "/quiz?src=learn-vector", label: "做 5 題小卷，看自己的弱點" },
    ],
    updated: "2026-10-22",
    lesson: {
      intro: "內積有兩個算法：坐標算法 $\\vec a\\cdot\\vec b=a_1b_1+a_2b_2$，和幾何算法 $\\vec a\\cdot\\vec b=|\\vec a||\\vec b|\\cos\\theta$。兩個合起來，就能處理垂直、夾角、長度、正射影和面積。下面 5 題由淺到深。",
      problems: [
        {
          title: "垂直：內積等於 0",
          question: "已知 $\\vec a=(3,t)$，$\\vec b=(2,-6)$，且 $\\vec a\\perp\\vec b$，求 $t$。",
          steps: [
            "垂直代表內積為 0：$\\vec a\\cdot\\vec b=3\\times 2+t\\times(-6)=6-6t$。",
            "$6-6t=0$，所以 $t=1$。",
          ],
          answer: "$t=1$",
        },
        {
          title: "用內積求長度",
          question: "已知 $|\\vec a|=3$，$|\\vec b|=4$，$\\vec a$ 與 $\\vec b$ 的夾角為 $60^\\circ$，求 $\\vec a\\cdot\\vec b$ 與 $|\\vec a+\\vec b|$。",
          steps: [
            "$\\vec a\\cdot\\vec b=3\\times 4\\times\\cos 60^\\circ=12\\times\\dfrac{1}{2}=6$。",
            "長度要先平方：$|\\vec a+\\vec b|^2=|\\vec a|^2+2\\,\\vec a\\cdot\\vec b+|\\vec b|^2=9+12+16=37$。",
            "所以 $|\\vec a+\\vec b|=\\sqrt{37}$。",
          ],
          answer: "$\\vec a\\cdot\\vec b=6$，$|\\vec a+\\vec b|=\\sqrt{37}$",
        },
        {
          title: "求夾角",
          question: "已知 $\\vec a=(1,2)$，$\\vec b=(3,1)$，求兩向量的夾角 $\\theta$。",
          steps: [
            "$\\vec a\\cdot\\vec b=1\\times 3+2\\times 1=5$。",
            "$|\\vec a|=\\sqrt{1^2+2^2}=\\sqrt{5}$，$|\\vec b|=\\sqrt{3^2+1^2}=\\sqrt{10}$。",
            "$\\cos\\theta=\\dfrac{5}{\\sqrt{5}\\,\\sqrt{10}}=\\dfrac{5}{5\\sqrt{2}}=\\dfrac{1}{\\sqrt{2}}$。",
            "所以 $\\theta=45^\\circ$。",
          ],
          answer: "$45^\\circ$",
        },
        {
          title: "正射影",
          question: "已知 $\\vec a=(2,1)$，$\\vec b=(3,4)$，求 $\\vec a$ 在 $\\vec b$ 上的正射影，以及正射影的長度。",
          steps: [
            "$\\vec a\\cdot\\vec b=6+4=10$，$|\\vec b|^2=9+16=25$。",
            "正射影 $=\\dfrac{\\vec a\\cdot\\vec b}{|\\vec b|^2}\\,\\vec b=\\dfrac{10}{25}(3,4)=\\left(\\dfrac{6}{5},\\dfrac{8}{5}\\right)$。",
            "長度 $=\\dfrac{|\\vec a\\cdot\\vec b|}{|\\vec b|}=\\dfrac{10}{5}=2$。",
          ],
          answer: "正射影 $\\left(\\dfrac{6}{5},\\dfrac{8}{5}\\right)$，長度 $2$",
        },
        {
          title: "用內積求三角形面積",
          question: "坐標平面上 $A(0,0)$、$B(4,1)$、$C(1,3)$，求 $\\triangle ABC$ 的面積。",
          steps: [
            "令 $\\vec u=\\overrightarrow{AB}=(4,1)$，$\\vec v=\\overrightarrow{AC}=(1,3)$。",
            "$|\\vec u|^2=17$，$|\\vec v|^2=10$，$\\vec u\\cdot\\vec v=4+3=7$。",
            "面積 $=\\dfrac{1}{2}\\sqrt{|\\vec u|^2|\\vec v|^2-(\\vec u\\cdot\\vec v)^2}=\\dfrac{1}{2}\\sqrt{170-49}=\\dfrac{1}{2}\\sqrt{121}=\\dfrac{11}{2}$。",
            "也可以用行列式檢查：$\\dfrac{1}{2}\\left|4\\times 3-1\\times 1\\right|=\\dfrac{11}{2}$，結果相同。",
          ],
          answer: "$\\dfrac{11}{2}$",
        },
      ],
      mistakes: [
        "把 $|\\vec a+\\vec b|$ 算成 $|\\vec a|+|\\vec b|$。長度要先平方展開，中間會多出 $2\\,\\vec a\\cdot\\vec b$。",
        "內積算成向量。$\\vec a\\cdot\\vec b$ 的結果是一個數，不是向量。",
        "正射影和正射影長度搞混：正射影是向量，要乘上 $\\vec b$；長度才是 $\\dfrac{|\\vec a\\cdot\\vec b|}{|\\vec b|}$。",
        "夾角公式分母忘了開根號，直接用 $|\\vec a|^2|\\vec b|^2$。",
      ],
    },
  },
  {
    slug: "similar-triangles",
    keyword: "會考數學 相似形",
    title: "會考數學相似形詳解：5 題（平行線截比例、面積比、直角三角形、梯形）｜Saber數學",
    h1: "會考數學相似形：5 題完整詳解",
    description: "相似三角形怎麼找對應邊？平行線截比例、面積比等於相似比平方、直角三角形斜邊上的高、梯形對角線，5 題會考程度題目附逐步詳解。",
    level: "國中",
    teaches: "相似三角形、平行線截比例線段、相似比與面積比",
    short: { id: "6C3Ufsn8lKI", title: "DE 平行 BC，相似比怎麼找｜段考必錯 #4" },
    related: [
      { href: "/units/jh-circle", label: "圓（國三）：免費練習題附詳解" },
      { href: "/units/jh-mult", label: "乘法公式：免費練習題附詳解" },
      { href: "/quiz?src=learn-similar", label: "做 5 題小卷，看自己的弱點" },
    ],
    updated: "2026-10-22",
    lesson: {
      intro: "相似形的重點是先找出哪兩個三角形相似、哪些邊互相對應，再用相似比列式。邊長比等於相似比，面積比等於相似比的平方。下面 5 題由淺到深，涵蓋會考最常出的幾種題型。",
      problems: [
        {
          title: "平行線截比例：對應邊要對整條",
          question: "$\\triangle ABC$ 中，$D$ 在 $\\overline{AB}$ 上，$E$ 在 $\\overline{AC}$ 上，$\\overline{DE}\\parallel\\overline{BC}$。若 $\\overline{AD}=4$，$\\overline{DB}=2$，$\\overline{DE}=6$，求 $\\overline{BC}$。",
          steps: [
            "因為 $\\overline{DE}\\parallel\\overline{BC}$，所以 $\\triangle ADE\\sim\\triangle ABC$（AA 相似）。",
            "對應邊是 $\\overline{AD}$ 對 $\\overline{AB}$，$\\overline{AB}=4+2=6$，相似比 $=4:6=2:3$。",
            "$\\overline{DE}:\\overline{BC}=2:3$，$6:\\overline{BC}=2:3$，所以 $\\overline{BC}=9$。",
          ],
          answer: "$\\overline{BC}=9$",
        },
        {
          title: "面積比等於相似比的平方",
          question: "兩個相似三角形的對應邊長比為 $2:3$，小三角形面積為 $12$，求大三角形面積。",
          steps: [
            "面積比 $=2^2:3^2=4:9$。",
            "$12:x=4:9$，所以 $x=\\dfrac{12\\times 9}{4}=27$。",
          ],
          answer: "$27$",
        },
        {
          title: "直角三角形斜邊上的高",
          question: "$\\triangle ABC$ 中 $\\angle C=90^\\circ$，$\\overline{AC}=6$，$\\overline{BC}=8$，$\\overline{CD}\\perp\\overline{AB}$ 於 $D$。求 $\\overline{AB}$、$\\overline{CD}$ 與 $\\overline{AD}$。",
          steps: [
            "畢氏定理：$\\overline{AB}=\\sqrt{6^2+8^2}=\\sqrt{100}=10$。",
            "用兩種方法算面積：$\\dfrac{1}{2}\\times 6\\times 8=\\dfrac{1}{2}\\times 10\\times\\overline{CD}$，所以 $\\overline{CD}=\\dfrac{48}{10}=\\dfrac{24}{5}$。",
            "$\\triangle ACD\\sim\\triangle ABC$（共用 $\\angle A$，又各有一個直角），所以 $\\dfrac{\\overline{AD}}{\\overline{AC}}=\\dfrac{\\overline{AC}}{\\overline{AB}}$。",
            "$\\overline{AD}=\\dfrac{\\overline{AC}^2}{\\overline{AB}}=\\dfrac{36}{10}=\\dfrac{18}{5}$。",
          ],
          answer: "$\\overline{AB}=10$，$\\overline{CD}=\\dfrac{24}{5}$，$\\overline{AD}=\\dfrac{18}{5}$",
        },
        {
          title: "影子問題",
          question: "同一時間，身高 $160$ 公分的人影長 $2$ 公尺，一棵樹的影長 $9$ 公尺。求樹高。",
          steps: [
            "同一時間陽光角度相同，人和影子、樹和影子形成兩個相似的直角三角形。",
            "單位統一：$160$ 公分 $=1.6$ 公尺。",
            "$\\dfrac{\\text{樹高}}{9}=\\dfrac{1.6}{2}$，樹高 $=9\\times 0.8=7.2$ 公尺。",
          ],
          answer: "$7.2$ 公尺",
        },
        {
          title: "梯形對角線分出的四個三角形",
          question: "梯形 $ABCD$ 中 $\\overline{AD}\\parallel\\overline{BC}$，$\\overline{AD}=3$，$\\overline{BC}=6$，對角線交於 $O$。若 $\\triangle AOD$ 面積為 $4$，求梯形 $ABCD$ 的面積。",
          steps: [
            "$\\overline{AD}\\parallel\\overline{BC}$，所以 $\\triangle AOD\\sim\\triangle COB$，相似比 $=3:6=1:2$。",
            "面積比 $=1:4$，$\\triangle COB$ 面積 $=16$。",
            "$\\triangle AOB$ 和 $\\triangle AOD$ 同高，底邊比 $\\overline{OB}:\\overline{OD}=2:1$，所以 $\\triangle AOB$ 面積 $=8$。同理 $\\triangle COD$ 面積 $=8$。",
            "梯形面積 $=4+16+8+8=36$。",
          ],
          answer: "$36$",
        },
      ],
      mistakes: [
        "平行線截比例時拿 $\\overline{AD}:\\overline{DB}$ 當相似比。$\\triangle ADE$ 和 $\\triangle ABC$ 的對應邊是 $\\overline{AD}$ 和整條 $\\overline{AB}$。",
        "面積比直接用相似比，忘了平方。相似比 $2:3$ 時，面積比是 $4:9$。",
        "對應頂點寫錯順序。寫 $\\triangle ACD\\sim\\triangle ABC$ 時，字母順序要照對應角排。",
        "影子題單位沒統一，公分和公尺混在一起算。",
      ],
    },
  },
];

export const findLearnPage = (slug: string) => LEARN_PAGES.find((p) => p.slug === slug);
