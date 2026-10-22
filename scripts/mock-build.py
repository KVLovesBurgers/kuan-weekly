"""產生 data/mock-questions.json（學測免費線上模擬考 數A／數B），並用程式驗算每題答案。python3 scripts/mock-build.py"""
import json, math, itertools, re
from fractions import Fraction as F
from math import comb, sqrt, isclose, log10, sin, cos, pi, log

Q=[]; CHECKS=[]
def B(label): return "\\boxed{\\scriptsize %s}" % label.replace("-","\\text{-}")
def add(subj,no,typ,pts,unit,level,stem,answer,exp,check,options=None,fmt=None,group=None):
    assert check is True, f"verify failed: {subj}{no}"
    if typ=="single": assert options and isinstance(answer,int) and 1<=answer<=len(options) and len(set(options))==len(options)
    if typ=="multi": assert options and len(options)==5 and answer and all(1<=a<=5 for a in answer)
    if typ=="fill": assert fmt and re.fullmatch(r"[0-9\-]+",answer) and fmt.count("\\boxed")==len(answer)
    Q.append(dict(id=f"{subj}{no:02d}",subject=subj,no=no,type=typ,points=pts,unit=unit,level=level,stem=stem,options=options,answer=answer,format=fmt,explanation=exp,group=group))
    CHECKS.append(f"{subj}{no:02d} {typ} {unit}: OK answer={answer}")
def cells(no,n): return [f"{no}-{i}" for i in range(1,n+1)]
def fmt_digits(no,n): return "".join(B(c) for c in cells(no,n))

# ======================= 數學A =======================
S="A"
aa1,bb1,cc1=2**30,3**20,5**13
add(S,1,"single",5,"指數與對數",2,"設 $a=2^{30}$、$b=3^{20}$、$c=5^{13}$。試問下列哪一個選項正確？（$\\log2\\approx0.3010$、$\\log3\\approx0.4771$）",5,
 "取常用對數：$\\log a=30\\times0.3010=9.030$，$\\log b=20\\times0.4771=9.542$，$\\log c=13\\times(1-0.3010)=9.087$。所以 $a<c<b$。也可以直接看：$a\\approx1.07\\times10^9$、$c\\approx1.22\\times10^9$、$b\\approx3.49\\times10^9$。",
 aa1<cc1<bb1,options=["$a<b<c$","$b<a<c$","$c<a<b$","$b<c<a$","$a<c<b$"])
pairs=[(a,b) for a in range(1,7) for b in range(1,7) if a+b==8]; ev=[p for p in pairs if p[0]%2==0 or p[1]%2==0]
add(S,2,"single",5,"條件機率",1,"同時擲兩顆公正骰子。已知兩顆點數和為 $8$，試問至少有一顆點數為偶數的機率為何？",3,
 "和為 $8$ 的情形有 $(2,6),(3,5),(4,4),(5,3),(6,2)$ 共 $5$ 種，等可能。其中含偶數的是 $(2,6),(4,4),(6,2)$ 共 $3$ 種，機率 $\\dfrac{3}{5}$。注意和為偶數時兩顆同奇同偶，所以「至少一顆偶數」就是「兩顆都偶數」。",
 F(len(ev),len(pairs))==F(3,5),options=["$\\dfrac{1}{5}$","$\\dfrac{2}{5}$","$\\dfrac{3}{5}$","$\\dfrac{4}{5}$","$\\dfrac{1}{2}$"])
th=math.atan(2)+pi
add(S,3,"single",5,"三角函數",2,"設 $\\theta$ 為第三象限角，且 $\\tan\\theta=2$。試問 $\\sin2\\theta$ 的值為何？",2,
 "$\\sin2\\theta=2\\sin\\theta\\cos\\theta=\\dfrac{2\\tan\\theta}{1+\\tan^2\\theta}=\\dfrac{4}{5}$。第三象限 $\\sin\\theta$、$\\cos\\theta$ 都是負的，乘積為正，所以答案是正的。",
 isclose(sin(2*th),0.8) and sin(th)<0 and cos(th)<0,options=["$\\dfrac{2}{5}$","$\\dfrac{4}{5}$","$-\\dfrac{4}{5}$","$\\dfrac{3}{5}$","$-\\dfrac{3}{5}$"])
# vectors |a|=3 |b|=4 |a+b|=sqrt37
ab=(37-9-16)/2; v=sqrt(4*9+16-4*ab)
add(S,4,"single",5,"平面向量",2,"平面上兩向量 $\\vec a$、$\\vec b$ 滿足 $|\\vec a|=3$、$|\\vec b|=4$、$|\\vec a+\\vec b|=\\sqrt{37}$。試問 $|2\\vec a-\\vec b|$ 為何？",2,
 "由 $|\\vec a+\\vec b|^2=9+16+2\\,\\vec a\\cdot\\vec b=37$ 得 $\\vec a\\cdot\\vec b=6$。$|2\\vec a-\\vec b|^2=4\\times9+16-4\\times6=28$，所以 $|2\\vec a-\\vec b|=2\\sqrt{7}$。",
 isclose(v,2*sqrt(7)),options=["$\\sqrt{22}$","$2\\sqrt{7}$","$6$","$\\sqrt{34}$","$2\\sqrt{10}$"])
a=F(4-(-2),6); f=lambda t:a*(t-1)*(t-2)*(t-3)+4
add(S,5,"single",5,"多項式函數",2,"三次多項式 $f(x)$ 滿足 $f(1)=f(2)=f(3)=4$，且 $f(0)=-2$。試問 $f(4)$ 的值為何？",3,
 "$f(x)-4$ 有因式 $(x-1)(x-2)(x-3)$，設 $f(x)=a(x-1)(x-2)(x-3)+4$。由 $f(0)=-6a+4=-2$ 得 $a=1$，$f(4)=1\\times3\\times2\\times1+4=10$。",
 f(0)==-2 and f(1)==f(2)==f(3)==4 and f(4)==10,options=["$6$","$8$","$10$","$12$","$14$"])
subs=[c for c in itertools.combinations(range(1,9),4) if sum(c)==18]; parts=len(subs)//2
add(S,6,"single",5,"排列組合",3,"將 $1,2,3,\\dots,8$ 這 $8$ 個數分成兩組，每組 $4$ 個數，且兩組數字的和相等。試問共有幾種分法？（兩組不分順序）",3,
 "總和 $36$，每組和為 $18$。含 $8$ 的那一組，另外 $3$ 個數要從 $1$ 到 $7$ 中選、和為 $10$：$\\{1,2,7\\},\\{1,3,6\\},\\{1,4,5\\},\\{2,3,5\\}$，共 $4$ 組。固定「含 $8$ 的那組」就不會把同一種分法算兩次，答案 $4$ 種。",
 parts==4 and len([c for c in subs if 8 in c])==4,options=["$2$","$3$","$4$","$6$","$8$"])
# multi
xs=[8,10,12,10,10]; ys=[3*t-5 for t in xs]
import statistics as st
add(S,7,"multi",5,"數據分析",1,"一組數據 $x_1,x_2,\\dots,x_n$ 的算術平均數為 $10$、標準差為 $2$。令 $y_i=3x_i-5$、$z_i=-x_i+20$（$i=1,2,\\dots,n$）。試選出正確的選項。",[1,2,4],
 "$y$ 的平均 $3\\times10-5=25$，標準差 $3\\times2=6$，變異數 $36$，所以 (3) 錯。$y$ 與 $x$ 是斜率為正的線性關係，相關係數 $1$。標準差不會是負的，$z$ 的標準差是 $|-1|\\times2=2$，所以 (5) 錯。",
 isclose(st.mean(ys),3*st.mean(xs)-5) and isclose(st.pstdev(ys),3*st.pstdev(xs)) and isclose(st.pvariance(ys),9*st.pvariance(xs)),
 options=["$y$ 的平均數為 $25$","$y$ 的標準差為 $6$","$y$ 的變異數為 $18$","$x$ 與 $y$ 的相關係數為 $1$","$z$ 的標準差為 $-2$"])
a3=log(5,3)
t=[1<a3<2, a3>1.4 and 3**7<5**5, 1/(2*a3)<1/3, isclose(3**(2*a3),25), isclose(log(45,15),(2+a3)/(1+a3))]
add(S,8,"multi",5,"指數與對數",2,"設 $a=\\log_3 5$。試選出正確的選項。",[1,2,4,5],
 "(1) $3<5<9$，所以 $1<a<2$。(2) $3^7=2187<3125=5^5$，所以 $3^{\\frac75}<5$，$a>\\dfrac75=1.4$。(3) $3^{1.5}=3\\sqrt3\\approx5.196>5$，所以 $a<1.5$；$\\log_{25}3=\\dfrac{1}{2a}$，因為 $a<1.5$，$\\dfrac{1}{2a}>\\dfrac{1}{3}$，錯。(4) $3^{2a}=(3^a)^2=25$。(5) $\\log_{15}45=\\dfrac{\\log_3 45}{\\log_3 15}=\\dfrac{2+a}{1+a}$。",
 t==[True,True,False,True,True],options=["$1<a<2$","$a>1.4$","$\\log_{25}3<\\dfrac{1}{3}$","$3^{2a}=25$","$\\log_{15}45=\\dfrac{2+a}{1+a}$"])
g=lambda x:2*sin(2*x-pi/3)+1
import numpy as np
X=np.linspace(0,pi/4,2001); inc=all(np.diff(2*np.sin(2*X-pi/3)+1)>0)
t=[isclose(g(0.3+pi),g(0.3)) and not isclose(g(0.3+pi/2),g(0.3)), isclose(max(2*np.sin(2*np.linspace(0,pi,100001)-pi/3)+1),3,abs_tol=1e-6), isclose(g(pi/6),2), all(isclose(g(5*pi/12+d),g(5*pi/12-d)) for d in (0.1,0.37,1.2)), inc]
add(S,9,"multi",5,"三角函數",2,"設 $f(x)=2\\sin\\left(2x-\\dfrac{\\pi}{3}\\right)+1$。試選出正確的選項。（週期指最小正週期）",[1,2,4,5],
 "(1) 週期 $\\dfrac{2\\pi}{2}=\\pi$。(2) 最大值 $2+1=3$。(3) $f\\left(\\dfrac{\\pi}{6}\\right)=2\\sin0+1=1$，錯。(4) $2x-\\dfrac{\\pi}{3}=\\dfrac{\\pi}{2}$ 時 $x=\\dfrac{5\\pi}{12}$，是最高點，圖形對稱於這條鉛直線。(5) $x$ 從 $0$ 到 $\\dfrac{\\pi}{4}$，$2x-\\dfrac{\\pi}{3}$ 從 $-\\dfrac{\\pi}{3}$ 到 $\\dfrac{\\pi}{6}$，正弦在這段遞增。",
 t==[True,True,False,True,True],options=["$f(x)$ 的週期為 $\\pi$","$f(x)$ 的最大值為 $3$","$f\\left(\\dfrac{\\pi}{6}\\right)=2$","$y=f(x)$ 的圖形對稱於直線 $x=\\dfrac{5\\pi}{12}$","$f(x)$ 在 $0\\le x\\le\\dfrac{\\pi}{4}$ 遞增"])
n=np.array([1,2,2]); t=[True, isclose(6/np.linalg.norm(n),3), isclose(6*3*3/6,9), 2+2+4==6, int(n@np.array([2,1,-2]))==0]
add(S,10,"multi",5,"空間中的平面",2,"坐標空間中，平面 $E:x+2y+2z=6$。試選出正確的選項。",[1,3,5],
 "(1) 法向量為 $(1,2,2)$ 的實數倍。(2) 原點到 $E$ 的距離 $\\dfrac{|-6|}{\\sqrt{1+4+4}}=2$，錯。(3) 三軸截距為 $6,3,3$，四面體體積 $\\dfrac{1}{6}\\times6\\times3\\times3=9$。(4) $2+2+4=8\\ne6$，錯。(5) 兩法向量內積 $1\\times2+2\\times1+2\\times(-2)=0$，兩平面垂直。",
 t==[True,False,True,False,True],options=["$(2,4,4)$ 是 $E$ 的一個法向量","原點到 $E$ 的距離為 $3$","$E$ 與三個坐標平面所圍成的四面體體積為 $9$","點 $(2,1,2)$ 在 $E$ 上","$E$ 與平面 $2x+y-2z=0$ 互相垂直"])
balls="RRRWW"; out=list(itertools.permutations(range(5),2)); Aev=[o for o in out if balls[o[0]]=="R"]; Bev=[o for o in out if balls[o[1]]=="R"]; AB=[o for o in Aev if o in Bev]; P=lambda e:F(len(e),len(out))
t=[P(Bev)==F(3,5), P(AB)==F(3,10), P(AB)==P(Aev)*P(Bev), F(len(AB),len(Bev))==F(1,2), P(set(Aev)|set(Bev))==F(9,10)]
add(S,11,"multi",5,"條件機率與獨立事件",2,"袋中有 $3$ 顆紅球、$2$ 顆白球。每次從袋中隨機取出一顆，取後不放回，共取兩次。令 $A$ 表示「第一次取到紅球」，$B$ 表示「第二次取到紅球」。試選出正確的選項。",[1,2,4,5],
 "(1) 由對稱性 $P(B)=P(A)=\\dfrac{3}{5}$。(2) $P(A\\cap B)=\\dfrac{3}{5}\\times\\dfrac{2}{4}=\\dfrac{3}{10}$。(3) $P(A)P(B)=\\dfrac{9}{25}\\ne\\dfrac{3}{10}$，不獨立。(4) $P(A\\mid B)=\\dfrac{3/10}{3/5}=\\dfrac{1}{2}$。(5) $1-P(\\text{兩次都白})=1-\\dfrac{2}{5}\\times\\dfrac{1}{4}=\\dfrac{9}{10}$。",
 t==[True,True,False,True,True],options=["$P(B)=\\dfrac{3}{5}$","$P(A\\cap B)=\\dfrac{3}{10}$","$A$ 與 $B$ 為獨立事件","$P(A\\mid B)=\\dfrac{1}{2}$","$P(A\\cup B)=\\dfrac{9}{10}$"])
def rr(k): return sorted(r.real for r in np.roots([1,0,-3,k]) if abs(r.imag)<1e-7)
r0,r1,r3=rr(0),rr(1),rr(3)
two=len(set(round(v,5) for v in rr(2)))
t=[len(r0)==3, two==2, all(-2<v<2 for v in r1), len(r3)==1 and -2<r3[0]<-1, all(isclose(sum(v*v for v in rr(k)),6) for k in (-1.9,-0.5,0.7,1.99))]
add(S,12,"multi",5,"多項式函數",3,"設 $k$ 為實數，$f(x)=x^3-3x+k$。試選出正確的選項。",[1,2,3,5],
 "$f'(x)=3x^2-3$，在 $x=-1$ 有極大值 $k+2$，在 $x=1$ 有極小值 $k-2$。(1) $k=0$：極大 $2>0$、極小 $-2<0$，三相異實根。(2) $k=2$：$x^3-3x+2=(x-1)^2(x+2)$，恰兩個相異實根。(3) $k=1$：$f(-2)=-1<0$、$f(-1)=3>0$、$f(1)=-1<0$、$f(2)=3>0$，三根分別在 $(-2,-1)$、$(-1,1)$、$(1,2)$。(4) $k=3$：$f(-2)=1>0$，又 $f(-3)=-15<0$，唯一實根在 $(-3,-2)$，錯。(5) 三根和 $0$、兩兩乘積和 $-3$，平方和 $0^2-2\\times(-3)=6$。",
 t==[True,True,True,False,True],options=["當 $k=0$ 時，$f(x)=0$ 有三個相異實根","當 $k=2$ 時，$f(x)=0$ 恰有兩個相異實根","當 $k=1$ 時，$f(x)=0$ 的三個實根都介於 $-2$ 與 $2$ 之間","當 $k=3$ 時，$f(x)=0$ 唯一的實根介於 $-2$ 與 $-1$ 之間","當 $-2<k<2$ 時，$f(x)=0$ 三個實根的平方和為 $6$"])
# fill
r=-2; a1=-3; Sn=lambda n:sum(a1*r**k for k in range(n)); nmin=next(n for n in range(1,100) if abs(Sn(n))>1000)
add(S,13,"fill",5,"數列與級數",2,"實數等比數列 $\\langle a_n\\rangle$ 滿足 $a_2=6$、$a_5=-48$，令 $S_n=a_1+a_2+\\cdots+a_n$。使 $|S_n|>1000$ 的最小正整數 $n=$ $"+fmt_digits(13,2)+"$ 。","%d"%nmin,
 "$r^3=\\dfrac{-48}{6}=-8$，$r=-2$，$a_1=-3$。$S_n=\\dfrac{-3\\left(1-(-2)^n\\right)}{1-(-2)}=(-2)^n-1$。$n=9$ 時 $|S_9|=|-513|=513$；$n=10$ 時 $S_{10}=1023$。又 $n\\le9$ 時 $|S_n|\\le2^9+1=513$，所以最小的 $n=10$。",
 nmin==10 and a1*r==6 and a1*r**4==-48 and all(Sn(n)==(-2)**n-1 for n in range(1,15)),fmt=fmt_digits(13,2))
cx,cy,R=3,-2,5; dd=abs(cx-2*cy+3)/sqrt(5); ch=2*sqrt(R*R-dd*dd)
fm14=B("14-1")+"\\sqrt{"+B("14-2")+"}"
add(S,14,"fill",5,"直線與圓",1,"坐標平面上，直線 $x-2y+3=0$ 被圓 $x^2+y^2-6x+4y-12=0$ 所截的弦長為 $"+fm14+"$。（化成最簡根式）","25",
 "配方得 $(x-3)^2+(y+2)^2=25$，圓心 $(3,-2)$、半徑 $5$。圓心到直線距離 $\\dfrac{|3+4+3|}{\\sqrt5}=2\\sqrt5$，弦長 $2\\sqrt{25-20}=2\\sqrt5$。",
 isclose(ch,2*sqrt(5)) and 9+4+12==R*R,fmt=fm14)
thA=[t for t in (math.asin(x) for x in []) ]
sc=F(1,3); pc=(sc*sc-1)/2; cube=sc*(1-pc)
ths=[t for t in np.linspace(0,2*pi,200001) if abs(sin(t)+cos(t)-1/3)<2e-5]
fm15="\\dfrac{"+B("15-1")+B("15-2")+"}{"+B("15-3")+B("15-4")+"}"
add(S,15,"fill",5,"三角函數",2,"設 $\\sin\\theta+\\cos\\theta=\\dfrac13$。則 $\\sin^3\\theta+\\cos^3\\theta=$ $"+fm15+"$。（化成最簡分數）","1327",
 "平方得 $1+2\\sin\\theta\\cos\\theta=\\dfrac19$，$\\sin\\theta\\cos\\theta=-\\dfrac49$。立方和公式：$\\sin^3\\theta+\\cos^3\\theta=(\\sin\\theta+\\cos\\theta)(1-\\sin\\theta\\cos\\theta)=\\dfrac13\\times\\dfrac{13}{9}=\\dfrac{13}{27}$。",
 cube==F(13,27) and len(ths)>0 and all(isclose(sin(t)**3+cos(t)**3,13/27,abs_tol=1e-4) for t in ths),fmt=fm15)
cnt=sum(1 for c in itertools.combinations(range(1,31),3) if sum(c)%3==0)
add(S,16,"fill",5,"排列組合",3,"從 $1,2,3,\\dots,30$ 中任取三個相異整數，使這三個數的和是 $3$ 的倍數。共有 $"+fmt_digits(16,4)+"$ 種取法。",str(cnt),
 "依除以 $3$ 的餘數分成三類，每類 $10$ 個數。和是 $3$ 的倍數：三個同類 $3\\times C^{10}_3=360$，或三類各取一個 $10^3=1000$。共 $1360$ 種。",cnt==1360,fmt=fmt_digits(16,4))
obt=[(a,b,c) for a in range(1,25) for b in range(a,25) for c in range(b,25) if a+b+c==24 and a+b>c and a*a+b*b<c*c]
add(S,17,"fill",5,"三角形的邊角關係",3,"三邊長都是正整數、周長為 $24$ 的鈍角三角形共有 $"+fmt_digits(17,1)+"$ 種。（全等的三角形視為同一種）",str(len(obt)),
 "設 $a\\le b\\le c$，$a+b+c=24$。三角形條件 $a+b>c$ 得 $c\\le11$；鈍角條件 $a^2+b^2<c^2$。逐一列出：$c=11$ 時 $a+b=13$，$(a,b)=(2,11),(3,10),(4,9),(5,8),(6,7)$，$a^2+b^2$ 依序為 $125,109,97,89,85$，小於 $121$ 的有 $4$ 種；$c=10$ 時 $a+b=14$，$(4,10),(5,9),(6,8),(7,7)$ 的 $a^2+b^2$ 為 $116,106,100,98$，小於 $100$ 的只有 $(7,7,10)$，$1$ 種（$(6,8,10)$ 是直角）；$c\\le9$ 時 $a+b\\ge15$，$a^2+b^2\\ge\\dfrac{225}{2}>81$，沒有鈍角。共 $5$ 種。",
 len(obt)==5,fmt=fmt_digits(17,1))
# group 18-20
G="籃球投籃：以出手點正下方的地面為原點、朝籃框方向為正 $x$ 軸、鉛直向上為正 $y$ 軸（單位：公尺）。某次投籃，球的軌跡是拋物線 $y=ax^2+bx+c$ 的一部分：出手點為 $(0,\\,2)$，球在 $x=4$ 時達到最高點，並恰好通過籃框中心 $(7,\\,3.05)$。"
aa=F(305-200,100)/(F(9)-F(16)); # y=a(x-4)^2+k ; 2=16a+k ; 3.05=9a+k
aa=(F(305,100)-2)/(9-16); kk=2-16*aa
yy=lambda x:aa*(x-4)**2+kk
add(S,18,"single",3,"二次函數",1,"試問球的最高點離地多少公尺？",3,
 "設 $y=a(x-4)^2+k$。代入 $(0,2)$、$(7,3.05)$：$16a+k=2$、$9a+k=3.05$，相減得 $a=-0.15$，$k=4.4$。",
 kk==F(44,10) and yy(0)==2 and yy(7)==F(305,100),options=["$3.8$","$4.2$","$4.4$","$4.6$","$5.0$"],group=G)
b=-8*aa; c=16*aa+kk
fm19="b=\\dfrac{"+B("19-1")+"}{"+B("19-2")+"}"
add(S,19,"fill",6,"二次函數",2,"將拋物線寫成 $y=ax^2+bx+c$，則 $"+fm19+"$。（化成最簡分數）","65",
 "$y=-0.15(x-4)^2+4.4=-0.15x^2+1.2x+2$，$b=1.2=\\dfrac{6}{5}$。",b==F(6,5) and c==2,fmt=fm19,group=G)
w=2*sqrt(float((kk-4)/(-aa)))
fm20="\\dfrac{"+B("20-1")+"\\sqrt{"+B("20-2")+"}}{"+B("20-3")+"}"
add(S,20,"fill",6,"二次函數",3,"在球的軌跡中，離地高度不低於 $4$ 公尺的那一段，其水平距離為 $"+fm20+"$ 公尺。（化成最簡根式）","463",
 "$-0.15(x-4)^2+4.4\\ge4$，即 $(x-4)^2\\le\\dfrac{0.4}{0.15}=\\dfrac{8}{3}$，$x$ 的範圍長度 $2\\sqrt{\\dfrac83}=\\dfrac{4\\sqrt6}{3}$。",
 isclose(w,4*sqrt(6)/3),fmt=fm20,group=G)

# ======================= 數學B =======================
S="B"
add(S,1,"single",5,"指數應用",1,"某款筆電每年的二手價都是前一年的 $80\\%$。試問 $3$ 年後的二手價約為原價的多少？",2,
 "$0.8^3=0.512$，約 $51.2\\%$。不是 $100\\%-3\\times20\\%=40\\%$，因為每年是以前一年為基準打折。",isclose(0.8**3,0.512),options=["$40\\%$","$51.2\\%$","$54.0\\%$","$60\\%$","$64\\%$"])
d=[3,8,5,10]; xx=7*5-sum(d); dd=sorted(d+[xx])
add(S,2,"single",5,"數據分析",1,"五筆資料 $3,\\,8,\\,5,\\,10,\\,x$ 的算術平均數為 $7$。試問這五筆資料的中位數為何？",4,
 "總和 $35$，$x=35-26=9$。由小到大 $3,5,8,9,10$，中位數 $8$。",xx==9 and dd[2]==8,options=["$5$","$6$","$7$","$8$","$9$"])
add(S,3,"single",5,"直線方程式",1,"坐標平面上，通過點 $(2,-1)$ 且與直線 $3x-4y=5$ 垂直的直線方程式為何？",5,
 "原直線斜率 $\\dfrac34$，垂直線斜率 $-\\dfrac43$：$y+1=-\\dfrac43(x-2)$，整理得 $4x+3y-5=0$。",
 4*2+3*(-1)-5==0 and 3*4+(-4)*3==0,options=["$3x-4y-10=0$","$4x-3y-11=0$","$3x+4y-2=0$","$4x+3y+5=0$","$4x+3y-5=0$"])
H=20/(1/math.tan(pi/6)-1)
add(S,4,"single",5,"三角測量",2,"在平地上的 $A$ 點測得一棟大樓頂端的仰角為 $30^\\circ$，朝大樓直走 $20$ 公尺到 $B$ 點，測得仰角為 $45^\\circ$。試問大樓高度最接近下列哪一個值？（$\\sqrt3\\approx1.732$）",3,
 "設樓高 $h$，$B$ 到樓底 $h$ 公尺（$45^\\circ$），$A$ 到樓底 $\\sqrt3h$ 公尺。$\\sqrt3h-h=20$，$h=\\dfrac{20}{\\sqrt3-1}=10(\\sqrt3+1)\\approx27.3$。",
 isclose(H,10*(sqrt(3)+1)) and abs(H-27.3)<0.05,options=["$20.0$","$23.1$","$27.3$","$34.6$","$37.3$"])
cnt=sum(1 for p in itertools.permutations(range(6)) if p[0]!=0 and p[5]!=1)
add(S,5,"single",5,"排列組合",2,"甲、乙等 $6$ 人排成一列。若甲不排第一個、乙不排最後一個，試問共有幾種排法？",4,
 "全部 $720$，甲在第一 $120$，乙在最後 $120$，兩者同時 $24$。$720-120-120+24=504$。",cnt==504,options=["$480$","$492$","$498$","$504$","$600$"])
o=list(itertools.product(range(3),repeat=3)); beats=lambda a,b:(a-b)%3==1
one=sum(1 for g in o if sum(1 for i in range(3) if all(beats(g[i],g[j]) or g[i]==g[j] for j in range(3) if j!=i) and len(set(g))==2 and [g.count(v) for v in set(g)].count(1)==1 and g.count(g[i])==1)==1)
add(S,6,"single",5,"機率",2,"甲、乙、丙三人猜拳一次，每人出剪刀、石頭、布的機率都是 $\\dfrac13$ 且互不影響。試問「恰有一人獲勝」的機率為何？",3,
 "樣本空間 $27$ 種。恰一人勝：贏的人有 $3$ 種選法，他出的拳有 $3$ 種，另兩人都出被他贏的那種，共 $9$ 種，機率 $\\dfrac{9}{27}=\\dfrac13$。",
 F(one,27)==F(1,3),options=["$\\dfrac19$","$\\dfrac29$","$\\dfrac13$","$\\dfrac49$","$\\dfrac23$"])
# cube cross-section hexagon
V=np.array([[1,0,0],[1,1,0],[0,1,0],[0,1,1],[0,0,1],[1,0,1]])*1.0*2; V=np.array([[2,0,1],[2,1,0],[1,2,0],[0,2,1],[0,1,2],[1,0,2]],float)
nrm=np.array([1,1,1])/sqrt(3); assert all(isclose(v@nrm,3/sqrt(3)) for v in V)
area=0.5*abs(sum(np.cross(V[i],V[(i+1)%6]) for i in range(6))@nrm)
add(S,7,"single",5,"空間概念",3,"邊長為 $2$ 的正立方體，有一平面通過它的中心，且與某一條體對角線垂直。試問這個平面截正立方體所得截面的面積為何？",4,
 "這個平面通過 $6$ 條稜的中點（不與該體對角線的兩端點相連的那 $6$ 條稜），截面是正六邊形。相鄰兩中點的距離是 $\\sqrt{1^2+1^2}=\\sqrt2$，面積 $6\\times\\dfrac{\\sqrt3}{4}\\times(\\sqrt2)^2=3\\sqrt3$。",
 isclose(area,3*sqrt(3)),options=["$\\sqrt3$","$2\\sqrt3$","$2\\sqrt6$","$3\\sqrt3$","$4\\sqrt3$"])
fy=lambda x:-x*x+4*x+5
t=[fy(2)==9 and all(fy(x)<=9 for x in range(-10,11)), fy(-1)==0 and fy(5)==0, False, all((fy(x/10)>0)==(-1<x/10<5) for x in range(-30,80)), False]
add(S,8,"multi",5,"二次函數",1,"設 $f(x)=-x^2+4x+5$。試選出正確的選項。",[1,2,4],
 "$f(x)=-(x-2)^2+9$。(1) 頂點 $(2,9)$。(2) $f(x)=-(x+1)(x-5)$，與 $x$ 軸交於 $-1$、$5$。(3) 對稱軸是 $x=2$，錯。(4) 開口向下，兩根之間為正。(5) 開口向下沒有最小值，$9$ 是最大值，錯。",
 t==[True,True,False,True,False],options=["圖形的頂點為 $(2,9)$","圖形與 $x$ 軸交於 $(-1,0)$、$(5,0)$","圖形的對稱軸為 $x=-2$","$f(x)>0$ 的解為 $-1<x<5$","$f(x)$ 的最小值為 $9$"])
A=np.array([[1,2],[3,4]]); Bm=np.array([[0,1],[1,0]])
t=[(A@Bm==np.array([[2,1],[4,3]])).all(), (A@Bm==Bm@A).all(), isclose(np.linalg.det(A),-2), abs(np.linalg.det(A))>1e-9, (Bm@Bm==np.eye(2)).all()]
add(S,9,"multi",5,"矩陣",1,"設 $A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$、$B=\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}$，$I$ 為二階單位方陣。試選出正確的選項。",[1,3,4,5],
 "(1) $AB$ 是把 $A$ 的兩行對調：$\\begin{bmatrix}2&1\\\\4&3\\end{bmatrix}$。(2) $BA$ 是把 $A$ 的兩列對調：$\\begin{bmatrix}3&4\\\\1&2\\end{bmatrix}\\ne AB$。(3) $\\det A=4-6=-2$。(4) 行列式不為 $0$，有反方陣。(5) $B^2=I$。",
 t==[True,False,True,True,True],options=["$AB=\\begin{bmatrix}2&1\\\\4&3\\end{bmatrix}$","$AB=BA$","$A$ 的行列式值為 $-2$","$A$ 有反方陣","$B^2=I$"])
L2,L3=0.3010,0.4771
t=[int(50*L2)+1==16 and len(str(2**50))==16, int(str(3**20)[0])==3 and int(10**((20*L3)%1))==3, 6**10<10**8, L3/L2>1.6, len(str(5**30))==21 and int(30*(1-L2))+1==21]
add(S,10,"multi",5,"指數與對數",2,"已知 $\\log2\\approx0.3010$、$\\log3\\approx0.4771$。試選出正確的選項。",[1,2,3,5],
 "(1) $\\log2^{50}\\approx15.05$，$16$ 位數。(2) $\\log3^{20}\\approx9.542$，$10^{0.542}$ 介於 $3$ 與 $4$ 之間（$\\log3\\approx0.477<0.542<0.602\\approx\\log4$），最高位數字 $3$。(3) $\\log6^{10}\\approx7.78<8$。(4) $\\log_23=\\dfrac{0.4771}{0.3010}\\approx1.585<1.6$，錯。(5) $\\log5^{30}=30\\times0.6990=20.97$，$21$ 位數。",
 t==[True,True,True,False,True],options=["$2^{50}$ 是 $16$ 位數","$3^{20}$ 的最高位數字是 $3$","$6^{10}<10^8$","$\\log_23>1.6$","$5^{30}$ 是 $21$ 位數"])
p,se,fp=F(2,100),F(9,10),F(5,100); pos=p*se+(1-p)*fp; post=p*se/pos; npv=(1-p)*(1-fp)/(1-pos)
post2=p*se*se/(p*se*se+(1-p)*fp*fp)
t=[pos==F(67,1000), post>F(1,2), F(1,4)<post<F(3,10), npv>F(99,100), post2>F(8,10)]
add(S,11,"multi",5,"條件機率",3,"某種快篩：有感染的人檢驗呈陽性的機率為 $90\\%$；沒有感染的人檢驗呈陽性的機率為 $5\\%$。已知某群體中有 $2\\%$ 的人感染。從中隨機選一人檢驗，試選出正確的選項。",[1,3,4,5],
 "(1) $P(\\text{陽})=0.02\\times0.9+0.98\\times0.05=0.067$。(2)(3) $P(\\text{感染}\\mid\\text{陽})=\\dfrac{0.018}{0.067}\\approx0.269$，小於 $\\dfrac12$，介於 $0.25$ 與 $0.3$。(4) $P(\\text{未感染}\\mid\\text{陰})=\\dfrac{0.98\\times0.95}{0.933}\\approx0.998$。(5) 兩次都陽性：$\\dfrac{0.02\\times0.81}{0.02\\times0.81+0.98\\times0.0025}\\approx0.869$。",
 t==[True,False,True,True,True],options=["此人檢驗呈陽性的機率為 $0.067$","若此人呈陽性，則他有感染的機率大於 $\\dfrac12$","若此人呈陽性，則他有感染的機率介於 $0.25$ 與 $0.3$ 之間","若此人呈陰性，則他沒有感染的機率大於 $0.99$","若此人再獨立檢驗一次（兩次結果在給定是否感染時互相獨立），兩次都呈陽性，則他有感染的機率大於 $0.8$"])
an={3*n-1 for n in range(1,101)}; bn={5*m-2 for m in range(1,61)}; com=sorted(an&bn)
allc=sorted(set(3*n-1 for n in range(1,400))&set(5*m-2 for m in range(1,400)))
t=[allc[0]==8, all(allc[i+1]-allc[i]==15 for i in range(10)), len(com)==20, sum(3*n-1 for n in range(1,11))==160, (2026+2)%5==0]
add(S,12,"multi",5,"數列",3,"數列 $a_n=3n-1$、$b_n=5n-2$（$n$ 為正整數）。同時出現在兩個數列中的數稱為「共同項」。試選出正確的選項。",[1,2,3],
 "$a_n$ 除以 $3$ 餘 $2$，$b_n$ 除以 $5$ 餘 $3$，同時滿足的最小正整數是 $8$，之後每 $15$ 出現一次：$8,23,38,\\dots$。(3) $a_1$ 到 $a_{100}$ 是 $2$ 到 $299$，$b_1$ 到 $b_{60}$ 是 $3$ 到 $298$；$8+15k\\le298$ 得 $k\\le19$，共 $20$ 個。(4) $a_1+\\dots+a_{10}=3\\times55-10=155$，錯。(5) $2026+2=2028$ 不是 $5$ 的倍數，錯。",
 t==[True,True,True,False,False],options=["最小的共同項是 $8$","共同項由小到大排列成等差數列，公差為 $15$","$a_1$ 到 $a_{100}$ 與 $b_1$ 到 $b_{60}$ 之間的共同項恰有 $20$ 個","$a_1+a_2+\\dots+a_{10}=160$","$2026$ 是數列 $\\langle b_n\\rangle$ 的某一項"])
xs_=np.linspace(-20,30,500001); mn=min(np.hypot(xs_-1,2)+np.hypot(xs_-7,10))
fm13=B("13-1")+"\\sqrt{"+B("13-2")+"}"
add(S,13,"fill",5,"坐標幾何",2,"坐標平面上 $A(1,2)$、$B(7,10)$，點 $P$ 在 $x$ 軸上移動。則 $\\overline{PA}+\\overline{PB}$ 的最小值為 $"+fm13+"$。（化成最簡根式）","65",
 "$A$、$B$ 在 $x$ 軸同側。把 $B$ 對 $x$ 軸鏡射得 $B'(7,-10)$，$\\overline{PB}=\\overline{PB'}$，所以 $\\overline{PA}+\\overline{PB}\\ge\\overline{AB'}=\\sqrt{6^2+12^2}=\\sqrt{180}=6\\sqrt5$，當 $P$ 在 $\\overline{AB'}$ 與 $x$ 軸的交點 $(2,0)$ 時成立。",
 isclose(mn,6*sqrt(5),abs_tol=1e-6) and isclose(math.dist((2,0),(1,2))+math.dist((2,0),(7,10)),6*sqrt(5)),fmt=fm13)
w=sum(1 for p in set(itertools.permutations("BANANA")) if "AA" not in "".join(p))
add(S,14,"fill",5,"排列組合",2,"將 $\\text{BANANA}$ 這 $6$ 個字母全部排成一列，且任兩個 $\\text{A}$ 都不相鄰，共有 $"+fmt_digits(14,2)+"$ 種排法。",str(w),
 "先排 $\\text{B}$、$\\text{N}$、$\\text{N}$：$\\dfrac{3!}{2!}=3$ 種。它們之間與兩端共有 $4$ 個空位，選 $3$ 個放 $\\text{A}$：$C^4_3=4$。共 $3\\times4=12$ 種。",w==12,fmt=fmt_digits(14,2))
dg=sqrt(25+64-2*5*8*cos(2*pi/3))
fm15="\\sqrt{"+B("15-1")+B("15-2")+B("15-3")+"}"
add(S,15,"fill",5,"餘弦定理",2,"平行四邊形 $ABCD$ 中，$\\overline{AB}=8$、$\\overline{AD}=5$、$\\angle BAD=60^\\circ$。則較長的對角線長為 $"+fm15+"$。","129",
 "較長的對角線對著鈍角 $\\angle ABC=120^\\circ$：$\\overline{AC}^2=8^2+5^2-2\\times8\\times5\\cos120^\\circ=64+25+40=129$，$\\overline{AC}=\\sqrt{129}$。另一條 $\\overline{BD}^2=89-40=49$，$\\overline{BD}=7$ 較短。",
 isclose(dg,sqrt(129)) and sqrt(89-40)<dg,fmt=fm15)
tick=[500]+[100]*3+[0]*6; E=F(sum(tick[i]+tick[j] for i,j in itertools.permutations(range(10),2)),90)
add(S,16,"fill",5,"期望值",2,"摸彩箱中有 $10$ 張彩券：$1$ 張 $500$ 元、$3$ 張 $100$ 元，其餘 $6$ 張沒有獎金。從中隨機抽出 $2$ 張（不放回），獎金總和的期望值為 $"+fmt_digits(16,3)+"$ 元。",str(E),
 "每一張被抽中的機率都是 $\\dfrac{2}{10}$，期望值 $=\\dfrac{2}{10}\\times(500+300)=160$ 元。",E==160,fmt=fmt_digits(16,3))
def paths(bad):
    dp={}
    for i in range(6):
        for j in range(5):
            if (i,j) in bad: dp[i,j]=0
            elif i==0 and j==0: dp[i,j]=1
            else: dp[i,j]=dp.get((i-1,j),0)+dp.get((i,j-1),0)
    return dp[5,4]
pp=paths({(2,2),(4,3)})
add(S,17,"fill",5,"排列組合",3,"坐標平面上只能沿格線向右或向上走，每次走 $1$ 單位。從 $(0,0)$ 走到 $(5,4)$，且不經過 $(2,2)$ 也不經過 $(4,3)$ 的走法共有 $"+fmt_digits(17,2)+"$ 種。",str(pp),
 "全部 $C^9_4=126$。經過 $(2,2)$：$C^4_2\\times C^5_2=60$；經過 $(4,3)$：$C^7_3\\times C^2_1=70$；兩點都經過：$C^4_2\\times C^3_1\\times C^2_1=36$。不經過兩點：$126-60-70+36=32$。",
 pp==32 and paths(set())==126,fmt=fmt_digits(17,2))
G="訊號覆蓋：坐標平面上（單位：公里），基地台位於原點 $O$，訊號覆蓋範圍是以 $O$ 為圓心、半徑 $5$ 的圓及其內部。一條筆直道路沿直線 $L:x+y=6$ 鋪設。"
add(S,18,"single",3,"直線與圓",1,"道路 $L$ 上離基地台最近的點為下列哪一個？",2,
 "從 $O$ 作 $L$ 的垂線，垂足在直線 $y=x$ 上，$2x=6$，得 $(3,3)$。距離 $3\\sqrt2\\approx4.24<5$，所以道路會穿過覆蓋範圍。",
 isclose(math.dist((0,0),(3,3)),6/sqrt(2)) and 3+3==6,options=["$(2,4)$","$(3,3)$","$(6,0)$","$(1,5)$","$(\\sqrt{3},\\sqrt{3})$"],group=G)
fm19="\\,"+B("19-1")+"\\sqrt{"+B("19-2")+"}\\,"
add(S,19,"fill",6,"直線與圓",2,"道路 $L$ 位在覆蓋範圍內的那一段長為 $"+fm19+"$ 公里。（化成最簡根式）","27",
 "圓心到 $L$ 的距離 $d=\\dfrac{6}{\\sqrt2}=3\\sqrt2$，弦長 $=2\\sqrt{5^2-d^2}=2\\sqrt{25-18}=2\\sqrt7$。",
 isclose(2*sqrt(25-18),2*sqrt(7)),fmt=fm19,group=G)
s=(12-sqrt(144-88))/4; tt=sqrt(2)*s
fm20=B("20-1")+"\\sqrt{2}-\\sqrt{"+B("20-2")+"}"
add(S,20,"fill",6,"直線與圓",3,"一輛車從 $L$ 上的點 $(6,0)$ 出發，沿 $L$ 往 $(0,6)$ 的方向行駛。車子行駛 $"+fm20+"$ 公里後，第一次進入覆蓋範圍。","37",
 "由第 18 題，$(3,3)$ 是弦的中點，$(6,0)$ 到 $(3,3)$ 的距離為 $3\\sqrt2$。由第 19 題，半弦長 $\\sqrt7$。所以進入點距出發點 $3\\sqrt2-\\sqrt7$ 公里（約 $1.60$）。",
 isclose(tt,3*sqrt(2)-sqrt(7)) and isclose(math.dist((6-s,s),(0,0)),5),fmt=fm20,group=G)

for subj in "AB":
    qs=[q for q in Q if q["subject"]==subj]
    assert [q["no"] for q in qs]==list(range(1,21))
    assert sum(q["points"] for q in qs)==100, sum(q["points"] for q in qs)
json.dump(Q,open("data/mock-questions.json","w"),ensure_ascii=False,indent=1)
open("/workspace/promo/mock/verify-log.txt","w").write("\n".join(CHECKS)+f"\n\n全部 {len(Q)} 題驗算通過；數A、數B 各 100 分。\n")
print("\n".join(CHECKS)); print("TOTAL",len(Q))
