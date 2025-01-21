# Setup script for updating module navigation files

# Define base directory - assuming we're running from project root
$baseDir = "..\cb-scadot-ui"

# File paths
$moduleHeaderPath = Join-Path $baseDir "src\components\module\header\module-header.tsx"
$editorPagePath = Join-Path $baseDir "src\app\projects\[id]\modules\[moduleId]\editor\page.tsx"
$testPagePath = Join-Path $baseDir "src\app\projects\[id]\modules\[moduleId]\test\page.tsx"

# Ensure directories exist
$moduleHeaderDir = Split-Path $moduleHeaderPath -Parent
$editorPageDir = Split-Path $editorPagePath -Parent
$testPageDir = Split-Path $testPagePath -Parent

if (!(Test-Path $moduleHeaderDir)) {
    New-Item -ItemType Directory -Path $moduleHeaderDir -Force
}
if (!(Test-Path $editorPageDir)) {
    New-Item -ItemType Directory -Path $editorPageDir -Force
}
if (!(Test-Path $testPageDir)) {
    New-Item -ItemType Directory -Path $testPageDir -Force
}

# [Previous variable declarations for $moduleHeaderContent, $editorPageContent, and $testPageContent remain the same]

# Write files
Write-Host "Updating module header..."
Set-Content -Path $moduleHeaderPath -Value $moduleHeaderContent

Write-Host "Updating editor page..."
Set-Content -Path $editorPagePath -Value $editorPageContent

Write-Host "Updating test page..."
Set-Content -Path $testPagePath -Value $testPageContent

Write-Host "Setup completed successfully!"