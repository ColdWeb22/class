# Quick Render Deployment Script

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Render Deployment Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if git repo exists
if (-not (Test-Path ".git")) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    git branch -M main
    Write-Host "Git repository initialized!" -ForegroundColor Green
    Write-Host ""
}

# Check for GitHub remote
$remotes = git remote -v 2>$null
if (-not $remotes) {
    Write-Host "================================" -ForegroundColor Yellow
    Write-Host "  GitHub Repository Needed" -ForegroundColor Yellow
    Write-Host "================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Steps:" -ForegroundColor White
    Write-Host "1. Go to https://github.com/new" -ForegroundColor White
    Write-Host "2. Create a new repository (public or private)" -ForegroundColor White
    Write-Host "3. Copy the repository URL" -ForegroundColor White
    Write-Host "4. Run this command:" -ForegroundColor White
    Write-Host ""
    Write-Host "   git remote add origin YOUR_REPO_URL" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Then run this script again!" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit
}

Write-Host "Checking for changes..." -ForegroundColor Yellow
$status = git status --porcelain

if ($status) {
    Write-Host ""
    Write-Host "Changes to commit:" -ForegroundColor Green
    git status --short
    Write-Host ""
    
    $commit = Read-Host "Enter commit message (or press Enter for 'Ready for Render deployment')"
    if (-not $commit) {
        $commit = "Ready for Render deployment"
    }
    
    Write-Host ""
    Write-Host "Adding files..." -ForegroundColor Yellow
    git add .
    
    Write-Host "Committing..." -ForegroundColor Yellow
    git commit -m $commit
    
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "================================" -ForegroundColor Green
        Write-Host "  Successfully Pushed!" -ForegroundColor Green
        Write-Host "================================" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "Push failed. You may need to:" -ForegroundColor Red
        Write-Host "1. Set up GitHub authentication" -ForegroundColor Yellow
        Write-Host "2. Or run: git push -u origin main" -ForegroundColor Yellow
        Write-Host ""
        Read-Host "Press Enter to exit"
        exit
    }
} else {
    Write-Host "No changes to commit - already up to date!" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Next: Deploy on Render" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to: https://render.com" -ForegroundColor White
Write-Host "2. Sign up/Login with GitHub" -ForegroundColor White
Write-Host "3. Click 'New +' → 'Blueprint'" -ForegroundColor White
Write-Host "4. Select your repository" -ForegroundColor White
Write-Host "5. Click 'Apply'" -ForegroundColor White
Write-Host ""
Write-Host "Render will automatically:" -ForegroundColor Green
Write-Host "  ✓ Deploy backend and frontend" -ForegroundColor Green
Write-Host "  ✓ Create PostgreSQL database" -ForegroundColor Green
Write-Host "  ✓ Set up HTTPS URLs" -ForegroundColor Green
Write-Host "  ✓ Configure all environment variables" -ForegroundColor Green
Write-Host ""
Write-Host "See RENDER_DEPLOY.md for detailed instructions!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Opening Render in browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Start-Process "https://render.com"

Write-Host ""
Read-Host "Press Enter to exit"
