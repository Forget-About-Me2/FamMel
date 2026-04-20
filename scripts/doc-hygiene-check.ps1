param(
    [string]$RepoRoot = ".",
    [int]$MaxCommitsSinceDocsRefresh = 5,
    [string]$DocsAnchorPath = "docs/index.md"
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

function Try-RunGit([string[]]$args) {
    $output = & git @args 2>$null
    if ($LASTEXITCODE -ne 0) {
        return $null
    }

    if ($null -eq $output) {
        return ""
    }

    if ($output -is [array]) {
        return ($output -join "`n").Trim()
    }

    return [string]$output
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

# 1b) Ensure documentation is refreshed periodically to prevent drift.
if ($MaxCommitsSinceDocsRefresh -lt 1) {
    Add-Error("MaxCommitsSinceDocsRefresh must be >= 1 (received: $MaxCommitsSinceDocsRefresh)")
}

if (-not (Test-Path $DocsAnchorPath)) {
    Add-Error("Docs anchor file is missing: $DocsAnchorPath")
}

$insideWorkTree = Try-RunGit @("rev-parse", "--is-inside-work-tree")
if ($insideWorkTree -eq "true") {
    $docChanges = Try-RunGit @("status", "--porcelain", "--", "docs")
    if ([string]::IsNullOrWhiteSpace($docChanges)) {
        $anchorCommit = Try-RunGit @("log", "-1", "--format=%H", "--", $DocsAnchorPath)
        if ([string]::IsNullOrWhiteSpace($anchorCommit)) {
            Add-Error("No committed history found for docs anchor: $DocsAnchorPath")
        } else {
            $commitsSinceAnchorRaw = Try-RunGit @("rev-list", "--count", "$anchorCommit..HEAD")
            $commitsSinceAnchor = 0

            if (-not [int]::TryParse($commitsSinceAnchorRaw, [ref]$commitsSinceAnchor)) {
                Add-Error("Unable to parse commit count since docs anchor: '$commitsSinceAnchorRaw'")
            } elseif ($commitsSinceAnchor -gt $MaxCommitsSinceDocsRefresh) {
                Add-Error("Documentation drift risk: $commitsSinceAnchor commits since '$DocsAnchorPath' was last updated (max allowed: $MaxCommitsSinceDocsRefresh). Recheck docs and regenerate if needed.")
            }
        }
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
