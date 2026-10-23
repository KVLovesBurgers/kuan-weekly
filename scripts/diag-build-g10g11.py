"""新增 g10（高一，108 課綱第一冊）與 g11（高二，第三冊A）兩組段考弱點檢測題，併入 data/diag-questions.json。
每題：每個選項都用程式實際判斷真假，必須恰好一個為真，且與標示的正解一致。可重複執行（會先移除舊的 g10/g11）。
用法：python3 scripts/diag-build-g10g11.py
"""
import json, math, random, re
from fractions import Fraction as Fr
import sympy as sp
from sympy import Rational as R, sqrt, pi, sin, cos, atan, symbols, simplify

PATH = "data/diag-questions.json"
Q = []
REPORT = []

def add(set_, unit, stem, opts, exp):
    """opts：[(選項 tex, 程式驗算為真/假), ...]，恰好一個為真。"""
    texts = [o[0] for o in opts]
    truth = [bool(o[1]) for o in opts]
    assert len(opts) == 5, stem
    assert len(set(texts)) == 5, f"選項重複: {stem}"
    assert sum(truth) == 1, f"正解數量不是 1 ({truth}): {stem}"
    full = stem + "".join(texts) + exp
    assert not re.search(r"必考|保證|命中|元|價", full), f"禁用字: {stem}"
    correct = texts[truth.index(True)]
    rnd = random.Random(stem)
    o = texts[:]
    rnd.shuffle(o)
    qid = f"{set_}-{sum(1 for q in Q if q['set'] == set_) + 1:02d}"
    Q.append(dict(id=qid, set=set_, unit=unit, stem=stem, options=o, answer=o.index(correct) + 1, explanation=exp))
    REPORT.append((qid, unit, stem, correct, "".join("O" if t else "x" for t in truth)))

x, y = symbols("x y", real=True)

# ================= 高一（第一冊）：指數與常用對數、直線與圓 =================
s = "g10"

# 1 指數律（有理數指數）
val = R(1, 8) ** R(-2, 3) + 16 ** R(3, 4)
assert val == 12
add(s, "指數律與指數方程式", "計算 $\\left(\\dfrac{1}{8}\\right)^{-\\frac{2}{3}}+16^{\\frac{3}{4}}$ 的值。",
    [("$12$", val == 12), ("$16$", val == 16), ("$10$", val == 10), ("$\\dfrac{33}{4}$", val == R(33, 4)), ("$20$", val == 20)],
    "$\\left(\\dfrac{1}{8}\\right)^{-\\frac{2}{3}}=8^{\\frac{2}{3}}=(2^3)^{\\frac{2}{3}}=2^2=4$；$16^{\\frac{3}{4}}=(2^4)^{\\frac{3}{4}}=2^3=8$。相加得 $12$。負指數要取倒數，分數指數的分子是次方、分母是開根。")

# 2 指數方程式（換元）
t = symbols("t", positive=True)
ts = sp.solve(t**2 - 4 * t + 3, t)
xs = [sp.log(v, 3) for v in ts]
for r in xs:
    assert simplify(9**r - 4 * 3**r + 3) == 0
xsum = sum(xs)
assert sorted(xs) == [0, 1] and xsum == 1
add(s, "指數律與指數方程式", "方程式 $9^x-4\\cdot3^x+3=0$ 的所有實數解之和是多少？",
    [("$1$", xsum == 1), ("$4$", xsum == 4), ("$3$", xsum == 3), ("$0$", xsum == 0), ("$2$", xsum == 2)],
    "令 $t=3^x>0$，則 $9^x=t^2$，方程式變成 $t^2-4t+3=0$，得 $t=1$ 或 $t=3$。$3^x=1$ 得 $x=0$，$3^x=3$ 得 $x=1$，兩解之和 $1$。注意 $t$ 的兩根之和 $4$ 不是 $x$ 的和。")

# 3 常用對數：位數
l2, l3 = 0.3010, 0.4771
approx = math.floor(30 * (l2 + l3)) + 1
exact = len(str(6**30))
assert approx == exact == 24
add(s, "常用對數", "已知 $\\log 2\\approx0.3010$、$\\log 3\\approx0.4771$，則 $6^{30}$ 是幾位數？",
    [("$24$ 位", exact == 24), ("$23$ 位", exact == 23), ("$25$ 位", exact == 25), ("$31$ 位", exact == 31), ("$30$ 位", exact == 30)],
    "$\\log 6=\\log 2+\\log 3\\approx0.7781$，$\\log 6^{30}=30\\times0.7781=23.343$。首數是 $23$，所以是 $23+1=24$ 位數。")

# 4 常用對數：用 a, b 表示
a_, b_ = math.log10(2), math.log10(3)
target = math.log10(0.45)
cands = {
    "$2b-a-1$": 2 * b_ - a_ - 1,
    "$2b-a+1$": 2 * b_ - a_ + 1,
    "$2b+a-1$": 2 * b_ + a_ - 1,
    "$2b-a-2$": 2 * b_ - a_ - 2,
    "$2b+a-2$": 2 * b_ + a_ - 2,
}
add(s, "常用對數", "設 $\\log 2=a$、$\\log 3=b$，則 $\\log 0.45$ 可以表示成下列哪一個？",
    [(k, math.isclose(v, target, abs_tol=1e-12)) for k, v in cands.items()],
    "$0.45=\\dfrac{9\\times5}{100}=\\dfrac{3^2\\times10}{2\\times100}$。所以 $\\log 0.45=2\\log 3+\\log 10-\\log 2-\\log 100=2b+1-a-2=2b-a-1$。")

# 5 直線方程式：過點且垂直
# 已知直線 3x-4y+5=0（法向量 (3,-4)）；所求直線過 (2,-1) 且與它垂直 → 法向量與 (3,-4) 垂直
def perp_through(A, B, C):
    return A * 3 + B * (-4) == 0 and A * 2 + B * (-1) + C == 0
add(s, "直線方程式", "直線 $L$ 通過點 $(2,\\,-1)$，且與直線 $3x-4y+5=0$ 垂直，則 $L$ 的方程式是哪一個？",
    [("$4x+3y-5=0$", perp_through(4, 3, -5)), ("$4x-3y-11=0$", perp_through(4, -3, -11)),
     ("$3x-4y-10=0$", perp_through(3, -4, -10)), ("$3x+4y-2=0$", perp_through(3, 4, -2)), ("$4x+3y+5=0$", perp_through(4, 3, 5))],
    "$3x-4y+5=0$ 的斜率是 $\\dfrac{3}{4}$，垂直線的斜率是 $-\\dfrac{4}{3}$（倒數再變號）。過 $(2,-1)$：$y+1=-\\dfrac{4}{3}(x-2)$，整理得 $4x+3y-5=0$。$3x-4y-10=0$ 是平行線，不是垂直線。")

# 6 點到直線距離 → 平行線距離
def ks_for(dist):
    k = symbols("k", real=True)
    # 3x+4y+k=0 與 3x+4y-7=0 的距離 = |k-(-7)|/5
    return sorted(sp.solve(sp.Eq(sp.Abs(k + 7) / 5, dist), k))
ks = ks_for(4)
assert ks == [-27, 13]
ksum = sum(ks)
add(s, "點到直線距離", "直線 $3x+4y+k=0$ 與直線 $3x+4y-7=0$ 平行，且兩線的距離是 $4$，則 $k$ 所有可能值的和是多少？",
    [("$-14$", ksum == -14), ("$13$", ksum == 13), ("$14$", ksum == 14), ("$-27$", ksum == -27), ("$40$", ksum == 40)],
    "平行線 $ax+by+c_1=0$、$ax+by+c_2=0$ 的距離是 $\\dfrac{|c_1-c_2|}{\\sqrt{a^2+b^2}}$。這裡 $\\dfrac{|k+7|}{5}=4$，$k+7=\\pm20$，得 $k=13$ 或 $k=-27$（兩條都要）。和為 $13+(-27)=-14$。")

# 7 圓方程式：直徑兩端點
A, B = (1, 2), (7, 10)
mid = (R(A[0] + B[0], 2), R(A[1] + B[1], 2))
r2 = (A[0] - mid[0]) ** 2 + (A[1] - mid[1]) ** 2
assert mid == (4, 6) and r2 == 25
def circ_ok(h, k, rr):
    # 圓心在中點，且 A、B 都在圓上
    on = lambda P: (P[0] - h) ** 2 + (P[1] - k) ** 2 == rr
    return (h, k) == mid and on(A) and on(B)
add(s, "圓方程式", "坐標平面上 $A(1,\\,2)$、$B(7,\\,10)$，以 $\\overline{AB}$ 為直徑的圓，方程式是哪一個？",
    [("$(x-4)^2+(y-6)^2=25$", circ_ok(4, 6, 25)), ("$(x-4)^2+(y-6)^2=100$", circ_ok(4, 6, 100)),
     ("$(x-4)^2+(y-6)^2=5$", circ_ok(4, 6, 5)), ("$(x-3)^2+(y-4)^2=25$", circ_ok(3, 4, 25)), ("$(x+4)^2+(y+6)^2=25$", circ_ok(-4, -6, 25))],
    "圓心是 $AB$ 的中點 $\\left(\\dfrac{1+7}{2},\\dfrac{2+10}{2}\\right)=(4,6)$。$AB=\\sqrt{6^2+8^2}=10$ 是直徑，半徑 $5$，所以 $r^2=25$。圓方程式 $(x-4)^2+(y-6)^2=25$。")

# 8 圓與直線：相切
def tangent(k):
    k = sp.nsimplify(k)
    circle = x**2 + y**2 - 2 * x + 4 * y - 4
    ysub = (k - 3 * x) / 4
    poly = sp.Poly(sp.expand(circle.subs(y, ysub)), x)
    c2, c1, c0 = poly.all_coeffs()
    return c1**2 - 4 * c2 * c0 == 0
tan_ks = [k for k in range(-100, 101) if tangent(k)]
assert tan_ks == [-20, 10], tan_ks
pair = lambda p, q: all(tangent(v) for v in (p, q))
add(s, "圓與直線", "若直線 $3x+4y=k$ 與圓 $x^2+y^2-2x+4y-4=0$ 恰有一個交點，則 $k$ 的值為何？",
    [("$10$ 或 $-20$", pair(10, -20)), ("$-10$ 或 $20$", pair(-10, 20)), ("$-2$ 或 $-8$", pair(-2, -8)),
     ("$40$ 或 $-50$", pair(40, -50)), ("$15$ 或 $-25$", pair(15, -25))],
    "配方：$(x-1)^2+(y+2)^2=9$，圓心 $(1,-2)$，半徑 $3$。恰有一個交點就是相切，圓心到直線 $3x+4y-k=0$ 的距離等於半徑：$\\dfrac{|3-8-k|}{5}=3$，$|k+5|=15$，得 $k=10$ 或 $k=-20$。")

# ================= 高二（第三冊A）：弧度量、三角函數圖形、和差角、疊合 =================
s = "g11"
th = sp.rad(150)  # 5π/6
assert th == 5 * pi / 6
area = R(1, 2) * 6**2 * th
assert simplify(area - 15 * pi) == 0
add(s, "弧度量", "半徑 $6$、圓心角 $150^\\circ$ 的扇形，面積是多少？",
    [("$15\\pi$", simplify(area - 15 * pi) == 0), ("$30\\pi$", simplify(area - 30 * pi) == 0), ("$5\\pi$", simplify(area - 5 * pi) == 0),
     ("$45\\pi$", simplify(area - 45 * pi) == 0), ("$150\\pi$", simplify(area - 150 * pi) == 0)],
    "先換成弧度：$150^\\circ=\\dfrac{5\\pi}{6}$。扇形面積 $=\\dfrac{1}{2}r^2\\theta=\\dfrac{1}{2}\\times36\\times\\dfrac{5\\pi}{6}=15\\pi$。$5\\pi$ 是弧長，不是面積。")

v = sin(-23 * pi / 6)
assert simplify(v - R(1, 2)) == 0
add(s, "弧度量", "$\\sin\\left(-\\dfrac{23\\pi}{6}\\right)$ 的值是多少？",
    [("$\\dfrac{1}{2}$", simplify(v - R(1, 2)) == 0), ("$-\\dfrac{1}{2}$", simplify(v + R(1, 2)) == 0), ("$\\dfrac{\\sqrt{3}}{2}$", simplify(v - sqrt(3) / 2) == 0),
     ("$-\\dfrac{\\sqrt{3}}{2}$", simplify(v + sqrt(3) / 2) == 0), ("$\\dfrac{\\sqrt{2}}{2}$", simplify(v - sqrt(2) / 2) == 0)],
    "加上 $2$ 圈 $4\\pi$，同界角：$-\\dfrac{23\\pi}{6}+4\\pi=\\dfrac{\\pi}{6}$。所以 $\\sin\\left(-\\dfrac{23\\pi}{6}\\right)=\\sin\\dfrac{\\pi}{6}=\\dfrac{1}{2}$。")

import numpy as np
X = np.linspace(0, 4 * math.pi, 40001)
f3 = lambda z: 3 * np.sin(2 * z - math.pi / 3) + 1
def period_ok(T):
    same = np.allclose(f3(X + T), f3(X), atol=1e-9)
    smaller = any(np.allclose(f3(X + T / n), f3(X), atol=1e-9) for n in (2, 3, 4))
    return same and not smaller
mx = float(f3(X).max())
assert math.isclose(mx, 4, abs_tol=1e-6)
def pm(T, M):
    return period_ok(T) and math.isclose(mx, M, abs_tol=1e-6)
add(s, "三角函數圖形", "函數 $y=3\\sin\\left(2x-\\dfrac{\\pi}{3}\\right)+1$ 的週期與最大值分別是多少？",
    [("週期 $\\pi$，最大值 $4$", pm(math.pi, 4)), ("週期 $2\\pi$，最大值 $4$", pm(2 * math.pi, 4)), ("週期 $\\pi$，最大值 $3$", pm(math.pi, 3)),
     ("週期 $\\dfrac{\\pi}{2}$，最大值 $4$", pm(math.pi / 2, 4)), ("週期 $2\\pi$，最大值 $3$", pm(2 * math.pi, 3))],
    "$y=a\\sin(bx+c)+d$ 的週期是 $\\dfrac{2\\pi}{|b|}=\\dfrac{2\\pi}{2}=\\pi$，振幅 $3$，上下平移 $1$，所以最大值 $3+1=4$。最大值不是振幅。")

Z = np.linspace(-6, 6, 2001)
shifted = lambda z: np.sin(2 * (z - math.pi / 6)) + 1  # 向右平移 π/6，再向上 1
opts = [
    ("$y=\\sin\\left(2x-\\dfrac{\\pi}{3}\\right)+1$", lambda z: np.sin(2 * z - math.pi / 3) + 1),
    ("$y=\\sin\\left(2x-\\dfrac{\\pi}{6}\\right)+1$", lambda z: np.sin(2 * z - math.pi / 6) + 1),
    ("$y=\\sin\\left(2x+\\dfrac{\\pi}{3}\\right)+1$", lambda z: np.sin(2 * z + math.pi / 3) + 1),
    ("$y=\\sin\\left(2x+\\dfrac{\\pi}{6}\\right)+1$", lambda z: np.sin(2 * z + math.pi / 6) + 1),
    ("$y=\\sin\\left(2x-\\dfrac{\\pi}{3}\\right)-1$", lambda z: np.sin(2 * z - math.pi / 3) - 1),
]
add(s, "三角函數圖形", "將 $y=\\sin 2x$ 的圖形向右平移 $\\dfrac{\\pi}{6}$，再向上平移 $1$，所得圖形的方程式是哪一個？",
    [(t_, bool(np.allclose(fn(Z), shifted(Z), atol=1e-9))) for t_, fn in opts],
    "向右平移 $\\dfrac{\\pi}{6}$ 是把 $x$ 換成 $x-\\dfrac{\\pi}{6}$：$y=\\sin\\left[2\\left(x-\\dfrac{\\pi}{6}\\right)\\right]=\\sin\\left(2x-\\dfrac{\\pi}{3}\\right)$，再加 $1$。平移量要先乘上 $x$ 的係數 $2$，不是直接放 $\\dfrac{\\pi}{6}$。")

# 和差角：cos(α-β)
sa = R(3, 5); ca = sqrt(1 - sa**2)       # α 銳角
sb = R(5, 13); cb = -sqrt(1 - sb**2)     # β 第二象限
assert ca == R(4, 5) and cb == -R(12, 13)
cdiff = ca * cb + sa * sb
assert cdiff == R(-33, 65)
add(s, "和差角公式", "設 $\\alpha$ 為銳角、$\\beta$ 為第二象限角，且 $\\sin\\alpha=\\dfrac{3}{5}$、$\\sin\\beta=\\dfrac{5}{13}$，則 $\\cos(\\alpha-\\beta)$ 的值是多少？",
    [("$-\\dfrac{33}{65}$", cdiff == R(-33, 65)), ("$-\\dfrac{63}{65}$", cdiff == R(-63, 65)), ("$\\dfrac{63}{65}$", cdiff == R(63, 65)),
     ("$\\dfrac{33}{65}$", cdiff == R(33, 65)), ("$-\\dfrac{16}{65}$", cdiff == R(-16, 65))],
    "$\\alpha$ 銳角：$\\cos\\alpha=\\dfrac{4}{5}$；$\\beta$ 在第二象限，餘弦為負：$\\cos\\beta=-\\dfrac{12}{13}$。$\\cos(\\alpha-\\beta)=\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta=\\dfrac{4}{5}\\times\\left(-\\dfrac{12}{13}\\right)+\\dfrac{3}{5}\\times\\dfrac{5}{13}=\\dfrac{-48+15}{65}=-\\dfrac{33}{65}$。")

ang = math.degrees(math.atan(2) + math.atan(3))
assert math.isclose(ang, 135, abs_tol=1e-9)
tsum = (2 + 3) / (1 - 2 * 3)
assert tsum == -1
add(s, "和差角公式", "設 $A$、$B$ 都是銳角，$\\tan A=2$、$\\tan B=3$，則 $A+B$ 是多少度？",
    [("$135^\\circ$", math.isclose(ang, 135, abs_tol=1e-6)), ("$45^\\circ$", math.isclose(ang, 45, abs_tol=1e-6)), ("$105^\\circ$", math.isclose(ang, 105, abs_tol=1e-6)),
     ("$120^\\circ$", math.isclose(ang, 120, abs_tol=1e-6)), ("$150^\\circ$", math.isclose(ang, 150, abs_tol=1e-6))],
    "$\\tan(A+B)=\\dfrac{\\tan A+\\tan B}{1-\\tan A\\tan B}=\\dfrac{2+3}{1-6}=-1$。又 $\\tan A=2>1$、$\\tan B=3>1$，所以 $A$、$B$ 都大於 $45^\\circ$，$A+B$ 在 $90^\\circ$ 與 $180^\\circ$ 之間，只有 $135^\\circ$ 的正切是 $-1$。")

# 疊合 1
Xg = np.linspace(0, 2 * math.pi, 2000001, endpoint=False)
f7 = math.sqrt(3) * np.sin(Xg) - np.cos(Xg)
mx7 = float(f7.max()); xm7 = float(Xg[f7.argmax()])
assert math.isclose(mx7, 2, abs_tol=1e-9) and math.isclose(xm7, 2 * math.pi / 3, abs_tol=1e-5)
def q7(M, xx):
    return math.isclose(mx7, M, abs_tol=1e-6) and math.isclose(xm7, xx, abs_tol=1e-4)
add(s, "疊合", "函數 $f(x)=\\sqrt{3}\\sin x-\\cos x$（$0\\le x<2\\pi$）的最大值，以及發生最大值時的 $x$，是下列哪一個？",
    [("最大值 $2$，$x=\\dfrac{2\\pi}{3}$", q7(2, 2 * math.pi / 3)), ("最大值 $2$，$x=\\dfrac{\\pi}{3}$", q7(2, math.pi / 3)),
     ("最大值 $2$，$x=\\dfrac{5\\pi}{6}$", q7(2, 5 * math.pi / 6)), ("最大值 $4$，$x=\\dfrac{2\\pi}{3}$", q7(4, 2 * math.pi / 3)),
     ("最大值 $\\sqrt{3}$，$x=\\dfrac{\\pi}{2}$", q7(math.sqrt(3), math.pi / 2))],
    "疊合：$\\sqrt{3}\\sin x-\\cos x=2\\left(\\dfrac{\\sqrt{3}}{2}\\sin x-\\dfrac{1}{2}\\cos x\\right)=2\\sin\\left(x-\\dfrac{\\pi}{6}\\right)$。最大值 $2$，發生在 $x-\\dfrac{\\pi}{6}=\\dfrac{\\pi}{2}$，即 $x=\\dfrac{2\\pi}{3}$。")

# 疊合 2
Rr = sp.sqrt(3**2 + 4**2)
assert Rr == 5
Xd = np.linspace(0, 2 * math.pi, 2000001, endpoint=False)
f8 = 3 * np.sin(Xd) + 4 * np.cos(Xd)
assert math.isclose(f8.max(), 5, abs_tol=1e-9) and math.isclose(f8.min(), -5, abs_tol=1e-9)
cnt = sum(1 for k in range(-30, 31) if abs(k) <= Rr)
assert cnt == 11
add(s, "疊合", "使方程式 $3\\sin x+4\\cos x=k$ 有實數解的整數 $k$ 共有幾個？",
    [("$11$ 個", cnt == 11), ("$15$ 個", cnt == 15), ("$9$ 個", cnt == 9), ("$10$ 個", cnt == 10), ("$5$ 個", cnt == 5)],
    "疊合：$3\\sin x+4\\cos x=\\sqrt{3^2+4^2}\\sin(x+\\varphi)=5\\sin(x+\\varphi)$，值域 $-5\\le y\\le5$（兩端都能取到）。所以 $-5\\le k\\le5$，整數 $k$ 有 $-5,-4,\\dots,5$，共 $11$ 個。")

# ---------------- 寫入 ----------------
old = json.load(open(PATH))
keep = [q for q in old if q["set"] not in ("g10", "g11")]
json.dump(keep + Q, open(PATH, "w"), ensure_ascii=False, indent=1)
print(f"原有 {len(keep)} 題，新增 {len(Q)} 題（g10 {sum(1 for q in Q if q['set']=='g10')}、g11 {sum(1 for q in Q if q['set']=='g11')}），全部驗算通過")
for r in REPORT:
    print(r[0], r[1], "| 正解:", r[3], "| 各選項驗算(原順序):", r[4])
