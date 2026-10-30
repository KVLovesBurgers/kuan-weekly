/**
 * English lecture notes (DRAFT for the English-market setup, 2026-10-30; not deployed).
 * Only list files that exist under public/pdf/en/. Map: /workspace/promo/en-market-20261030/EN_NOTES_MAP.tsv
 */
/** Chinese sheet driveId -> site-relative EN PDF path (17 translated sheets). */
export const EN_NOTES: Record<string, string> = {
  "1GpDzykD27BaH7GcnPIWOYmXlFqoKKg1m": "/pdf/en/ey16-vector-head-to-tail.pdf", // 學測一眼懂 #16
  "16Q8UBbM9TQy_Td01cDqZZHZCg643LVJU": "/pdf/en/ey28-filter-decay-log.pdf", // 學測一眼懂 #28
  "1WCsZRivJ68te1jn7WFYIEFixHieVV0EI": "/pdf/en/ey21-diff-of-squares99x101.pdf", // 畫圖一眼懂 #21
  "1j3QXMRTUhBANKkpMjj5iXuSX-Issb_C9": "/pdf/en/gsat-real2-adjacent-blocks.pdf", // 學測真題 #2
  "1t5M_odF6LCwlPCe_TQWxmG6aPrX3SvoI": "/pdf/en/ey22-combinations-choose.pdf", // 學測一眼懂 #22
  "1Kgja9H0S8OxXVkiOhl-NEcpj-c-AjG2O": "/pdf/en/ey15-tan-is-slope.pdf", // 畫圖一眼懂 #15
  "1dNoiI1vesdR-uv9DhG6kmfZTdLgkP0wz": "/pdf/en/ey17-unit-circle-pythag17.pdf", // 畫圖一眼懂 #17
  "1B4MBdG34wQMPdwygTln2yIxd3nye4XyC": "/pdf/en/ey23-circle-equation.pdf", // 畫圖一眼懂 #23
  "1eFQG9fg1DMlX6k-AaH4WEFzHN7kI0jqW": "/pdf/en/ey19-sum1to100-stairs.pdf", // 畫圖一眼懂 #19
  "1X9EMH_cbhLwf0zNNUr7yyCcA0H6DneaR": "/pdf/en/ey20-two-dice-sum7.pdf", // 學測一眼懂 #20
  "1m45Ln5tgxuwP_jyUcU-Fy7wkQ8Ui5I4P": "/pdf/en/gsat-real1-isosceles-collinear.pdf", // 學測真題 #1
  "1YK2q2BYjLBBr-jlK4eL6R0X89FrjHMJI": "/pdf/en/ey24-dot-product-perp.pdf", // 學測一眼懂 #24
  "1dHMCCWgeDL5JsTmHZUgGBVQH6MPnd06H": "/pdf/en/ey26-std-dev-shift.pdf", // 學測一眼懂 #26
  "108wOij62LPGPzgTfqnVlnEFvuFAXg499": "/pdf/en/ey18-log-meaning.pdf", // 學測一眼懂 #18
  "1NB5HWRZl0NVXy5wpa7I8gSohv39_Pg_f": "/pdf/en/ey25-law-of-cosines.pdf", // 畫圖一眼懂 #25
  "1yE12VdICrQKtfKYq7TwKaOjKuuRNGqib": "/pdf/en/ey29-odd-number-squares.pdf", // 畫圖一眼懂 #29
  "1Gwcn1UBU5nwBn3iUXdj8kXvdPikvW7zv": "/pdf/en/ey27-abs-value-inequality.pdf", // 畫圖一眼懂 #27
};

/** EN notes for videos with no row in PRACTICE_SHEETS (31). */
export const EN_STANDALONE: { id: string; label: string; title: string; href: string }[] = [
  { id: "vp-en-neg3sq", label: "Midterm Trap #13", title: "Is −3² equal to 9? Squaring negative numbers", href: "/pdf/en/neg3-squared.pdf" },
  { id: "vp-en-9coy2mpdbw",  label: "Draw-It #3",  title: "Negative × Negative = Positive",  href: "/pdf/en/ey3-neg-times-neg.pdf" },
  { id: "vp-en-woccp5chu",  label: "Saber Math Short #1",  title: "Graph a Line — Intercept First, Then Slope",  href: "/pdf/en/graph-linear.pdf" },
  { id: "vp-en-22lhxei8lb",  label: "Saber Math Short #2",  title: "See It at a Glance — sin(θ + 90°) Without Memorizing",  href: "/pdf/en/sin-plus90-no-memorize.pdf" },
  { id: "vp-en-3kkvhhofmx",  label: "Draw-It #6",  title: "(a − b)²: Don't Drop the Middle Term",  href: "/pdf/en/ey6-aminus-bsquared.pdf" },
  { id: "vp-en-6c3ufsn8lk",  label: "Midterm Trap #4",  title: "Parallel Lines & Similar Triangles",  href: "/pdf/en/parallel-similar.pdf" },
  { id: "vp-en-9bforbtfwa",  label: "Saber Math Short #3",  title: "Digital SAT Math — Key English Phrases Companion",  href: "/pdf/en/digital-sathandout.pdf" },
  { id: "vp-en-buelqx0wxk",  label: "Midterm Trap #1",  title: "Nested Radicals: Big Minus Small",  href: "/pdf/en/nested-radical.pdf" },
  { id: "vp-en-ekbaj3fdpv",  label: "Exam Trap #2",  title: "Counting Terms in an Arithmetic Sequence",  href: "/pdf/en/counting-terms.pdf" },
  { id: "vp-en-feqsawa8a1",  label: "Midterm Trap #3",  title: "−12 ÷ 4 × 3: Left to Right",  href: "/pdf/en/order-of-operations.pdf" },
  { id: "vp-en-ldvqtxp7bq",  label: "Real Exam #3",  title: "Taiwan GSAT Math A (2025) Q16: Why m = 0 Is Rejected",  href: "/pdf/en/gsat114-a16-tangent.pdf" },
  { id: "vp-en-ntzcs0chcu",  label: "Draw-It #9",  title: "Why sin 30° = 1/2",  href: "/pdf/en/ey9-sin30-half.pdf" },
  { id: "vp-en-tyn8aeurji",  label: "Saber Math Short #4",  title: "Digital SAT at a Glance — No Solution vs Infinitely Many",  href: "/pdf/en/satsystems.pdf" },
  { id: "vp-en-ukpuw0clkz",  label: "Midterm Trap #2",  title: "“Square Roots of 9” vs “√9”",  href: "/pdf/en/square-roots-of9.pdf" },
  { id: "vp-en-unimtbjbmb",  label: "Draw-It #1",  title: "sin(θ + 90°) = cos θ",  href: "/pdf/en/ey1-sin-plus90-1.pdf" },
  { id: "vp-en-upc7s7kltn",  label: "Draw-It #11",  title: "sin 20° = cos 70° (Complementary Angles)",  href: "/pdf/en/ey11-complementary.pdf" },
  { id: "vp-en-ysuatgmw3n",  label: "Saber Math Short #5",  title: "Why Flip and Multiply? Fraction Division",  href: "/pdf/en/fraction-division.pdf" },
  { id: "vp-en-ahl2msbsne",  label: "Draw-It #2",  title: "(a + b)² ≠ a² + b²",  href: "/pdf/en/ey2-aplus-bsquared2.pdf" },
  { id: "vp-en-aoo2ejz1ji",  label: "Draw-It #7",  title: "Why sin θ Never Exceeds 1",  href: "/pdf/en/ey7-sin-max-is-one.pdf" },
  { id: "vp-en-adam75g92c",  label: "Saber Math Short #6",  title: "Radicals, Once and for All — √9 vs x² = 9",  href: "/pdf/en/root-nine-not-plus-minus.pdf" },
  { id: "vp-en-b0xeqbfzc4",  label: "Saber Math Short #7",  title: "Trig Check — sin(A + B) ≠ sin A + sin B",  href: "/pdf/en/sin-sum-not-split.pdf" },
  { id: "vp-en-f47rmuhjks",  label: "Draw-It #5",  title: "Pythagorean Theorem by Area",  href: "/pdf/en/ey5-pythagoras-area.pdf" },
  { id: "vp-en-hgr6fqtxrq",  label: "Saber Math Short #8",  title: "Ninth-Grade Exam at a Glance — Inscribed Angle = Half the Central Angle",  href: "/pdf/en/inscribed-angle.pdf" },
  { id: "vp-en-il7k0sr2l7",  label: "Draw-It #4",  title: "Slope = Rise ÷ Run",  href: "/pdf/en/ey4-slope-rise-run.pdf" },
  { id: "vp-en-kvo4dshkon",  label: "Draw-It #10",  title: "(a + b)² Is Not a² + b²",  href: "/pdf/en/ey10-aplus-bsquared.pdf" },
  { id: "vp-en-ktszbvuot7",  label: "Draw-It #12",  title: "Difference of Squares by Cut and Paste",  href: "/pdf/en/ey12-diff-squares-cut-paste.pdf" },
  { id: "vp-en-mrvnxiv2za",  label: "Exam Trap #1",  title: "Radical Equations: Check, Don't Divide",  href: "/pdf/en/radical-equation-trap.pdf" },
  { id: "vp-en-rwx1cshzxg",  label: "Exam Trap #3",  title: "Common Midterm Mistake: Conditional Probability with Two Dice",  href: "/pdf/en/conditional-dice.pdf" },
  { id: "vp-en-vklobk3pah",  label: "Draw-It #8",  title: "sin²θ + cos²θ = 1",  href: "/pdf/en/ey8-sin-cos-unit-circle8.pdf" },
  { id: "vp-en-vuqpufxzwo",  label: "Draw-It #14",  title: "Why π = 180° (Radians)",  href: "/pdf/en/ey14-radian-pi180.pdf" },
  { id: "vp-en-yjdxydppkp",  label: "Draw-It #30",  title: "Midpoint Triangle & Area Ratios",  href: "/pdf/en/ey30-midpoint-triangle.pdf" },
];
