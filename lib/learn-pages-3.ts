import type { LearnPage } from "@/lib/learn-pages";

/** 2026-10-23 第三批：learn-queue.md 剩下的 Short 一次做完（同主題合併）。內容由 promo/seo/learn3/gen.py 產生。 */
export const LEARN_PAGES_3: LearnPage[] = [
  {
    "slug": "inscribed-angle",
    "keyword": "圓周角是圓心角的一半",
    "title": "圓周角定理詳解：為什麼圓周角是圓心角的一半？5 題由淺到深｜Saber數學",
    "h1": "圓周角定理：圓周角為什麼是圓心角的一半",
    "description": "圓周角等於同弧圓心角的一半，畫兩個等腰三角形就看得懂。再延伸到直徑所對圓周角是直角、同弧圓周角相等、圓內接四邊形對角互補，5 題國三程度附詳解。",
    "level": "國中",
    "teaches": "圓心角與圓周角、直徑所對圓周角、圓內接四邊形",
    "short": {
      "id": "hgR6FqtXrQM",
      "title": "圓周角為什麼是圓心角的一半？｜國三段考一眼懂"
    },
    "related": [
      {
        "href": "/units/jh-circle",
        "label": "圓（國三）：免費練習題附詳解"
      },
      {
        "href": "/diag?src=learn-inscribed",
        "label": "免費段考弱點檢測：8 題找出最弱的單元"
      },
      {
        "href": "/learn/similar-triangles",
        "label": "會考數學相似形詳解"
      }
    ],
    "updated": "2026-10-23",
    "lesson": {
      "intro": "連接圓心 $O$ 和圓周上的點 $C$，$\\overline{OA}=\\overline{OC}=\\overline{OB}$ 都是半徑，切出兩個等腰三角形。等腰三角形的外角等於兩個底角相加，所以圓心角剛好是圓周角的兩倍。記成一句話：同一段弧，圓周角是圓心角的一半。下面 5 題由淺到深。",
      "problems": [
        {
          "title": "已知圓心角求圓周角",
          "question": "圓 $O$ 上有 $A$、$B$、$C$ 三點，$C$ 在優弧上，$\\angle AOB=100^\\circ$。求 $\\angle ACB$。",
          "steps": [
            "$\\angle ACB$ 和 $\\angle AOB$ 對同一段弧 $\\overset{\\frown}{AB}$。",
            "圓周角是圓心角的一半：$\\angle ACB=\\dfrac{100^\\circ}{2}=50^\\circ$。"
          ],
          "answer": "$50^\\circ$"
        },
        {
          "title": "直徑所對的圓周角",
          "question": "$\\overline{AB}$ 是圓 $O$ 的直徑，$C$ 是圓上另一點。求 $\\angle ACB$。",
          "steps": [
            "直徑所對的圓心角 $\\angle AOB=180^\\circ$。",
            "所以 $\\angle ACB=\\dfrac{180^\\circ}{2}=90^\\circ$。"
          ],
          "answer": "$90^\\circ$"
        },
        {
          "title": "同弧的圓周角相等",
          "question": "$C$、$D$ 在弦 $\\overline{AB}$ 的同一側圓上，$\\angle ACB=35^\\circ$。求 $\\angle ADB$ 與 $\\angle AOB$。",
          "steps": [
            "$\\angle ACB$、$\\angle ADB$ 對同一段弧，都是圓心角的一半，所以相等：$\\angle ADB=35^\\circ$。",
            "$\\angle AOB=2\\times 35^\\circ=70^\\circ$。"
          ],
          "answer": "$\\angle ADB=35^\\circ$，$\\angle AOB=70^\\circ$"
        },
        {
          "title": "圓內接四邊形",
          "question": "四邊形 $ABCD$ 內接於圓，$\\angle A=70^\\circ$。求 $\\angle C$。",
          "steps": [
            "$\\angle A$ 對弧 $BCD$，$\\angle C$ 對弧 $BAD$，兩段弧合起來是整個圓，圓心角共 $360^\\circ$。",
            "兩個圓周角加起來是 $\\dfrac{360^\\circ}{2}=180^\\circ$，所以 $\\angle C=180^\\circ-70^\\circ=110^\\circ$。"
          ],
          "answer": "$110^\\circ$"
        },
        {
          "title": "從等腰三角形倒推",
          "question": "圓 $O$ 中，$\\angle OAB=25^\\circ$，$C$ 在優弧 $AB$ 上。求 $\\angle ACB$。",
          "steps": [
            "$\\overline{OA}=\\overline{OB}$，$\\triangle OAB$ 是等腰三角形，$\\angle OBA=25^\\circ$。",
            "$\\angle AOB=180^\\circ-25^\\circ-25^\\circ=130^\\circ$。",
            "$\\angle ACB=\\dfrac{130^\\circ}{2}=65^\\circ$。"
          ],
          "answer": "$65^\\circ$"
        }
      ],
      "mistakes": [
        "把圓周角當成圓心角的兩倍。方向是反過來的：圓心角大，圓周角是它的一半。",
        "沒看清楚 $C$ 在優弧還是劣弧。$C$ 在劣弧上時，對的是另一段弧，角度是 $180^\\circ$ 減掉原本的答案。",
        "圓內接四邊形寫成「對角相等」。正確是對角互補，加起來 $180^\\circ$。"
      ]
    }
  },
  {
    "slug": "arithmetic-series",
    "keyword": "1加到100",
    "title": "1 加到 100 等於多少？等差級數公式詳解，5 題由淺到深｜Saber數學",
    "h1": "1 加到 100：等差級數公式一次看懂",
    "description": "1+2+…+100=5050，畫兩個樓梯拼成長方形就懂。推出等差級數公式（首項加末項）× 項數 ÷ 2，再練奇數和、公差 3、已知兩項求和，5 題附詳解。",
    "level": "高中",
    "teaches": "等差數列、等差級數求和",
    "short": {
      "id": "fI6JSdNi8Ko",
      "title": "1 加到 100，畫兩個樓梯就算完｜畫圖一眼懂 #19"
    },
    "related": [
      {
        "href": "/units/series",
        "label": "數列與級數：免費練習題附詳解"
      },
      {
        "href": "/diag?src=learn-series",
        "label": "免費段考弱點檢測：8 題找出最弱的單元"
      },
      {
        "href": "/learn/difference-of-squares",
        "label": "平方差公式詳解"
      }
    ],
    "updated": "2026-10-23",
    "lesson": {
      "intro": "把 $1,2,\\dots,100$ 疊成樓梯，再拿一個一模一樣的樓梯倒過來拼上去，會變成 $100\\times 101$ 的長方形。一個樓梯是它的一半，所以和是 $\\dfrac{100\\times 101}{2}=5050$。一般的等差級數也一樣：$S_n=\\dfrac{(a_1+a_n)\\,n}{2}$。下面 5 題由淺到深。",
      "problems": [
        {
          "title": "1 加到 100",
          "question": "計算 $1+2+3+\\dots+100$。",
          "steps": [
            "首項 $1$、末項 $100$、共 $100$ 項。",
            "$S=\\dfrac{(1+100)\\times 100}{2}=5050$。"
          ],
          "answer": "$5050$"
        },
        {
          "title": "奇數和",
          "question": "計算 $1+3+5+\\dots+99$。",
          "steps": [
            "項數：$\\dfrac{99-1}{2}+1=50$ 項。",
            "$S=\\dfrac{(1+99)\\times 50}{2}=2500$。"
          ],
          "answer": "$2500$"
        },
        {
          "title": "公差是 3",
          "question": "計算 $2+5+8+\\dots+59$。",
          "steps": [
            "公差 $3$，項數 $\\dfrac{59-2}{3}+1=20$。",
            "$S=\\dfrac{(2+59)\\times 20}{2}=610$。"
          ],
          "answer": "$610$"
        },
        {
          "title": "只給首項和公差",
          "question": "等差數列首項 $3$、公差 $4$，求前 $20$ 項的和。",
          "steps": [
            "第 $20$ 項：$a_{20}=3+19\\times 4=79$。",
            "$S_{20}=\\dfrac{(3+79)\\times 20}{2}=820$。"
          ],
          "answer": "$820$"
        },
        {
          "title": "已知兩項求和",
          "question": "等差數列中 $a_5=11$，$a_{12}=32$。求前 $15$ 項的和。",
          "steps": [
            "$a_{12}-a_5=7d=21$，$d=3$。",
            "$a_1=a_5-4d=11-12=-1$，$a_{15}=-1+14\\times 3=41$。",
            "$S_{15}=\\dfrac{(-1+41)\\times 15}{2}=300$。"
          ],
          "answer": "$300$"
        }
      ],
      "mistakes": [
        "項數算錯。從 $2$ 到 $59$、公差 $3$，項數是 $\\dfrac{59-2}{3}+1$，最後的 $+1$ 常漏掉。",
        "忘記除以 $2$。兩個樓梯拼成長方形，一個樓梯只有一半。",
        "第 $n$ 項寫成 $a_1+nd$。正確是 $a_n=a_1+(n-1)d$。"
      ]
    }
  },
  {
    "slug": "sine-range",
    "keyword": "sin 最大值",
    "title": "為什麼 sin 最大只到 1？單位圓看正弦的範圍，5 題最大最小值詳解｜Saber數學",
    "h1": "為什麼 sin 最大只到 1：單位圓看懂正弦的範圍",
    "description": "sinθ 是單位圓上點的 y 坐標，半徑是 1，所以 −1 ≤ sinθ ≤ 1。從這個範圍求 3sinθ+1、2−sinθ、sin²θ−2sinθ 的最大最小值，5 題附詳解。",
    "level": "高中",
    "teaches": "單位圓與正弦、三角函數的值域、最大最小值",
    "short": {
      "id": "aOO-2eJZ1jI",
      "title": "為什麼 sin 最大只到 1？｜畫圖一眼懂 #7"
    },
    "related": [
      {
        "href": "/units/trig",
        "label": "三角函數：免費練習題附詳解"
      },
      {
        "href": "/diag?src=learn-sinrange",
        "label": "免費段考弱點檢測：8 題找出最弱的單元"
      },
      {
        "href": "/learn/sin-30-degrees",
        "label": "sin30° 為什麼是 1/2"
      }
    ],
    "updated": "2026-10-23",
    "lesson": {
      "intro": "在單位圓上，角 $\\theta$ 對應的點是 $(\\cos\\theta,\\sin\\theta)$。$\\sin\\theta$ 就是這個點的高度，圓的半徑是 $1$，點最高到 $1$、最低到 $-1$，所以 $-1\\le\\sin\\theta\\le 1$。下面 5 題都從這個範圍出發。",
      "problems": [
        {
          "title": "最高點和最低點",
          "question": "求 $\\sin 90^\\circ$ 與 $\\sin 270^\\circ$。",
          "steps": [
            "$90^\\circ$ 對應單位圓最高點 $(0,1)$，所以 $\\sin 90^\\circ=1$。",
            "$270^\\circ$ 對應最低點 $(0,-1)$，所以 $\\sin 270^\\circ=-1$。"
          ],
          "answer": "$1$，$-1$"
        },
        {
          "title": "乘倍數再加常數",
          "question": "求 $y=3\\sin\\theta+1$ 的最大值與最小值。",
          "steps": [
            "$-1\\le\\sin\\theta\\le 1$，乘 $3$：$-3\\le 3\\sin\\theta\\le 3$。",
            "加 $1$：$-2\\le y\\le 4$。"
          ],
          "answer": "最大 $4$，最小 $-2$"
        },
        {
          "title": "有沒有解",
          "question": "方程式 $\\sin\\theta=2$ 有沒有實數解？$2\\sin\\theta=1$ 呢？",
          "steps": [
            "$\\sin\\theta$ 最大只到 $1$，不可能等於 $2$，所以沒有解。",
            "$2\\sin\\theta=1$ 就是 $\\sin\\theta=\\dfrac{1}{2}$，在範圍內，有解，例如 $\\theta=30^\\circ$。"
          ],
          "answer": "$\\sin\\theta=2$ 無解；$2\\sin\\theta=1$ 有解"
        },
        {
          "title": "前面是負號",
          "question": "求 $y=2-\\sin\\theta$ 的最大值與最小值，以及取到最大值時的 $\\theta$（$0^\\circ\\le\\theta<360^\\circ$）。",
          "steps": [
            "$\\sin\\theta$ 越小，$y$ 越大。$\\sin\\theta=-1$ 時 $y=3$，此時 $\\theta=270^\\circ$。",
            "$\\sin\\theta=1$ 時 $y=1$。"
          ],
          "answer": "最大 $3$（$\\theta=270^\\circ$），最小 $1$"
        },
        {
          "title": "換成二次函數",
          "question": "求 $y=\\sin^2\\theta-2\\sin\\theta$ 的最大值與最小值。",
          "steps": [
            "令 $t=\\sin\\theta$，$-1\\le t\\le 1$，$y=t^2-2t=(t-1)^2-1$。",
            "頂點在 $t=1$，剛好在範圍內，最小值 $-1$。",
            "離頂點最遠的是 $t=-1$：$y=1+2=3$，最大值 $3$。"
          ],
          "answer": "最大 $3$，最小 $-1$"
        }
      ],
      "mistakes": [
        "以為 $3\\sin\\theta$ 最大是 $1$。$\\sin\\theta$ 最大是 $1$，乘 $3$ 之後最大是 $3$。",
        "$2-\\sin\\theta$ 的最大值寫成 $\\sin\\theta=1$ 的時候。前面是減號，$\\sin\\theta$ 取最小才會讓 $y$ 最大。",
        "換成 $t$ 之後忘了 $t$ 只能在 $-1$ 到 $1$ 之間，直接拿整條拋物線的頂點或無限大當答案。"
      ]
    }
  },
  {
    "slug": "order-of-operations",
    "keyword": "-3的平方",
    "title": "−3² 是 9 還是 −9？國一四則運算順序 5 題詳解｜Saber數學",
    "h1": "−3² 是多少：國一運算順序一次看懂",
    "description": "−3² 等於 −9，(−3)² 才是 9：次方只管緊貼它的數字。再練 −12÷4×3 由左到右、混合括號與次方的計算，國一第二次段考範圍 5 題附詳解。",
    "level": "國中",
    "teaches": "負數的次方、四則運算順序、乘除由左到右",
    "short": {
      "id": "RHF4f_NM5eI",
      "title": "段考前一週，國一最常錯的一題：−3² 是多少？｜畫圖一眼懂 #13"
    },
    "related": [
      {
        "href": "/units/other",
        "label": "國中其他單元：免費練習題附詳解"
      },
      {
        "href": "/diag?src=learn-order",
        "label": "免費段考弱點檢測：8 題找出最弱的單元"
      },
      {
        "href": "https://www.youtube.com/shorts/FEqSAWa8A14",
        "label": "延伸短片：−12 ÷ 4 × 3 是 −1 還是 −9？"
      },
      {
        "href": "/learn/negative-times-negative",
        "label": "負負得正為什麼"
      }
    ],
    "updated": "2026-10-23",
    "lesson": {
      "intro": "運算順序是：先括號，再次方，再乘除，最後加減；同一層的乘除由左到右。$-3^2$ 的次方只管緊貼它的 $3$，意思是 $-(3\\times 3)=-9$。要讓負號一起平方，必須寫成 $(-3)^2=9$。下面 5 題由淺到深。",
      "problems": [
        {
          "title": "有沒有括號差很多",
          "question": "計算 $-3^2$ 與 $(-3)^2$。",
          "steps": [
            "$-3^2=-(3^2)=-9$。",
            "$(-3)^2=(-3)\\times(-3)=9$。"
          ],
          "answer": "$-9$，$9$"
        },
        {
          "title": "偶數次方和奇數次方",
          "question": "計算 $-2^4$ 與 $(-2)^3$。",
          "steps": [
            "$-2^4=-(2\\times2\\times2\\times2)=-16$。",
            "$(-2)^3=(-2)\\times(-2)\\times(-2)=-8$，三個負號相乘還是負的。"
          ],
          "answer": "$-16$，$-8$"
        },
        {
          "title": "乘除由左到右",
          "question": "計算 $-12\\div 4\\times 3$。",
          "steps": [
            "乘除同一層，由左到右：$-12\\div 4=-3$。",
            "$-3\\times 3=-9$。"
          ],
          "answer": "$-9$"
        },
        {
          "title": "次方先算",
          "question": "計算 $10-(-2)^2\\times 3$。",
          "steps": [
            "先算次方：$(-2)^2=4$。",
            "再算乘法：$4\\times 3=12$。",
            "最後 $10-12=-2$。"
          ],
          "answer": "$-2$"
        },
        {
          "title": "全部混在一起",
          "question": "計算 $-3^2\\div(-3)\\times 2-(-2)^3$。",
          "steps": [
            "次方：$-3^2=-9$，$(-2)^3=-8$。",
            "乘除由左到右：$-9\\div(-3)=3$，$3\\times 2=6$。",
            "$6-(-8)=6+8=14$。"
          ],
          "answer": "$14$"
        }
      ],
      "mistakes": [
        "把 $-3^2$ 算成 $9$。沒有括號時，負號不在次方裡面。",
        "$-12\\div 4\\times 3$ 先算 $4\\times 3$ 得到 $-1$。乘除是同一層，要由左到右。",
        "減掉負數時忘記變號：$6-(-8)$ 是 $14$，不是 $-2$。"
      ]
    }
  },
  {
    "slug": "pythagorean-identity",
    "keyword": "sin²θ+cos²θ=1",
    "title": "sin²θ+cos²θ=1 為什麼成立？單位圓一眼懂，5 題平方關係詳解｜Saber數學",
    "h1": "sin²θ+cos²θ=1：畫一個單位圓就懂",
    "description": "單位圓上的點 (cosθ, sinθ) 到圓心距離是 1，畢氏定理直接給出 sin²θ+cos²θ=1。用它由 sin 求 cos、判斷象限正負、處理 sinθ+cosθ，5 題附詳解。",
    "level": "高中",
    "teaches": "平方關係、單位圓、象限與正負號",
    "short": {
      "id": "vKLObk3PAH8",
      "title": "sin²θ+cos²θ=1｜畫圖一眼懂 #8"
    },
    "related": [
      {
        "href": "/units/trig",
        "label": "三角函數：免費練習題附詳解"
      },
      {
        "href": "/diag?src=learn-sincos1",
        "label": "免費段考弱點檢測：8 題找出最弱的單元"
      },
      {
        "href": "https://www.youtube.com/shorts/WTe0wE-x1Gg",
        "label": "延伸短片：sin²θ＋cos²θ＝1，畫一個單位圓就懂"
      },
      {
        "href": "/learn/sin-30-degrees",
        "label": "sin30° 為什麼是 1/2"
      }
    ],
    "updated": "2026-10-23",
    "lesson": {
      "intro": "單位圓上角 $\\theta$ 對應的點是 $(\\cos\\theta,\\sin\\theta)$，它到圓心的距離是半徑 $1$。從這個點往 $x$ 軸畫垂線，得到兩股 $\\cos\\theta$、$\\sin\\theta$，斜邊 $1$ 的直角三角形。畢氏定理就是 $\\sin^2\\theta+\\cos^2\\theta=1$，任何角度都成立。下面 5 題由淺到深。",
      "problems": [
        {
          "title": "銳角由 sin 求 cos",
          "question": "$\\theta$ 是銳角，$\\sin\\theta=\\dfrac{3}{5}$。求 $\\cos\\theta$。",
          "steps": [
            "$\\cos^2\\theta=1-\\left(\\dfrac{3}{5}\\right)^2=\\dfrac{16}{25}$。",
            "銳角的 $\\cos\\theta>0$，所以 $\\cos\\theta=\\dfrac{4}{5}$。"
          ],
          "answer": "$\\dfrac{4}{5}$"
        },
        {
          "title": "第二象限要看正負",
          "question": "$90^\\circ<\\theta<180^\\circ$，$\\sin\\theta=\\dfrac{5}{13}$。求 $\\cos\\theta$ 與 $\\tan\\theta$。",
          "steps": [
            "$\\cos^2\\theta=1-\\dfrac{25}{169}=\\dfrac{144}{169}$。",
            "第二象限的點在 $y$ 軸左邊，$\\cos\\theta<0$，所以 $\\cos\\theta=-\\dfrac{12}{13}$。",
            "$\\tan\\theta=\\dfrac{\\sin\\theta}{\\cos\\theta}=-\\dfrac{5}{12}$。"
          ],
          "answer": "$\\cos\\theta=-\\dfrac{12}{13}$，$\\tan\\theta=-\\dfrac{5}{12}$"
        },
        {
          "title": "由和求積",
          "question": "已知 $\\sin\\theta+\\cos\\theta=\\dfrac{1}{2}$，求 $\\sin\\theta\\cos\\theta$。",
          "steps": [
            "兩邊平方：$\\sin^2\\theta+2\\sin\\theta\\cos\\theta+\\cos^2\\theta=\\dfrac{1}{4}$。",
            "$1+2\\sin\\theta\\cos\\theta=\\dfrac{1}{4}$，所以 $\\sin\\theta\\cos\\theta=-\\dfrac{3}{8}$。"
          ],
          "answer": "$-\\dfrac{3}{8}$"
        },
        {
          "title": "配上互餘",
          "question": "計算 $\\sin^2 20^\\circ+\\sin^2 70^\\circ$。",
          "steps": [
            "$\\sin 70^\\circ=\\cos 20^\\circ$。",
            "原式 $=\\sin^2 20^\\circ+\\cos^2 20^\\circ=1$。"
          ],
          "answer": "$1$"
        },
        {
          "title": "兩個平方相加",
          "question": "化簡 $(\\sin\\theta+\\cos\\theta)^2+(\\sin\\theta-\\cos\\theta)^2$。",
          "steps": [
            "展開：$(1+2\\sin\\theta\\cos\\theta)+(1-2\\sin\\theta\\cos\\theta)$。",
            "中間項抵消，結果是 $2$。"
          ],
          "answer": "$2$"
        }
      ],
      "mistakes": [
        "開根號後忘了看象限。第二象限的 $\\cos\\theta$ 是負的。",
        "把 $\\sin^2\\theta$ 看成 $\\sin(\\theta^2)$。$\\sin^2\\theta$ 的意思是 $(\\sin\\theta)^2$。",
        "$(\\sin\\theta+\\cos\\theta)^2$ 展開漏了中間項 $2\\sin\\theta\\cos\\theta$。"
      ]
    }
  },
  {
    "slug": "perfect-square-formula",
    "keyword": "(a+b)²",
    "title": "(a+b)² 為什麼不等於 a²+b²？和的平方、差的平方 5 題詳解｜Saber數學",
    "h1": "(a+b)² 不是 a²+b²：正方形切四塊就懂",
    "description": "邊長 a+b 的正方形切成四塊：a²、b² 和兩塊 ab，所以 (a+b)²=a²+2ab+b²。再練 (2x−5)²、101² 心算、已知 a+b 與 ab 求 a²+b²，5 題國中程度附詳解。",
    "level": "國中",
    "teaches": "和的平方、差的平方、乘法公式心算",
    "short": {
      "id": "aHl2mSBsNEw",
      "title": "(a+b)² ≠ a²+b²｜畫圖一眼懂 #2"
    },
    "related": [
      {
        "href": "/units/jh-mult",
        "label": "乘法公式：免費練習題附詳解"
      },
      {
        "href": "/diag?src=learn-sqformula",
        "label": "免費段考弱點檢測：8 題找出最弱的單元"
      },
      {
        "href": "https://www.youtube.com/shorts/kVO4dSHKONE",
        "label": "延伸短片：(a+b)² 不是 a²+b²？正方形切四塊"
      },
      {
        "href": "https://www.youtube.com/shorts/3kKvHhoFmxE",
        "label": "延伸短片：(a−b)² 展開別漏項"
      },
      {
        "href": "/learn/difference-of-squares",
        "label": "平方差公式詳解"
      }
    ],
    "updated": "2026-10-23",
    "lesson": {
      "intro": "畫一個邊長 $a+b$ 的正方形，橫豎各切一刀，會分成 $a^2$、$b^2$ 兩個正方形和兩個 $ab$ 的長方形。所以 $(a+b)^2=a^2+2ab+b^2$，少了 $2ab$ 就不對。差的平方同理：$(a-b)^2=a^2-2ab+b^2$。下面 5 題由淺到深。",
      "problems": [
        {
          "title": "和的平方",
          "question": "展開 $(x+3)^2$。",
          "steps": [
            "$a=x$，$b=3$：$x^2+2\\cdot x\\cdot 3+3^2$。",
            "$=x^2+6x+9$。"
          ],
          "answer": "$x^2+6x+9$"
        },
        {
          "title": "差的平方，係數不是 1",
          "question": "展開 $(2x-5)^2$。",
          "steps": [
            "$a=2x$，$b=5$：$(2x)^2-2\\cdot 2x\\cdot 5+5^2$。",
            "$=4x^2-20x+25$。"
          ],
          "answer": "$4x^2-20x+25$"
        },
        {
          "title": "心算 101²",
          "question": "不用直式，計算 $101^2$ 與 $99^2$。",
          "steps": [
            "$101^2=(100+1)^2=10000+200+1=10201$。",
            "$99^2=(100-1)^2=10000-200+1=9801$。"
          ],
          "answer": "$10201$，$9801$"
        },
        {
          "title": "已知和與積",
          "question": "$a+b=7$，$ab=10$，求 $a^2+b^2$。",
          "steps": [
            "$(a+b)^2=a^2+2ab+b^2$，所以 $a^2+b^2=(a+b)^2-2ab$。",
            "$=49-20=29$。"
          ],
          "answer": "$29$"
        },
        {
          "title": "已知差與積",
          "question": "$a-b=3$，$ab=4$，求 $a^2+b^2$ 與 $(a+b)^2$。",
          "steps": [
            "$a^2+b^2=(a-b)^2+2ab=9+8=17$。",
            "$(a+b)^2=a^2+b^2+2ab=17+8=25$。"
          ],
          "answer": "$a^2+b^2=17$，$(a+b)^2=25$"
        }
      ],
      "mistakes": [
        "$(x+3)^2$ 寫成 $x^2+9$，漏掉中間的 $2ab$。",
        "$(2x-5)^2$ 的第一項寫成 $2x^2$。要整個 $2x$ 平方，是 $4x^2$。",
        "差的平方最後一項寫成 $-b^2$。$(-5)^2=+25$，最後一項永遠是正的。"
      ]
    }
  },
  {
    "slug": "pythagorean-theorem",
    "keyword": "勾股定理",
    "title": "勾股定理為什麼 a²+b²=c²？面積拼圖看懂，5 題畢氏定理詳解｜Saber數學",
    "h1": "勾股定理：為什麼 a²+b²=c²",
    "description": "四個一樣的直角三角形拼在大正方形裡，面積相減就得到 a²+b²=c²。再練 5-12-13、正方形對角線、梯子問題和長方體對角線，5 題國中程度附詳解。",
    "level": "國中",
    "teaches": "畢氏定理（勾股定理）、平方根應用",
    "short": {
      "id": "f47RMUhjKs8",
      "title": "勾股定理為什麼 a²+b²=c²？｜面積一眼懂｜畫圖一眼懂 #5"
    },
    "related": [
      {
        "href": "/units/other",
        "label": "國中其他單元：免費練習題附詳解"
      },
      {
        "href": "/diag?src=learn-pyth",
        "label": "免費段考弱點檢測：8 題找出最弱的單元"
      },
      {
        "href": "/learn/circle-equation",
        "label": "圓的方程式其實就是畢氏定理"
      },
      {
        "href": "/learn/similar-triangles",
        "label": "會考數學相似形詳解"
      }
    ],
    "updated": "2026-10-23",
    "lesson": {
      "intro": "把四個兩股 $a$、$b$、斜邊 $c$ 的直角三角形放進邊長 $a+b$ 的大正方形，中間剩下一個邊長 $c$ 的正方形。大正方形面積 $(a+b)^2$ 減掉四個三角形 $4\\times\\dfrac{ab}{2}=2ab$，剩 $a^2+b^2$，它就是 $c^2$。下面 5 題由淺到深。",
      "problems": [
        {
          "title": "求斜邊",
          "question": "直角三角形兩股長 $3$、$4$，求斜邊。",
          "steps": [
            "$c^2=3^2+4^2=25$。",
            "$c=5$。"
          ],
          "answer": "$5$"
        },
        {
          "title": "求一股",
          "question": "直角三角形斜邊 $13$、一股 $5$，求另一股。",
          "steps": [
            "$b^2=13^2-5^2=169-25=144$。",
            "$b=12$。"
          ],
          "answer": "$12$"
        },
        {
          "title": "正方形對角線",
          "question": "正方形邊長 $6$，求對角線長。",
          "steps": [
            "對角線把正方形切成兩股都是 $6$ 的直角三角形。",
            "$d^2=36+36=72$，$d=\\sqrt{72}=6\\sqrt{2}$。"
          ],
          "answer": "$6\\sqrt{2}$"
        },
        {
          "title": "梯子靠牆",
          "question": "長 $10$ 公尺的梯子靠在牆上，梯腳離牆 $6$ 公尺。梯子頂端離地多高？",
          "steps": [
            "牆、地面、梯子圍成直角三角形，梯子是斜邊。",
            "$h^2=10^2-6^2=64$，$h=8$。"
          ],
          "answer": "$8$ 公尺"
        },
        {
          "title": "長方體對角線",
          "question": "長方體的長、寬、高為 $3$、$4$、$12$，求它的空間對角線長。",
          "steps": [
            "先求底面對角線：$\\sqrt{3^2+4^2}=5$。",
            "底面對角線和高再構成直角三角形：$\\sqrt{5^2+12^2}=13$。"
          ],
          "answer": "$13$"
        }
      ],
      "mistakes": [
        "把斜邊放錯位置。斜邊是直角對面最長的那一邊，公式裡要放在單獨的 $c^2$。",
        "求一股時用加法：已知斜邊和一股，要用減法 $c^2-a^2$。",
        "開根號沒有化簡：$\\sqrt{72}$ 要寫成 $6\\sqrt{2}$。"
      ]
    }
  },
  {
    "slug": "sin-plus-90",
    "keyword": "sin(θ+90°)",
    "title": "sin(θ+90°)=cosθ 不用背：轉 90 度一眼懂，5 題誘導公式詳解｜Saber數學",
    "h1": "sin(θ+90°)=cosθ：單位圓轉 90 度就懂",
    "description": "單位圓上的點轉 90 度，(x, y) 變成 (−y, x)，所以 sin(θ+90°)=cosθ、cos(θ+90°)=−sinθ。再延伸到 θ+180°、θ+270°，5 題附詳解。",
    "level": "高中",
    "teaches": "誘導公式、單位圓旋轉、廣義角",
    "short": {
      "id": "UnimTBJBMbE",
      "title": "sin(θ+90°)=cosθ｜轉 90 度｜畫圖一眼懂 #1"
    },
    "related": [
      {
        "href": "/units/trig",
        "label": "三角函數：免費練習題附詳解"
      },
      {
        "href": "/diag?src=learn-sin90",
        "label": "免費段考弱點檢測：8 題找出最弱的單元"
      },
      {
        "href": "https://www.youtube.com/shorts/22lhXEI8lbw",
        "label": "延伸短片：sin(θ+90°) 根本不用背"
      },
      {
        "href": "/learn/pythagorean-identity",
        "label": "sin²θ+cos²θ=1 詳解"
      }
    ],
    "updated": "2026-10-23",
    "lesson": {
      "intro": "單位圓上角 $\\theta$ 的點是 $P(\\cos\\theta,\\sin\\theta)$。把它逆時針轉 $90^\\circ$，點 $(x,y)$ 會變成 $(-y,x)$，所以新點是 $(-\\sin\\theta,\\cos\\theta)$。讀出來就是 $\\sin(\\theta+90^\\circ)=\\cos\\theta$，$\\cos(\\theta+90^\\circ)=-\\sin\\theta$。轉 $180^\\circ$ 則是 $(x,y)\\to(-x,-y)$。下面 5 題由淺到深。",
      "problems": [
        {
          "title": "代一個角驗證",
          "question": "計算 $\\sin 120^\\circ$，並和 $\\cos 30^\\circ$ 比較。",
          "steps": [
            "$\\sin 120^\\circ=\\sin(30^\\circ+90^\\circ)=\\cos 30^\\circ$。",
            "$=\\dfrac{\\sqrt{3}}{2}$。"
          ],
          "answer": "$\\dfrac{\\sqrt{3}}{2}$，兩者相等"
        },
        {
          "title": "cos 轉 90 度",
          "question": "利用 $\\cos(\\theta+90^\\circ)=-\\sin\\theta$ 計算 $\\cos 120^\\circ$。",
          "steps": [
            "$\\cos 120^\\circ=\\cos(30^\\circ+90^\\circ)=-\\sin 30^\\circ$。",
            "$=-\\dfrac{1}{2}$。"
          ],
          "answer": "$-\\dfrac{1}{2}$"
        },
        {
          "title": "轉 180 度",
          "question": "計算 $\\sin 210^\\circ$。",
          "steps": [
            "轉 $180^\\circ$ 時點變成 $(-x,-y)$，所以 $\\sin(\\theta+180^\\circ)=-\\sin\\theta$。",
            "$\\sin 210^\\circ=-\\sin 30^\\circ=-\\dfrac{1}{2}$。"
          ],
          "answer": "$-\\dfrac{1}{2}$"
        },
        {
          "title": "化簡",
          "question": "化簡 $\\sin(\\theta+90^\\circ)+\\cos(\\theta+180^\\circ)$。",
          "steps": [
            "$\\sin(\\theta+90^\\circ)=\\cos\\theta$。",
            "$\\cos(\\theta+180^\\circ)=-\\cos\\theta$。",
            "相加得 $0$。"
          ],
          "answer": "$0$"
        },
        {
          "title": "轉 270 度",
          "question": "已知 $\\sin(\\theta+90^\\circ)=\\dfrac{1}{3}$，求 $\\sin(\\theta+270^\\circ)$。",
          "steps": [
            "$\\sin(\\theta+90^\\circ)=\\cos\\theta$，所以 $\\cos\\theta=\\dfrac{1}{3}$。",
            "$\\theta+270^\\circ=(\\theta+90^\\circ)+180^\\circ$，再轉 $180^\\circ$ 會變號。",
            "$\\sin(\\theta+270^\\circ)=-\\dfrac{1}{3}$。"
          ],
          "answer": "$-\\dfrac{1}{3}$"
        }
      ],
      "mistakes": [
        "$\\cos(\\theta+90^\\circ)$ 寫成 $\\sin\\theta$，漏了負號。轉 $90^\\circ$ 後新的 $x$ 坐標是 $-y$。",
        "把 $\\sin(\\theta+90^\\circ)$ 拆成 $\\sin\\theta+\\sin 90^\\circ$。正弦不能這樣分開加。",
        "死背口訣但象限判斷錯。畫單位圓、看點轉到哪裡最不容易錯。"
      ]
    }
  },
  {
    "slug": "negative-times-negative",
    "keyword": "負負得正",
    "title": "負負得正為什麼？反向的反向一眼懂，5 題正負數乘法詳解｜Saber數學",
    "h1": "負負得正為什麼：反向的反向就是正向",
    "description": "乘以 −1 就是在數線上轉向，轉兩次回到原方向，所以負負得正。再練三個負數相乘、(−1) 的次方、多重負號與混合計算，國一程度 5 題附詳解。",
    "level": "國中",
    "teaches": "正負數乘法、負號的個數、(−1) 的次方",
    "short": {
      "id": "-9cOY2MpDbw",
      "title": "負負得正為什麼？｜反向的反向一眼懂｜畫圖一眼懂 #3"
    },
    "related": [
      {
        "href": "/units/other",
        "label": "國中其他單元：免費練習題附詳解"
      },
      {
        "href": "/diag?src=learn-negneg",
        "label": "免費段考弱點檢測：8 題找出最弱的單元"
      },
      {
        "href": "/learn/order-of-operations",
        "label": "−3² 是多少：運算順序"
      }
    ],
    "updated": "2026-10-23",
    "lesson": {
      "intro": "在數線上，乘以正數是同方向伸縮，乘以 $-1$ 是把方向轉到另一邊。$(-3)\\times(-4)$ 是先把 $3\\times 4=12$ 轉向一次（變 $-12$），再轉向一次，又回到 $+12$。所以負號的個數決定正負：偶數個負號是正，奇數個是負。下面 5 題由淺到深。",
      "problems": [
        {
          "title": "兩個負數相乘",
          "question": "計算 $(-3)\\times(-4)$。",
          "steps": [
            "兩個負號，轉向兩次回到正的。",
            "$3\\times 4=12$，答案 $12$。"
          ],
          "answer": "$12$"
        },
        {
          "title": "三個負數相乘",
          "question": "計算 $(-2)\\times(-3)\\times(-5)$。",
          "steps": [
            "三個負號是奇數個，結果是負的。",
            "$2\\times3\\times5=30$，答案 $-30$。"
          ],
          "answer": "$-30$"
        },
        {
          "title": "(−1) 的次方",
          "question": "計算 $(-1)^{10}$ 與 $(-1)^{11}$。",
          "steps": [
            "$10$ 個 $-1$ 相乘，偶數個負號，等於 $1$。",
            "$11$ 個是奇數個，等於 $-1$。"
          ],
          "answer": "$1$，$-1$"
        },
        {
          "title": "多重負號",
          "question": "化簡 $-(-(-5))$。",
          "steps": [
            "由內往外：$-(-5)=5$。",
            "$-(5)=-5$。三個負號，結果是負的。"
          ],
          "answer": "$-5$"
        },
        {
          "title": "混合計算",
          "question": "計算 $(-2)\\times 3-(-4)\\times(-5)$。",
          "steps": [
            "先乘：$(-2)\\times 3=-6$，$(-4)\\times(-5)=20$。",
            "$-6-20=-26$。"
          ],
          "answer": "$-26$"
        }
      ],
      "mistakes": [
        "把「負負得正」用在加法：$(-3)+(-4)$ 是 $-7$，不是 $7$。",
        "三個負數相乘寫成正的。要數負號個數，奇數個就是負。",
        "$-(-4)\\times(-5)$ 先處理成 $+4\\times(-5)$ 再弄錯號。先把每個乘法算完再加減最安全。"
      ]
    }
  },
  {
    "slug": "no-solution-infinite-solutions",
    "keyword": "無解 無限多解",
    "title": "方程組無解還是無限多解？Digital SAT 與國中二元一次聯立 5 題詳解｜Saber數學",
    "h1": "方程組無解 vs 無限多解：看兩條直線就懂",
    "description": "二元一次聯立方程式就是兩條直線：平行不重合是無解，重合是無限多解，相交是恰一解。用係數比判斷，並求讓方程組無解或無限多解的 k，5 題附英文 SAT 風格與中文詳解。",
    "level": "SAT",
    "teaches": "二元一次聯立方程式、解的個數、Digital SAT Linear equations",
    "short": {
      "id": "Ty-N8AEurjI",
      "title": "無解 vs 無限多解｜Digital SAT 方程組一眼懂"
    },
    "related": [
      {
        "href": "/units/sat-algebra",
        "label": "Digital SAT 代數：免費練習題附詳解"
      },
      {
        "href": "/diag?src=learn-systems",
        "label": "免費段考弱點檢測：8 題找出最弱的單元"
      },
      {
        "href": "/learn/linear-function-slope",
        "label": "一次函數斜率詳解"
      }
    ],
    "updated": "2026-10-23",
    "lesson": {
      "intro": "每個二元一次方程式都是平面上一條直線，聯立的解就是交點。斜率不同會交於一點，恰有一解；斜率相同但截距不同是平行線，沒有交點，無解；兩式其實是同一條線，就有無限多解。用係數比判斷：$\\dfrac{a_1}{a_2}=\\dfrac{b_1}{b_2}=\\dfrac{c_1}{c_2}$ 是無限多解，前兩個相等、第三個不等是無解。下面 5 題由淺到深。",
      "problems": [
        {
          "title": "同一條線",
          "question": "判斷 $x+y=3$、$2x+2y=6$ 的解的個數。",
          "steps": [
            "第二式除以 $2$ 就是 $x+y=3$，兩式是同一條線。",
            "所以有無限多解。"
          ],
          "answer": "無限多解"
        },
        {
          "title": "平行線",
          "question": "判斷 $x+y=3$、$2x+2y=7$ 的解的個數。",
          "steps": [
            "第二式除以 $2$：$x+y=3.5$，和第一式斜率相同、截距不同。",
            "兩線平行，無解。"
          ],
          "answer": "無解"
        },
        {
          "title": "求 k 使無限多解",
          "question": "$2x+3y=5$、$4x+ky=10$ 有無限多解，求 $k$。",
          "steps": [
            "第二式要是第一式的 $2$ 倍：$4=2\\times2$，$10=2\\times5$。",
            "所以 $k=2\\times3=6$。"
          ],
          "answer": "$k=6$"
        },
        {
          "title": "求 k 使無解（SAT 風格）",
          "question": "In the system $3x-y=4$ and $kx-2y=1$, for what value of $k$ does the system have no solution?",
          "steps": [
            "第一式乘 $2$：$6x-2y=8$。",
            "$k=6$ 時第二式是 $6x-2y=1$，左邊相同、右邊 $8\\neq 1$，兩線平行，無解。"
          ],
          "answer": "$k=6$"
        },
        {
          "title": "兩個未知係數",
          "question": "$ax+2y=4$、$3x+y=b$ 有無限多解，求 $a$、$b$。",
          "steps": [
            "$y$ 的係數是 $2:1$，第一式要是第二式的 $2$ 倍。",
            "$a=2\\times 3=6$，$4=2b$，$b=2$。"
          ],
          "answer": "$a=6$，$b=2$"
        }
      ],
      "mistakes": [
        "看到係數成比例就說無限多解，沒檢查常數項。常數項不成比例是無解。",
        "把「無解」和「解是 $0$」搞混。$x=0$ 也是一個解，無解是根本找不到。",
        "求 $k$ 時只比一組係數。要讓 $x$、$y$ 兩組係數同時成比例。"
      ]
    }
  },
  {
    "slug": "linear-function-slope",
    "keyword": "一次函數斜率",
    "title": "一次函數斜率怎麼看？上升 ÷ 水平，畫一次函數 5 題詳解｜Saber數學",
    "h1": "一次函數斜率：上升除以水平一眼看懂",
    "description": "斜率就是往右走 1 格，往上走幾格：上升 ÷ 水平。學會兩點求斜率、先截距再斜率畫 y=mx+b、點斜式、三點共線和與坐標軸圍成的面積，5 題附詳解。",
    "level": "國中",
    "teaches": "一次函數、斜率、截距、畫圖",
    "short": {
      "id": "iL7K0Sr2l7A",
      "title": "一次函數斜率一眼看懂｜上升÷水平｜畫圖一眼懂 #4"
    },
    "related": [
      {
        "href": "/units/sat-algebra",
        "label": "Digital SAT 代數：免費練習題附詳解"
      },
      {
        "href": "/diag?src=learn-slope",
        "label": "免費段考弱點檢測：8 題找出最弱的單元"
      },
      {
        "href": "https://www.youtube.com/shorts/-WocCP5C-hU",
        "label": "延伸短片：畫一次函數：先截距再斜率"
      },
      {
        "href": "/learn/no-solution-infinite-solutions",
        "label": "方程組無解 vs 無限多解"
      },
      {
        "href": "/learn/tan-slope",
        "label": "tan 其實就是斜率"
      }
    ],
    "updated": "2026-10-23",
    "lesson": {
      "intro": "直線 $y=mx+b$ 中，$m$ 是斜率，$b$ 是 $y$ 截距。斜率的意思是往右走 $1$ 格，往上走 $m$ 格；兩點求斜率就是 $m=\\dfrac{y_2-y_1}{x_2-x_1}$，上升除以水平。畫圖時先在 $y$ 軸點出 $(0,b)$，再照斜率走一步，連起來就好。下面 5 題由淺到深。",
      "problems": [
        {
          "title": "兩點求斜率",
          "question": "求通過 $(1,2)$、$(3,8)$ 的直線斜率。",
          "steps": [
            "上升 $8-2=6$，水平 $3-1=2$。",
            "$m=\\dfrac{6}{2}=3$。"
          ],
          "answer": "$3$"
        },
        {
          "title": "先截距再斜率",
          "question": "畫 $y=-2x+5$：寫出 $y$ 截距、斜率，以及 $x=1$、$x=2$ 時的點。",
          "steps": [
            "$y$ 截距 $5$，先點 $(0,5)$。斜率 $-2$：往右 $1$ 格往下 $2$ 格。",
            "得到 $(1,3)$、$(2,1)$，連成直線。"
          ],
          "answer": "截距 $5$，斜率 $-2$，點 $(1,3)$、$(2,1)$"
        },
        {
          "title": "點斜式",
          "question": "斜率 $2$ 且通過 $(1,3)$ 的直線方程式。",
          "steps": [
            "$y-3=2(x-1)$。",
            "整理：$y=2x+1$。"
          ],
          "answer": "$y=2x+1$"
        },
        {
          "title": "三點共線",
          "question": "$(0,-1)$、$(4,7)$、$(2,k)$ 在同一條直線上，求 $k$。",
          "steps": [
            "$(0,-1)$ 到 $(4,7)$ 的斜率是 $\\dfrac{8}{4}=2$，直線 $y=2x-1$。",
            "$x=2$ 時 $k=2\\times2-1=3$。"
          ],
          "answer": "$k=3$"
        },
        {
          "title": "與坐標軸圍成的面積",
          "question": "直線 $y=3x-6$ 與兩坐標軸圍成的三角形面積是多少？",
          "steps": [
            "$y$ 截距 $-6$；令 $y=0$ 得 $x=2$，$x$ 截距 $2$。",
            "兩股 $2$、$6$，面積 $\\dfrac{2\\times 6}{2}=6$。"
          ],
          "answer": "$6$"
        }
      ],
      "mistakes": [
        "斜率寫成水平除以上升。是 $\\dfrac{\\Delta y}{\\Delta x}$，$y$ 的變化在分子。",
        "兩點相減的順序不一致，例如分子用 $y_2-y_1$、分母用 $x_1-x_2$，正負號就錯了。",
        "截距是負的時候面積也算成負的。面積用長度，要取正值。"
      ]
    }
  },
  {
    "slug": "combinations",
    "keyword": "5人選2人",
    "title": "5 人選 2 人是 20 種還是 10 種？排列與組合怎麼分，5 題詳解｜Saber數學",
    "h1": "5 人選 2 人：排列和組合差在哪裡",
    "description": "選班長和副班長有順序，是 5×4=20 種；只是選 2 人當代表沒有順序，要除以 2，是 10 種。用這個判斷法練握手、指定男女、至少一人和三角形個數，5 題附詳解。",
    "level": "高中",
    "teaches": "排列與組合、C 的計算、至少一個用扣除法",
    "short": {
      "id": "JCeAolxykKg",
      "title": "5 人選 2 人，是 20 種還是 10 種？｜學測一眼懂 #22"
    },
    "related": [
      {
        "href": "/units/prob",
        "label": "排列組合與機率：免費練習題附詳解"
      },
      {
        "href": "/diag?src=learn-comb",
        "label": "免費段考弱點檢測：8 題找出最弱的單元"
      },
      {
        "href": "/learn/conditional-probability",
        "label": "兩顆骰子和是 7：條件機率"
      }
    ],
    "updated": "2026-10-23",
    "lesson": {
      "intro": "判斷關鍵只有一個：交換兩個人的位置，算不算不同的結果？算不同就是排列，例如班長、副班長：$5\\times4=20$。不算不同就是組合，例如選 2 位代表，甲乙和乙甲是同一組，要除以 $2!$：$C^5_2=\\dfrac{5\\times4}{2}=10$。下面 5 題由淺到深。",
      "problems": [
        {
          "title": "有順序和沒順序",
          "question": "5 人中選出班長、副班長各一人有幾種？只選 2 位代表又有幾種？",
          "steps": [
            "班長、副班長有順序：$5\\times4=20$。",
            "代表沒有順序，每一組被算了 $2$ 次：$\\dfrac{20}{2}=10$。"
          ],
          "answer": "$20$ 種，$10$ 種"
        },
        {
          "title": "握手",
          "question": "6 個人兩兩握手一次，共握幾次？",
          "steps": [
            "一次握手是選 2 人，沒有順序。",
            "$C^6_2=\\dfrac{6\\times5}{2}=15$。"
          ],
          "answer": "$15$ 次"
        },
        {
          "title": "指定人數",
          "question": "4 男 3 女中選 3 人，恰好 1 女，有幾種？",
          "steps": [
            "女生選 1：$C^3_1=3$；男生選 2：$C^4_2=6$。",
            "$3\\times6=18$。"
          ],
          "answer": "$18$ 種"
        },
        {
          "title": "至少一女",
          "question": "4 男 3 女中選 3 人，至少 1 女，有幾種？",
          "steps": [
            "全部：$C^7_3=35$。",
            "扣掉全是男生：$C^4_3=4$。",
            "$35-4=31$。"
          ],
          "answer": "$31$ 種"
        },
        {
          "title": "三角形個數",
          "question": "平面上 8 個點，任三點不共線，可以畫出幾個三角形？",
          "steps": [
            "任選 3 點就是一個三角形，三點沒有順序。",
            "$C^8_3=\\dfrac{8\\times7\\times6}{3\\times2\\times1}=56$。"
          ],
          "answer": "$56$ 個"
        }
      ],
      "mistakes": [
        "沒有順序的題目直接用 $5\\times4$，忘了除以 $2!$。",
        "「至少 1 女」用「先選 1 女再隨便選 2 人」：$3\\times C^6_2=45$，會重複計算。用全部扣掉全男最安全。",
        "$C^8_3$ 分母只除以 $3$。要除以 $3!=6$。"
      ]
    }
  },
  {
    "slug": "sine-addition-formula",
    "keyword": "sin(A+B)",
    "title": "sin(A+B) 不等於 sinA+sinB：代 30°、60° 一眼懂，和角公式 5 題詳解｜Saber數學",
    "h1": "sin(A+B)≠sinA+sinB：和角公式詳解",
    "description": "代 A=30°、B=60° 一驗就知道 sin(A+B)≠sinA+sinB。正確的和角公式是 sin(A+B)=sinAcosB+cosAsinB，再用它求 sin75°、cos15°、反用公式和已知兩個比值求和角，5 題附詳解。",
    "level": "高中",
    "teaches": "和角公式、特殊角組合、反用公式",
    "short": {
      "id": "b0xEqB_fZC4",
      "title": "sin(A+B)≠sinA+sinB｜代 30°60°一眼懂"
    },
    "related": [
      {
        "href": "/units/trig",
        "label": "三角函數：免費練習題附詳解"
      },
      {
        "href": "/diag?src=learn-sinsum",
        "label": "免費段考弱點檢測：8 題找出最弱的單元"
      },
      {
        "href": "/learn/sin-30-degrees",
        "label": "sin30° 為什麼是 1/2"
      },
      {
        "href": "/learn/pythagorean-identity",
        "label": "sin²θ+cos²θ=1 詳解"
      }
    ],
    "updated": "2026-10-23",
    "lesson": {
      "intro": "$\\sin$ 不是一般的乘法，不能把括號拆開。代 $A=30^\\circ$、$B=60^\\circ$：$\\sin 90^\\circ=1$，可是 $\\sin 30^\\circ+\\sin 60^\\circ=\\dfrac{1+\\sqrt{3}}{2}\\approx 1.37$。正確的和角公式是 $\\sin(A+B)=\\sin A\\cos B+\\cos A\\sin B$，$\\cos(A-B)=\\cos A\\cos B+\\sin A\\sin B$。下面 5 題由淺到深。",
      "problems": [
        {
          "title": "代數字驗證",
          "question": "計算 $\\sin 30^\\circ+\\sin 60^\\circ$，並和 $\\sin 90^\\circ$ 比較。",
          "steps": [
            "$\\sin 30^\\circ+\\sin 60^\\circ=\\dfrac{1}{2}+\\dfrac{\\sqrt{3}}{2}=\\dfrac{1+\\sqrt{3}}{2}$。",
            "$\\sin 90^\\circ=1$，兩者不相等。"
          ],
          "answer": "$\\dfrac{1+\\sqrt{3}}{2}$，不等於 $1$"
        },
        {
          "title": "求 sin75°",
          "question": "利用 $75^\\circ=45^\\circ+30^\\circ$ 求 $\\sin 75^\\circ$。",
          "steps": [
            "$\\sin 75^\\circ=\\sin 45^\\circ\\cos 30^\\circ+\\cos 45^\\circ\\sin 30^\\circ$。",
            "$=\\dfrac{\\sqrt{2}}{2}\\cdot\\dfrac{\\sqrt{3}}{2}+\\dfrac{\\sqrt{2}}{2}\\cdot\\dfrac{1}{2}=\\dfrac{\\sqrt{6}+\\sqrt{2}}{4}$。"
          ],
          "answer": "$\\dfrac{\\sqrt{6}+\\sqrt{2}}{4}$"
        },
        {
          "title": "求 cos15°",
          "question": "利用 $15^\\circ=45^\\circ-30^\\circ$ 求 $\\cos 15^\\circ$。",
          "steps": [
            "$\\cos 15^\\circ=\\cos 45^\\circ\\cos 30^\\circ+\\sin 45^\\circ\\sin 30^\\circ$。",
            "$=\\dfrac{\\sqrt{6}}{4}+\\dfrac{\\sqrt{2}}{4}=\\dfrac{\\sqrt{6}+\\sqrt{2}}{4}$。"
          ],
          "answer": "$\\dfrac{\\sqrt{6}+\\sqrt{2}}{4}$"
        },
        {
          "title": "反用公式",
          "question": "計算 $\\sin 20^\\circ\\cos 40^\\circ+\\cos 20^\\circ\\sin 40^\\circ$。",
          "steps": [
            "這正好是 $\\sin(20^\\circ+40^\\circ)$ 的展開式。",
            "$=\\sin 60^\\circ=\\dfrac{\\sqrt{3}}{2}$。"
          ],
          "answer": "$\\dfrac{\\sqrt{3}}{2}$"
        },
        {
          "title": "已知兩個比值",
          "question": "$\\alpha$、$\\beta$ 都是銳角，$\\sin\\alpha=\\dfrac{3}{5}$，$\\cos\\beta=\\dfrac{5}{13}$。求 $\\sin(\\alpha+\\beta)$。",
          "steps": [
            "$\\cos\\alpha=\\dfrac{4}{5}$，$\\sin\\beta=\\dfrac{12}{13}$（銳角都取正）。",
            "$\\sin(\\alpha+\\beta)=\\dfrac{3}{5}\\cdot\\dfrac{5}{13}+\\dfrac{4}{5}\\cdot\\dfrac{12}{13}=\\dfrac{15+48}{65}=\\dfrac{63}{65}$。"
          ],
          "answer": "$\\dfrac{63}{65}$"
        }
      ],
      "mistakes": [
        "把 $\\sin(A+B)$ 拆成 $\\sin A+\\sin B$。代一組特殊角就能看出不對。",
        "$\\cos(A-B)$ 中間寫成減號。$\\cos$ 的公式符號會反過來：$\\cos(A-B)$ 中間是加號。",
        "$\\sin(A+B)$ 兩項順序寫成 $\\sin A\\sin B+\\cos A\\cos B$，這是 $\\cos(A-B)$ 的公式。"
      ]
    }
  },
  {
    "slug": "complementary-angles",
    "keyword": "sin20 cos70",
    "title": "sin 20° 為什麼等於 cos 70°？互餘角關係 5 題詳解｜Saber數學",
    "h1": "sin 20° 等於 cos 70°：互餘角一眼懂",
    "description": "直角三角形兩個銳角加起來 90°，一個角的對邊就是另一個角的鄰邊，所以 sinθ=cos(90°−θ)。練 tan35°·tan55°、sin²10°+sin²80°、sin²1° 加到 sin²89°，5 題附詳解，也適用 Digital SAT。",
    "level": "高中",
    "teaches": "互餘角關係、cofunction、平方關係",
    "short": {
      "id": "Upc7s7KlTn0",
      "title": "sin 20° 等於 cos 70°？互餘角｜畫圖一眼懂 #11"
    },
    "related": [
      {
        "href": "/units/trig",
        "label": "三角函數：免費練習題附詳解"
      },
      {
        "href": "/diag?src=learn-cofunc",
        "label": "免費段考弱點檢測：8 題找出最弱的單元"
      },
      {
        "href": "/learn/pythagorean-identity",
        "label": "sin²θ+cos²θ=1 詳解"
      },
      {
        "href": "/learn/sin-30-degrees",
        "label": "sin30° 為什麼是 1/2"
      }
    ],
    "updated": "2026-10-23",
    "lesson": {
      "intro": "直角三角形裡兩個銳角 $\\theta$ 和 $90^\\circ-\\theta$ 共用同一組邊。$\\theta$ 的對邊剛好是 $90^\\circ-\\theta$ 的鄰邊，所以 $\\sin\\theta=\\cos(90^\\circ-\\theta)$，例如 $\\sin 20^\\circ=\\cos 70^\\circ$。$\\tan$ 也一樣：$\\tan(90^\\circ-\\theta)=\\dfrac{1}{\\tan\\theta}$。下面 5 題由淺到深。",
      "problems": [
        {
          "title": "直接換",
          "question": "把 $\\sin 20^\\circ$ 寫成餘弦。",
          "steps": [
            "$20^\\circ$ 的餘角是 $70^\\circ$。",
            "$\\sin 20^\\circ=\\cos 70^\\circ$。"
          ],
          "answer": "$\\cos 70^\\circ$"
        },
        {
          "title": "解角度（SAT 風格）",
          "question": "If $\\sin\\theta=\\cos 40^\\circ$ and $0^\\circ<\\theta<90^\\circ$, what is $\\theta$?",
          "steps": [
            "$\\cos 40^\\circ=\\sin(90^\\circ-40^\\circ)=\\sin 50^\\circ$。",
            "銳角範圍內 $\\theta=50^\\circ$。"
          ],
          "answer": "$50^\\circ$"
        },
        {
          "title": "互餘配平方",
          "question": "計算 $\\sin^2 10^\\circ+\\sin^2 80^\\circ$。",
          "steps": [
            "$\\sin 80^\\circ=\\cos 10^\\circ$。",
            "原式 $=\\sin^2 10^\\circ+\\cos^2 10^\\circ=1$。"
          ],
          "answer": "$1$"
        },
        {
          "title": "tan 相乘",
          "question": "計算 $\\tan 35^\\circ\\times\\tan 55^\\circ$。",
          "steps": [
            "$\\tan 55^\\circ=\\dfrac{1}{\\tan 35^\\circ}$。",
            "相乘得 $1$。"
          ],
          "answer": "$1$"
        },
        {
          "title": "一長串相加",
          "question": "計算 $\\sin^2 1^\\circ+\\sin^2 2^\\circ+\\dots+\\sin^2 89^\\circ$。",
          "steps": [
            "$1^\\circ$ 和 $89^\\circ$ 配對：$\\sin^2 1^\\circ+\\sin^2 89^\\circ=\\sin^2 1^\\circ+\\cos^2 1^\\circ=1$。",
            "$1^\\circ$ 到 $44^\\circ$ 各配一個，共 $44$ 對，和是 $44$。",
            "剩下中間的 $\\sin^2 45^\\circ=\\dfrac{1}{2}$，總和 $44+\\dfrac{1}{2}=\\dfrac{89}{2}$。"
          ],
          "answer": "$\\dfrac{89}{2}$"
        }
      ],
      "mistakes": [
        "把互餘寫成 $\\sin\\theta=\\cos(180^\\circ-\\theta)$。互餘是加起來 $90^\\circ$。",
        "$\\tan 35^\\circ\\times\\tan 55^\\circ$ 以為要查表。互餘的兩個 $\\tan$ 互為倒數，乘起來是 $1$。",
        "一長串配對時漏掉中間的 $45^\\circ$，或把 $44$ 對算成 $45$ 對。"
      ]
    }
  },
  {
    "slug": "radian",
    "keyword": "π 等於 180 度",
    "title": "π 為什麼等於 180°？弧度 radian 一眼懂，5 題弧長扇形詳解｜Saber數學",
    "h1": "π 為什麼等於 180°：弧度一次看懂",
    "description": "1 弧度就是弧長等於半徑時的圓心角，半圓的弧長是 πr，所以 180°=π 弧度。學會度與弧度互換、弧長 rθ、扇形面積 ½r²θ，5 題附詳解，也適用 Digital SAT。",
    "level": "高中",
    "teaches": "弧度與度的換算、弧長、扇形面積",
    "short": {
      "id": "vuqpuFxZWo4",
      "title": "π 為什麼等於 180°？弧度 radian 一眼懂｜畫圖一眼懂 #14"
    },
    "related": [
      {
        "href": "/units/trig",
        "label": "三角函數：免費練習題附詳解"
      },
      {
        "href": "/diag?src=learn-radian",
        "label": "免費段考弱點檢測：8 題找出最弱的單元"
      },
      {
        "href": "/learn/inscribed-angle",
        "label": "圓周角定理詳解"
      },
      {
        "href": "/learn/sine-range",
        "label": "為什麼 sin 最大只到 1"
      }
    ],
    "updated": "2026-10-23",
    "lesson": {
      "intro": "弧度量的是「弧長是半徑的幾倍」。拿半徑那麼長的繩子沿著圓周放，對應的圓心角就是 $1$ 弧度。半圓的弧長是 $\\pi r$，放得下 $\\pi$ 條，所以 $180^\\circ=\\pi$ 弧度。有了弧度，弧長就是 $s=r\\theta$，扇形面積是 $\\dfrac{1}{2}r^2\\theta$。下面 5 題由淺到深。",
      "problems": [
        {
          "title": "度換弧度",
          "question": "把 $60^\\circ$ 和 $45^\\circ$ 換成弧度。",
          "steps": [
            "$1^\\circ=\\dfrac{\\pi}{180}$。",
            "$60^\\circ=\\dfrac{60\\pi}{180}=\\dfrac{\\pi}{3}$，$45^\\circ=\\dfrac{\\pi}{4}$。"
          ],
          "answer": "$\\dfrac{\\pi}{3}$，$\\dfrac{\\pi}{4}$"
        },
        {
          "title": "弧度換度",
          "question": "把 $\\dfrac{3\\pi}{4}$ 換成度。",
          "steps": [
            "把 $\\pi$ 換成 $180^\\circ$。",
            "$\\dfrac{3\\times 180^\\circ}{4}=135^\\circ$。"
          ],
          "answer": "$135^\\circ$"
        },
        {
          "title": "弧長",
          "question": "半徑 $6$、圓心角 $\\dfrac{\\pi}{3}$ 的弧長是多少？",
          "steps": [
            "$s=r\\theta=6\\times\\dfrac{\\pi}{3}$。",
            "$=2\\pi$。"
          ],
          "answer": "$2\\pi$"
        },
        {
          "title": "扇形面積",
          "question": "半徑 $4$、圓心角 $\\dfrac{\\pi}{2}$ 的扇形面積是多少？",
          "steps": [
            "$A=\\dfrac{1}{2}r^2\\theta=\\dfrac{1}{2}\\times16\\times\\dfrac{\\pi}{2}$。",
            "$=4\\pi$。也可以想成四分之一個圓：$\\dfrac{16\\pi}{4}=4\\pi$。"
          ],
          "answer": "$4\\pi$"
        },
        {
          "title": "由弧長求角度",
          "question": "半徑 $5$ 的圓上，一段弧長是 $10$。它的圓心角是幾弧度？約幾度？",
          "steps": [
            "$\\theta=\\dfrac{s}{r}=\\dfrac{10}{5}=2$ 弧度。",
            "$2\\times\\dfrac{180^\\circ}{\\pi}\\approx 114.6^\\circ$。"
          ],
          "answer": "$2$ 弧度，約 $114.6^\\circ$"
        }
      ],
      "mistakes": [
        "以為 $\\pi=180$。$\\pi$ 約是 $3.14$，是「半圓放得下 $\\pi$ 個半徑」，等號是 $\\pi$ 弧度 $=180^\\circ$。",
        "用度數直接代 $s=r\\theta$。這個公式只能用弧度。",
        "扇形面積忘了 $\\dfrac{1}{2}$，寫成 $r^2\\theta$。"
      ]
    }
  },
  {
    "slug": "square-root",
    "keyword": "9的平方根",
    "title": "√9 是 ±3 嗎？平方根與根號差在哪，國二 5 題詳解｜Saber數學",
    "h1": "√9 是 ±3 嗎：平方根和根號一次分清楚",
    "description": "9 的平方根有兩個：±3；但 √9 只代表正的那一個，等於 3。再練 x²=16、√((−5)²)、根號混合計算與 √((x−3)²)=|x−3|，國二程度 5 題附詳解。",
    "level": "國中",
    "teaches": "平方根、根號的定義、√(a²)=|a|",
    "short": {
      "id": "adAm75g92co",
      "title": "√9 是 ±3 嗎？｜根號一次搞懂"
    },
    "related": [
      {
        "href": "/units/other",
        "label": "國中其他單元：免費練習題附詳解"
      },
      {
        "href": "/diag?src=learn-sqrt",
        "label": "免費段考弱點檢測：8 題找出最弱的單元"
      },
      {
        "href": "https://www.youtube.com/shorts/UKPuw0CLkz8",
        "label": "延伸短片：9 的平方根是 3？很多人只寫一半"
      },
      {
        "href": "/learn/nested-radical",
        "label": "雙重根號詳解"
      }
    ],
    "updated": "2026-10-23",
    "lesson": {
      "intro": "「$9$ 的平方根」是問哪些數平方會等於 $9$：$3^2=9$，$(-3)^2=9$，所以有兩個，寫成 $\\pm 3$。符號 $\\sqrt{9}$ 則規定只取正的那一個，$\\sqrt{9}=3$。所以 $\\sqrt{a^2}$ 也不一定是 $a$，而是 $|a|$。下面 5 題由淺到深。",
      "problems": [
        {
          "title": "平方根 vs 根號",
          "question": "寫出 $9$ 的平方根，以及 $\\sqrt{9}$ 的值。",
          "steps": [
            "平方等於 $9$ 的數有 $3$ 和 $-3$，所以 $9$ 的平方根是 $\\pm 3$。",
            "$\\sqrt{9}$ 只取正的：$\\sqrt{9}=3$。"
          ],
          "answer": "$\\pm 3$；$\\sqrt{9}=3$"
        },
        {
          "title": "解方程式",
          "question": "解 $x^2=16$。",
          "steps": [
            "$x$ 是 $16$ 的平方根。",
            "$x=4$ 或 $x=-4$。"
          ],
          "answer": "$x=\\pm 4$"
        },
        {
          "title": "負數平方再開根號",
          "question": "計算 $\\sqrt{(-5)^2}$。",
          "steps": [
            "先算裡面：$(-5)^2=25$。",
            "$\\sqrt{25}=5$，根號的結果不會是負的。"
          ],
          "answer": "$5$"
        },
        {
          "title": "混合計算",
          "question": "計算 $\\sqrt{49}-\\sqrt{16}+\\sqrt{(-2)^2}$。",
          "steps": [
            "$\\sqrt{49}=7$，$\\sqrt{16}=4$，$\\sqrt{(-2)^2}=\\sqrt{4}=2$。",
            "$7-4+2=5$。"
          ],
          "answer": "$5$"
        },
        {
          "title": "代入含字母的根號",
          "question": "$x=1$ 時，$\\sqrt{(x-3)^2}$ 等於多少？",
          "steps": [
            "$\\sqrt{(x-3)^2}=|x-3|$。",
            "$x=1$ 時 $|1-3|=2$，不是 $-2$。"
          ],
          "answer": "$2$"
        }
      ],
      "mistakes": [
        "把 $\\sqrt{9}$ 寫成 $\\pm 3$。根號本身只代表正的平方根。",
        "問「$9$ 的平方根」只寫 $3$，漏了 $-3$。",
        "$\\sqrt{(x-3)^2}$ 直接寫成 $x-3$。要加絕對值，結果一定不是負的。"
      ]
    }
  },
  {
    "slug": "circle-equation",
    "keyword": "圓的方程式",
    "title": "圓的方程式其實就是畢氏定理：圓心半徑、配方 5 題詳解｜Saber數學",
    "h1": "圓的方程式：其實就是畢氏定理",
    "description": "圓上每一點到圓心距離都是 r，用畢氏定理寫出來就是 (x−h)²+(y−k)²=r²。練寫出圓方程式、配方找圓心半徑、判斷點在圓內外、已知直徑兩端點，5 題附詳解。",
    "level": "高中",
    "teaches": "圓的標準式、一般式配方、點與圓的關係",
    "short": {
      "id": "aRtrJiud38c",
      "title": "圓的方程式，其實就是畢氏定理｜畫圖一眼懂 #23"
    },
    "related": [
      {
        "href": "/units/circle-eq",
        "label": "圓方程式：免費練習題附詳解"
      },
      {
        "href": "/diag?src=learn-circle",
        "label": "免費段考弱點檢測：8 題找出最弱的單元"
      },
      {
        "href": "/learn/pythagorean-theorem",
        "label": "勾股定理詳解"
      },
      {
        "href": "/learn/perfect-square-formula",
        "label": "(a+b)² 和的平方詳解"
      }
    ],
    "updated": "2026-10-23",
    "lesson": {
      "intro": "圓心 $(h,k)$、半徑 $r$ 的圓，圓上任一點 $(x,y)$ 到圓心的水平距離是 $x-h$，垂直距離是 $y-k$，斜邊是 $r$。畢氏定理寫出來就是 $(x-h)^2+(y-k)^2=r^2$。看到展開的一般式，就配方變回這個樣子。下面 5 題由淺到深。",
      "problems": [
        {
          "title": "寫出圓方程式",
          "question": "圓心 $(2,-1)$、半徑 $3$ 的圓方程式。",
          "steps": [
            "$h=2$，$k=-1$，$r=3$。",
            "$(x-2)^2+(y+1)^2=9$。"
          ],
          "answer": "$(x-2)^2+(y+1)^2=9$"
        },
        {
          "title": "配方找圓心半徑",
          "question": "求 $x^2+y^2-4x+6y-3=0$ 的圓心與半徑。",
          "steps": [
            "$x^2-4x=(x-2)^2-4$，$y^2+6y=(y+3)^2-9$。",
            "$(x-2)^2+(y+3)^2=3+4+9=16$。",
            "圓心 $(2,-3)$，半徑 $4$。"
          ],
          "answer": "圓心 $(2,-3)$，半徑 $4$"
        },
        {
          "title": "點在圓內還是圓外",
          "question": "點 $(5,1)$ 在圓 $(x-2)^2+(y+3)^2=16$ 的內部、圓上還是外部？",
          "steps": [
            "到圓心距離平方：$(5-2)^2+(1+3)^2=9+16=25$。",
            "$25>16$，距離 $5$ 大於半徑 $4$，在圓外。"
          ],
          "answer": "圓外"
        },
        {
          "title": "已知圓心和圓上一點",
          "question": "圓心 $(1,2)$ 且通過 $(4,6)$ 的圓方程式。",
          "steps": [
            "半徑是兩點距離：$\\sqrt{3^2+4^2}=5$。",
            "$(x-1)^2+(y-2)^2=25$。"
          ],
          "answer": "$(x-1)^2+(y-2)^2=25$"
        },
        {
          "title": "已知直徑兩端點",
          "question": "以 $(-1,2)$、$(5,10)$ 為直徑兩端點的圓方程式。",
          "steps": [
            "圓心是中點：$\\left(\\dfrac{-1+5}{2},\\dfrac{2+10}{2}\\right)=(2,6)$。",
            "半徑是直徑的一半：直徑 $\\sqrt{6^2+8^2}=10$，$r=5$。",
            "$(x-2)^2+(y-6)^2=25$。"
          ],
          "answer": "$(x-2)^2+(y-6)^2=25$"
        }
      ],
      "mistakes": [
        "圓心正負號看反。$(x-2)^2+(y+1)^2=9$ 的圓心是 $(2,-1)$，不是 $(-2,1)$。",
        "右邊的 $9$ 直接當半徑。右邊是 $r^2$，半徑要開根號。",
        "配方時忘記把補上的常數移到右邊，半徑就算錯。"
      ]
    }
  },
  {
    "slug": "fraction-division",
    "keyword": "分數除法 顛倒乘",
    "title": "分數除法為什麼要顛倒相乘？除以一半等於乘兩倍，5 題詳解｜Saber數學",
    "h1": "分數除法為什麼要顛倒乘",
    "description": "3 ÷ ½ 是問 3 裡面有幾個 ½，答案是 6，正好是 3×2。所以除以一個分數就是乘它的倒數。再練分數除分數、帶分數、正負號混合和應用題，5 題附詳解。",
    "level": "國中",
    "teaches": "分數除法、倒數、帶分數與正負號",
    "short": {
      "id": "YSuaTGMw3nI",
      "title": "分數除法為什麼要顛倒乘？｜除以一半＝乘兩個"
    },
    "related": [
      {
        "href": "/units/other",
        "label": "國中其他單元：免費練習題附詳解"
      },
      {
        "href": "/diag?src=learn-fracdiv",
        "label": "免費段考弱點檢測：8 題找出最弱的單元"
      },
      {
        "href": "/learn/order-of-operations",
        "label": "−3² 是多少：運算順序"
      },
      {
        "href": "/learn/negative-times-negative",
        "label": "負負得正為什麼"
      }
    ],
    "updated": "2026-10-23",
    "lesson": {
      "intro": "除法是在問「裡面有幾個」。$3\\div\\dfrac{1}{2}$ 就是 $3$ 個披薩能切出幾個半片：每個披薩 $2$ 片，共 $6$ 片，也就是 $3\\times 2$。除以 $\\dfrac{1}{2}$ 等於乘 $2$，一般來說除以 $\\dfrac{b}{a}$ 等於乘 $\\dfrac{a}{b}$。下面 5 題由淺到深。",
      "problems": [
        {
          "title": "除以一半",
          "question": "計算 $3\\div\\dfrac{1}{2}$。",
          "steps": [
            "$\\dfrac{1}{2}$ 的倒數是 $2$。",
            "$3\\times 2=6$。"
          ],
          "answer": "$6$"
        },
        {
          "title": "分數除以分數",
          "question": "計算 $\\dfrac{2}{3}\\div\\dfrac{4}{5}$。",
          "steps": [
            "$=\\dfrac{2}{3}\\times\\dfrac{5}{4}$。",
            "$=\\dfrac{10}{12}=\\dfrac{5}{6}$。"
          ],
          "answer": "$\\dfrac{5}{6}$"
        },
        {
          "title": "帶分數",
          "question": "計算 $1\\dfrac{1}{4}\\div\\dfrac{5}{8}$。",
          "steps": [
            "先化成假分數：$1\\dfrac{1}{4}=\\dfrac{5}{4}$。",
            "$\\dfrac{5}{4}\\times\\dfrac{8}{5}=2$。"
          ],
          "answer": "$2$"
        },
        {
          "title": "正負號與乘除混合",
          "question": "計算 $\\left(-\\dfrac{3}{4}\\right)\\div\\dfrac{3}{8}\\times\\left(-\\dfrac{1}{2}\\right)$。",
          "steps": [
            "由左到右：$-\\dfrac{3}{4}\\times\\dfrac{8}{3}=-2$。",
            "$-2\\times\\left(-\\dfrac{1}{2}\\right)=1$。"
          ],
          "answer": "$1$"
        },
        {
          "title": "應用題",
          "question": "一條 $\\dfrac{3}{4}$ 公尺的緞帶，每段剪 $\\dfrac{1}{8}$ 公尺，可以剪幾段？",
          "steps": [
            "問 $\\dfrac{3}{4}$ 裡有幾個 $\\dfrac{1}{8}$：$\\dfrac{3}{4}\\div\\dfrac{1}{8}$。",
            "$=\\dfrac{3}{4}\\times 8=6$。"
          ],
          "answer": "$6$ 段"
        }
      ],
      "mistakes": [
        "把被除數也顛倒，寫成 $\\dfrac{3}{2}\\times\\dfrac{5}{4}$。只有除數（後面那個）要顛倒。",
        "帶分數沒有先化成假分數，直接把整數和分數分開除。",
        "乘除混合時先算後面的乘法。乘除要由左到右。"
      ]
    }
  },
  {
    "slug": "nested-radical",
    "keyword": "雙重根號",
    "title": "√(4−2√3) 等於多少？雙重根號大減小，高一 5 題詳解｜Saber數學",
    "h1": "雙重根號：√(4−2√3) 怎麼化簡",
    "description": "√(4−2√3) 不是 1−√3：找兩數相加 4、相乘 3，得到 (√3−1)²，開根號取大減小，答案 √3−1。再練 √(5+2√6)、√(7−4√3)、√(8+√60) 與係數不是 2 的 √(3−√5)，5 題附詳解。",
    "level": "高中",
    "teaches": "雙重根號化簡、√(a²)=|a|、乘法公式反用",
    "short": {
      "id": "BUelqX0_wxk",
      "title": "高一段考必錯：√(4−2√3) 等於多少？雙重根號大減小｜段考必錯 #1"
    },
    "related": [
      {
        "href": "/units/other",
        "label": "高中其他單元：免費練習題附詳解"
      },
      {
        "href": "/diag?src=learn-nested",
        "label": "免費段考弱點檢測：8 題找出最弱的單元"
      },
      {
        "href": "/learn/square-root",
        "label": "√9 是 ±3 嗎"
      },
      {
        "href": "/learn/perfect-square-formula",
        "label": "(a+b)² 和的平方詳解"
      }
    ],
    "updated": "2026-10-23",
    "lesson": {
      "intro": "雙重根號的關鍵是 $(\\sqrt{a}-\\sqrt{b})^2=a+b-2\\sqrt{ab}$。看到 $\\sqrt{m-2\\sqrt{n}}$，就找兩個正數相加是 $m$、相乘是 $n$。開根號時 $\\sqrt{A^2}=|A|$，結果一定是正的，所以要大減小。中間的係數不是 $2$ 時，先把它湊成 $2$。下面 5 題由淺到深。",
      "problems": [
        {
          "title": "影片原題",
          "question": "化簡 $\\sqrt{4-2\\sqrt{3}}$。",
          "steps": [
            "找兩數相加 $4$、相乘 $3$：$3$ 和 $1$。",
            "$4-2\\sqrt{3}=(\\sqrt{3}-1)^2$。",
            "$\\sqrt{3}-1>0$，所以答案是 $\\sqrt{3}-1$；寫成 $1-\\sqrt{3}\\approx-0.732$ 是負的，不可能。"
          ],
          "answer": "$\\sqrt{3}-1$"
        },
        {
          "title": "加號的情況",
          "question": "化簡 $\\sqrt{5+2\\sqrt{6}}$。",
          "steps": [
            "相加 $5$、相乘 $6$：$3$ 和 $2$。",
            "$=\\sqrt{(\\sqrt{3}+\\sqrt{2})^2}=\\sqrt{3}+\\sqrt{2}$。"
          ],
          "answer": "$\\sqrt{3}+\\sqrt{2}$"
        },
        {
          "title": "先把係數湊成 2",
          "question": "化簡 $\\sqrt{7-4\\sqrt{3}}$。",
          "steps": [
            "$4\\sqrt{3}=2\\sqrt{12}$，變成 $\\sqrt{7-2\\sqrt{12}}$。",
            "相加 $7$、相乘 $12$：$4$ 和 $3$。",
            "$=\\sqrt{4}-\\sqrt{3}=2-\\sqrt{3}$。"
          ],
          "answer": "$2-\\sqrt{3}$"
        },
        {
          "title": "根號裡沒有 2",
          "question": "化簡 $\\sqrt{8+\\sqrt{60}}$。",
          "steps": [
            "$\\sqrt{60}=2\\sqrt{15}$，變成 $\\sqrt{8+2\\sqrt{15}}$。",
            "相加 $8$、相乘 $15$：$5$ 和 $3$。",
            "$=\\sqrt{5}+\\sqrt{3}$。"
          ],
          "answer": "$\\sqrt{5}+\\sqrt{3}$"
        },
        {
          "title": "係數湊不出 2",
          "question": "化簡 $\\sqrt{3-\\sqrt{5}}$。",
          "steps": [
            "上下同乘 $2$：$\\sqrt{3-\\sqrt{5}}=\\sqrt{\\dfrac{6-2\\sqrt{5}}{2}}$。",
            "$6-2\\sqrt{5}=(\\sqrt{5}-1)^2$，所以 $=\\dfrac{\\sqrt{5}-1}{\\sqrt{2}}$。",
            "有理化：$\\dfrac{(\\sqrt{5}-1)\\sqrt{2}}{2}=\\dfrac{\\sqrt{10}-\\sqrt{2}}{2}$。"
          ],
          "answer": "$\\dfrac{\\sqrt{10}-\\sqrt{2}}{2}$"
        }
      ],
      "mistakes": [
        "寫成小減大，例如 $1-\\sqrt{3}$。根號開出來一定不是負的，要大減小。",
        "中間係數不是 $2$ 就直接找相乘的數。要先把 $4\\sqrt{3}$ 寫成 $2\\sqrt{12}$。",
        "相加、相乘找反，例如 $\\sqrt{4-2\\sqrt{3}}$ 找相加 $3$、相乘 $4$ 的數。"
      ]
    }
  },
  {
    "slug": "tan-slope",
    "keyword": "tan 是什麼",
    "title": "tan 到底是什麼？其實就是斜率，傾斜角 5 題詳解｜Saber數學",
    "h1": "tan 到底是什麼：其實就是斜率",
    "description": "直線往右走 1、往上走 tanθ，所以傾斜角 θ 的直線斜率就是 tanθ。練 45°、60°、135° 的斜率、由斜率求傾斜角、寫出直線方程式，5 題附詳解。",
    "level": "高中",
    "teaches": "正切與斜率、傾斜角、直線方程式",
    "short": {
      "id": "M2xZuWENROk",
      "title": "tan 到底是什麼？其實就是斜率｜畫圖一眼懂 #15"
    },
    "related": [
      {
        "href": "/units/trig",
        "label": "三角函數：免費練習題附詳解"
      },
      {
        "href": "/diag?src=learn-tan",
        "label": "免費段考弱點檢測：8 題找出最弱的單元"
      },
      {
        "href": "/learn/linear-function-slope",
        "label": "一次函數斜率詳解"
      },
      {
        "href": "/learn/sin-30-degrees",
        "label": "sin30° 為什麼是 1/2"
      }
    ],
    "updated": "2026-10-23",
    "lesson": {
      "intro": "$\\tan\\theta=\\dfrac{\\text{對邊}}{\\text{鄰邊}}$。把直線和 $x$ 軸的夾角 $\\theta$ 放進直角三角形：鄰邊是水平走的距離，對邊是往上升的距離，$\\dfrac{\\text{上升}}{\\text{水平}}$ 正好是斜率。所以傾斜角 $\\theta$ 的直線，斜率 $m=\\tan\\theta$。下面 5 題由淺到深。",
      "problems": [
        {
          "title": "45 度",
          "question": "通過原點、傾斜角 $45^\\circ$ 的直線斜率是多少？",
          "steps": [
            "$m=\\tan 45^\\circ$。",
            "等腰直角三角形，上升等於水平，$m=1$。"
          ],
          "answer": "$1$"
        },
        {
          "title": "60 度",
          "question": "傾斜角 $60^\\circ$ 的直線斜率是多少？",
          "steps": [
            "$m=\\tan 60^\\circ$。",
            "30-60-90 三角形中 $60^\\circ$ 的對邊 $\\sqrt{3}$、鄰邊 $1$，$m=\\sqrt{3}$。"
          ],
          "answer": "$\\sqrt{3}$"
        },
        {
          "title": "往右下的直線",
          "question": "直線 $y=-x$ 的傾斜角是多少？",
          "steps": [
            "斜率 $-1$，往右走 $1$ 往下 $1$。",
            "傾斜角在 $0^\\circ$ 到 $180^\\circ$ 之間，$\\tan 135^\\circ=-1$，所以是 $135^\\circ$。"
          ],
          "answer": "$135^\\circ$"
        },
        {
          "title": "由斜率求角度",
          "question": "斜率 $\\dfrac{\\sqrt{3}}{3}$ 的直線，傾斜角是多少？",
          "steps": [
            "$\\tan\\theta=\\dfrac{\\sqrt{3}}{3}=\\dfrac{1}{\\sqrt{3}}$。",
            "$\\theta=30^\\circ$。"
          ],
          "answer": "$30^\\circ$"
        },
        {
          "title": "寫出直線方程式",
          "question": "通過 $(1,2)$、傾斜角 $30^\\circ$ 的直線方程式。",
          "steps": [
            "斜率 $m=\\tan 30^\\circ=\\dfrac{\\sqrt{3}}{3}$。",
            "點斜式：$y-2=\\dfrac{\\sqrt{3}}{3}(x-1)$。"
          ],
          "answer": "$y-2=\\dfrac{\\sqrt{3}}{3}(x-1)$"
        }
      ],
      "mistakes": [
        "把 $\\tan$ 寫成 $\\dfrac{\\text{鄰邊}}{\\text{對邊}}$，上下顛倒。",
        "往右下的直線傾斜角寫成 $-45^\\circ$。傾斜角規定在 $0^\\circ$ 到 $180^\\circ$ 之間，是 $135^\\circ$。",
        "$\\tan 30^\\circ$ 和 $\\tan 60^\\circ$ 記反。角越大越陡，$\\tan 60^\\circ=\\sqrt{3}$ 比較大。"
      ]
    }
  },
  {
    "slug": "vector-addition",
    "keyword": "向量相加",
    "title": "向量相加怎麼算？頭接尾走兩步，學測向量 5 題詳解｜Saber數學",
    "h1": "向量相加：頭接尾走兩步就懂",
    "description": "向量相加就是先走 a 再走 b，從起點到終點的箭頭就是 a+b，坐標直接對應相加。練坐標加減、AB+BC=AC、向量長度和平行四邊形找第四點，5 題附詳解。",
    "level": "高中",
    "teaches": "向量加減法、坐標表示、向量長度、平行四邊形",
    "short": {
      "id": "20acn63eQ3U",
      "title": "向量相加，其實就是「頭接尾」走兩步｜學測一眼懂 #16"
    },
    "related": [
      {
        "href": "/units/vector",
        "label": "向量：免費練習題附詳解"
      },
      {
        "href": "/diag?src=learn-vecadd",
        "label": "免費段考弱點檢測：8 題找出最弱的單元"
      },
      {
        "href": "/learn/vector-dot-product",
        "label": "向量內積詳解"
      }
    ],
    "updated": "2026-10-23",
    "lesson": {
      "intro": "向量是「往哪個方向走多遠」。$\\vec a+\\vec b$ 就是先走 $\\vec a$，再從 $\\vec a$ 的頭接著走 $\\vec b$，最後從起點指到終點的箭頭。坐標也一樣直接相加：$(a_1,a_2)+(b_1,b_2)=(a_1+b_1,a_2+b_2)$。下面 5 題由淺到深。",
      "problems": [
        {
          "title": "坐標相加",
          "question": "$\\vec a=(2,1)$，$\\vec b=(3,4)$，求 $\\vec a+\\vec b$。",
          "steps": [
            "$x$ 加 $x$，$y$ 加 $y$。",
            "$(2+3,1+4)=(5,5)$。"
          ],
          "answer": "$(5,5)$"
        },
        {
          "title": "頭接尾",
          "question": "化簡 $\\overrightarrow{AB}+\\overrightarrow{BC}$。",
          "steps": [
            "從 $A$ 走到 $B$，再從 $B$ 走到 $C$。",
            "等於從 $A$ 直接走到 $C$：$\\overrightarrow{AC}$。"
          ],
          "answer": "$\\overrightarrow{AC}$"
        },
        {
          "title": "係數與減法",
          "question": "$\\vec a=(1,2)$，$\\vec b=(3,-1)$，求 $2\\vec a-\\vec b$。",
          "steps": [
            "$2\\vec a=(2,4)$。",
            "$2\\vec a-\\vec b=(2-3,4+1)=(-1,5)$。"
          ],
          "answer": "$(-1,5)$"
        },
        {
          "title": "相加後的長度",
          "question": "$\\vec a=(3,0)$，$\\vec b=(0,4)$，求 $|\\vec a+\\vec b|$，並和 $|\\vec a|+|\\vec b|$ 比較。",
          "steps": [
            "$\\vec a+\\vec b=(3,4)$，$|\\vec a+\\vec b|=\\sqrt{9+16}=5$。",
            "$|\\vec a|+|\\vec b|=3+4=7$，長度不能直接相加。"
          ],
          "answer": "$5$，比 $7$ 小"
        },
        {
          "title": "平行四邊形找第四點",
          "question": "平行四邊形 $ABCD$ 中，$A(1,1)$、$B(4,2)$、$D(2,4)$。求 $C$。",
          "steps": [
            "$\\overrightarrow{AC}=\\overrightarrow{AB}+\\overrightarrow{AD}=(3,1)+(1,3)=(4,4)$。",
            "$C=A+(4,4)=(5,5)$。"
          ],
          "answer": "$C(5,5)$"
        }
      ],
      "mistakes": [
        "以為 $|\\vec a+\\vec b|=|\\vec a|+|\\vec b|$。只有同方向時才相等。",
        "$\\overrightarrow{AB}$ 算成 $A-B$。正確是終點減起點：$B-A$。",
        "平行四邊形頂點順序弄錯。$ABCD$ 依序相鄰，$C$ 和 $A$ 是對角。"
      ]
    }
  },
  {
    "slug": "logarithm",
    "keyword": "log 是什麼",
    "title": "log 是什麼？只問一件事：要幾次方，學測對數 5 題詳解｜Saber數學",
    "h1": "log 只問一件事：要幾次方",
    "description": "log₂8 就是問「2 的幾次方是 8」，答案 3。用這一句話算 log₃(1/9)、log 1000、log 0.01、解 log₂x=5，再用換底公式算 log₂3·log₃8，5 題附詳解。",
    "level": "高中",
    "teaches": "對數的定義、常用對數、換底公式",
    "short": {
      "id": "sg1uRGsn_Ck",
      "title": "log 只問一件事：要幾次方？｜學測一眼懂 #18"
    },
    "related": [
      {
        "href": "/units/gsat-log",
        "label": "指數與對數（log）：免費練習題附詳解"
      },
      {
        "href": "/diag?src=learn-log",
        "label": "免費段考弱點檢測：8 題找出最弱的單元"
      },
      {
        "href": "/learn/conditional-probability",
        "label": "兩顆骰子和是 7：條件機率"
      }
    ],
    "updated": "2026-10-23",
    "lesson": {
      "intro": "$\\log_a b$ 只問一件事：$a$ 要幾次方才會變成 $b$？$2^3=8$，所以 $\\log_2 8=3$。沒寫底數的 $\\log$ 底數是 $10$。所有對數題都可以先翻回指數來想。下面 5 題由淺到深。",
      "problems": [
        {
          "title": "基本定義",
          "question": "計算 $\\log_2 8$。",
          "steps": [
            "$2$ 的幾次方是 $8$？",
            "$2^3=8$，所以 $\\log_2 8=3$。"
          ],
          "answer": "$3$"
        },
        {
          "title": "答案是負的",
          "question": "計算 $\\log_3\\dfrac{1}{9}$。",
          "steps": [
            "$\\dfrac{1}{9}=3^{-2}$。",
            "所以 $\\log_3\\dfrac{1}{9}=-2$。"
          ],
          "answer": "$-2$"
        },
        {
          "title": "常用對數",
          "question": "計算 $\\log 1000$ 與 $\\log 0.01$。",
          "steps": [
            "$1000=10^3$，$\\log 1000=3$。",
            "$0.01=10^{-2}$，$\\log 0.01=-2$。"
          ],
          "answer": "$3$，$-2$"
        },
        {
          "title": "翻回指數解方程式",
          "question": "解 $\\log_2 x=5$。",
          "steps": [
            "意思是 $2^5=x$。",
            "$x=32$。"
          ],
          "answer": "$x=32$"
        },
        {
          "title": "換底公式",
          "question": "計算 $\\log_2 3\\times\\log_3 8$。",
          "steps": [
            "換底：$\\log_2 3=\\dfrac{\\log 3}{\\log 2}$，$\\log_3 8=\\dfrac{\\log 8}{\\log 3}$。",
            "相乘：$\\dfrac{\\log 8}{\\log 2}=\\log_2 8=3$。"
          ],
          "answer": "$3$"
        }
      ],
      "mistakes": [
        "把 $\\log_2 8$ 算成 $\\dfrac{8}{2}=4$。$\\log$ 問的是次方，不是除法。",
        "以為 $\\log$ 的值不能是負的。真數小於 $1$ 時，對數是負的。",
        "$\\log_2 x=5$ 解成 $x=5^2$。底數是 $2$，要寫成 $x=2^5$。"
      ]
    }
  },
  {
    "slug": "isosceles-triangle-coordinates",
    "keyword": "115學測數A 第6題 等腰三角形",
    "title": "115 學測數A 第 6 題：等腰三角形算出 3 個答案只有 2 個，坐標幾何 5 題詳解｜Saber數學",
    "h1": "115 學測數A 第 6 題：等腰三角形為什麼只有 2 個",
    "description": "A(2,−2)、B(−1,2)，直線 y=−6 上有幾個點 C 讓 △ABC 等腰？分 CA=AB、CB=AB、CA=CB 三種情況，算出 3 個點，但其中一點與 A、B 共線，答案 2 個。附 4 題同類練習與詳解。",
    "level": "高中",
    "teaches": "坐標距離公式、等腰三角形分類討論、三點共線",
    "short": {
      "id": "q9IBNMTv35A",
      "title": "等腰三角形算出 3 個，答案只有 2 個｜115 學測數A 第6題｜學測真題 #1"
    },
    "related": [
      {
        "href": "/units/other",
        "label": "高中其他單元：免費練習題附詳解"
      },
      {
        "href": "/diag?src=learn-isosceles",
        "label": "免費段考弱點檢測：8 題找出最弱的單元"
      },
      {
        "href": "/learn/pythagorean-theorem",
        "label": "勾股定理詳解"
      },
      {
        "href": "/learn/circle-equation",
        "label": "圓的方程式詳解"
      }
    ],
    "updated": "2026-10-23",
    "lesson": {
      "intro": "等腰三角形要分三種情況：哪兩邊相等都要試，$CA=AB$、$CB=AB$、$CA=CB$。每一種用距離公式列式。最後一定要檢查：$C$ 跟 $A$、$B$ 共線的話，三點圍不出三角形，要刪掉。下面 5 題由淺到深，第 1 題就是 115 學測原題。",
      "problems": [
        {
          "title": "115 學測數A 第 6 題",
          "question": "$A(2,-2)$、$B(-1,2)$，直線 $y=-6$ 上有幾個點 $C$ 使 $\\triangle ABC$ 是等腰三角形？",
          "steps": [
            "$\\overline{AB}=\\sqrt{3^2+4^2}=5$。設 $C(x,-6)$。",
            "$CA=5$：$(x-2)^2+16=25$，$x=5$ 或 $x=-1$。",
            "$CB=5$：$B$ 到直線 $y=-6$ 的距離是 $8>5$，無解。",
            "$CA=CB$：$(x-2)^2+16=(x+1)^2+64$，$-4x+20=2x+65$，$x=-\\dfrac{15}{2}$。",
            "檢查共線：直線 $AB$ 斜率 $-\\dfrac{4}{3}$，從 $A$ 往下 $4$ 格要往右 $3$ 格，剛好是 $(5,-6)$，三點共線，刪掉。",
            "剩 $(-1,-6)$、$\\left(-\\dfrac{15}{2},-6\\right)$ 兩點。"
          ],
          "answer": "$2$ 個"
        },
        {
          "title": "只有 CA=CB",
          "question": "$A(0,0)$、$B(4,0)$，直線 $y=3$ 上哪一點 $C$ 使 $CA=CB$？",
          "steps": [
            "$CA=CB$ 表示 $C$ 在 $\\overline{AB}$ 的中垂線 $x=2$ 上。",
            "和 $y=3$ 的交點是 $(2,3)$。"
          ],
          "answer": "$(2,3)$"
        },
        {
          "title": "CA=AB",
          "question": "$A(0,0)$、$B(6,0)$，直線 $y=4$ 上哪些點 $C$ 使 $CA=AB$？",
          "steps": [
            "設 $C(x,4)$，$x^2+16=36$。",
            "$x^2=20$，$x=\\pm 2\\sqrt{5}$。"
          ],
          "answer": "$(2\\sqrt{5},4)$、$(-2\\sqrt{5},4)$"
        },
        {
          "title": "距離公式",
          "question": "求 $A(1,1)$、$B(4,5)$ 的距離。",
          "steps": [
            "水平差 $3$，垂直差 $4$。",
            "$\\sqrt{3^2+4^2}=5$。"
          ],
          "answer": "$5$"
        },
        {
          "title": "分類討論加檢查共線",
          "question": "$A(0,0)$、$B(4,0)$，直線 $y=x$ 上有幾個點 $C$ 使 $\\triangle ABC$ 是等腰三角形？",
          "steps": [
            "設 $C(t,t)$，$\\overline{AB}=4$。",
            "$CA=4$：$2t^2=16$，$t=\\pm 2\\sqrt{2}$，兩點。",
            "$CB=4$：$(t-4)^2+t^2=16$，$2t^2-8t=0$，$t=0$ 或 $t=4$。$t=0$ 就是 $A$ 本身，刪掉，留 $(4,4)$。",
            "$CA=CB$：$t=2$，得 $(2,2)$。",
            "其他點都不在 $x$ 軸上，不會和 $A$、$B$ 共線。共 $4$ 個。"
          ],
          "answer": "$4$ 個"
        }
      ],
      "mistakes": [
        "只考慮一種相等的情況。等腰要把三種「哪兩邊相等」都試過。",
        "算出點之後沒檢查共線，把壓扁的三角形也算進去。",
        "$CB=AB$ 無解時硬算出虛數或誤以為有解。先比較 $B$ 到直線的距離和 $\\overline{AB}$ 就能判斷。"
      ]
    }
  }
];
