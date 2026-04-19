param(
    [string]$RepoRoot = "."
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repo = Resolve-Path $RepoRoot
Set-Location $repo

$errors = New-Object System.Collections.Generic.List[string]

function Add-Error([string]$message) {
    $errors.Add($message)
}

function Read-Text([string]$path) {
    return Get-Content -Raw -Encoding UTF8 -Path $path
}

# 1) Deprecated artifacts should be deleted once they have no consumers.
$deprecatedArtifacts = @(
    "triage-commits.txt",
    "triage-diffstat.txt",
    "triage-files.txt",
    "triage-userflow-commits.txt",
    "triage-userflow-diffstat.txt",
    "REFACTOR_PLAN/coverage-confidence-gate-new.md",
    "REFACTOR_PLAN/coverage-confidence-gate-pre-merge.md",
    "triage-commits-vs-origin-master.txt",
    "triage-diffstat-vs-origin-master.txt",
    "triage-files-vs-origin-master.txt",
    "triage-userflow-commits-vs-origin-master.txt",
    "triage-userflow-diffstat-vs-origin-master.txt"
)

foreach ($path in $deprecatedArtifacts) {
    if (Test-Path $path) {
        Add-Error("Deprecated artifact should be deleted: $path")
    }
}

# 2) Detect duplicate status headings across plan docs.
$planFiles = Get-ChildItem "REFACTOR_PLAN" -Filter "*.md" -File
$statusHeadingMap = @{}

foreach ($file in $planFiles) {
    $text = Read-Text $file.FullName
    $hasStatusHeading = $text -match "(?im)^#{1,6}\s+status\b"
    if ($hasStatusHeading) {
        if (-not $statusHeadingMap.ContainsKey("status")) {
            $statusHeadingMap["status"] = New-Object System.Collections.Generic.List[string]
        }
        $statusHeadingMap["status"].Add($file.Name)
    }
}

if ($statusHeadingMap.ContainsKey("status") -and $statusHeadingMap["status"].Count -gt 1) {
    $files = ($statusHeadingMap["status"] -join ", ")
    Add-Error("Duplicate STATUS headings found in plan docs: $files")
}

if ($errors.Count -gt 0) {
    Write-Host "Doc hygiene check failed:" -ForegroundColor Red
    foreach ($err in $errors) {
        Write-Host "- $err" -ForegroundColor Red
    }
    exit 1
}

Write-Host "Doc hygiene check passed." -ForegroundColor Green
exit 0
