"""產生 public/units/<slug>-og.png（1200×630）。用法：python3 scripts/unit-og.py（已存在的檔不覆蓋，加 --force 覆蓋）。"""
import sys, os
from PIL import Image, ImageDraw, ImageFont

BOLD = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"

def tc_index(path):
    for i in range(10):
        try:
            f = ImageFont.truetype(path, 20, index=i)
        except Exception:
            break
        if "TC" in " ".join(f.getname()):
            return i
    return 0

IDX = tc_index(BOLD)
F = lambda s: ImageFont.truetype(BOLD, s, index=IDX)

UNITS = [
    ("jh-mult", "國中", "乘法公式", "和的平方・差的平方・平方差"),
    ("jh-circle", "國中", "圓（國三）", "弧長扇形・圓周角・弦切角・圓內接四邊形"),
    ("trig", "高中", "三角函數", "tan 與斜率・單位圓・和角公式・正餘弦定理"),
    ("vector", "高中", "向量", "頭接尾加法・坐標・長度・內積與垂直"),
    ("prob", "高中", "排列組合與機率", "排列・組合・重複組合・古典機率"),
    ("series", "高中", "數列與級數", "等差數列・等差級數求和"),
    ("circle-eq", "高中", "圓方程式", "圓心半徑・配方・點與圓・切線"),
    ("stats", "高中", "數據分析（標準差）", "平均與標準差：加常數、乘倍數"),
    ("abs-ineq", "高中", "絕對值不等式", "絕對值就是距離"),
    ("sat-algebra", "SAT", "Digital SAT 代數", "Linear equations・Linear functions"),
    ("other", "高中", "免費練習題", "依單元整理，每份附詳解"),
    ("units", "國中・高中・SAT", "免費練習題・單元包", "依單元整理，每份都有題目和逐步詳解"),
]

def draw(slug, level, title, sub, out):
    W, H = 1200, 630
    im = Image.new("RGB", (W, H), (17, 20, 24))
    d = ImageDraw.Draw(im)
    for x in range(0, W, 40):
        d.line([(x, 0), (x, H)], fill=(26, 30, 35))
    for y in range(0, H, 40):
        d.line([(0, y), (W, y)], fill=(26, 30, 35))
    blue = (140, 170, 205)
    d.text((80, 90), f"Saber數學 免費練習題・{level}", font=F(30), fill=blue)
    size = 84
    while d.textlength(title, font=F(size)) > W - 160 and size > 48:
        size -= 4
    d.text((80, 160), title, font=F(size), fill=(240, 240, 236))
    d.text((80, 300), "依單元整理，每份附逐步詳解", font=F(40), fill=(240, 240, 236))
    d.text((80, 390), sub, font=F(30), fill=(200, 204, 210))
    d.text((80, 525), "kuan-weekly.vercel.app/units", font=F(30), fill=blue)
    im.save(out, optimize=True)

force = "--force" in sys.argv
for slug, level, title, sub in UNITS:
    out = f"public/units/{slug}-og.png"
    if os.path.exists(out) and not force:
        continue
    draw(slug, level, title, sub, out)
    print("wrote", out)
