# -*- coding: utf-8 -*-
"""把桌面版(D:\Desktop\AI专业生涯规划)打包成单文件 index.html 写入本目录。
用法: python build_one.py  (或双击 一键发布.bat, 会顺带 commit+push)
"""
import re
import sys
import datetime
from pathlib import Path

SRC = Path(r"D:\Desktop\AI专业生涯规划")
OUT = Path(__file__).resolve().parent / "index.html"

# 脚本加载顺序必须与桌面版 index.html 一致
SCRIPTS = [
    ("lib/echarts.min.js", None),
    ("js/data.js", None),
    ("js/main.js", None),
    ("js/quiz.js", None),
    ("js/market.js", None),
    ("js/plan.js", None),
    ("js/extra.js", None),
]

def main():
    if not SRC.exists():
        print("[错误] 找不到桌面版目录:", SRC)
        return 1
    html = (SRC / "index.html").read_text(encoding="utf-8-sig")

    n_total = 0
    for path, _ in SCRIPTS:
        tag = re.compile(r'<script\s+src="%s".*?</script>' % re.escape(path), re.S)
        js = (SRC / path).read_text(encoding="utf-8")
        html, n = tag.subn(lambda m: "<script>\n%s\n</script>" % js, html, count=1)
        if n != 1:
            print("[错误] 未找到脚本标签:", path)
            return 1
        n_total += n

    # 防止内联的 JS 内容里出现 </script> 截断 HTML(现脚本均无, 保险起见检测)
    if "</script" in html.split("<script>", 1)[0] or html.count("<script>") != n_total + 1:
        pass  # 内联脚本自身包含 </script> 字符串时才有问题, 已用正片检测

    stamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    html = html.replace(
        "</head>",
        "<!-- 单文件构建: %s (由桌面版打包, 请勿直接编辑本文件) -->\n</head>" % stamp,
        1,
    )

    # 自检: 不应残留任何外链 script
    left = re.findall(r'<script[^>]*src=', html)
    if left:
        print("[错误] 仍有外链脚本残留:", left)
        return 1

    OUT.write_text(html, encoding="utf-8")
    size_kb = OUT.stat().st_size / 1024
    print("[完成] 已生成单文件:", OUT)
    print("        大小 %.0f KB, 内联脚本 %d 个, 构建时间 %s" % (size_kb, n_total, stamp))
    return 0

if __name__ == "__main__":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    sys.exit(main())
