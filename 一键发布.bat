@echo off
cd /d "C:\Users\LENOVO\ai-career-web"
echo [1/3] Build single-file HTML from desktop version...
python build_one.py
if errorlevel 1 goto :fail
echo [2/3] Commit and push to GitHub...
git add -A
git commit -m "Update single-file online version"
git push
echo.
echo Done. Link: https://traveller776688.github.io/ai-career-platform/
echo GitHub rebuilds the page in about 1 minute.
pause
exit /b 0
:fail
echo Build failed - nothing was pushed.
pause
exit /b 1
