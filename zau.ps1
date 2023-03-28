# Powershell script to zip the content in the "dist" folder and upload it to itch.io

# Prerequisites:
# - Path to 7zip and butler need to be set as environment variables (in variable "Path")
# - You need to be already authenticated in butler
# - The name of the patch on itch.io and in package.json needs to be the same

# Get the path and version
$name = (Get-Content package.json) -join "`n" | ConvertFrom-Json | Select -ExpandProperty "name"    # get name of the project from package.json
$version = (Get-Content package.json) -join "`n" | ConvertFrom-Json | Select -ExpandProperty "version" # get version of the project from package.json

# Variables of the names and paths
$archiveName = "$name-$version.zip"         # name of the zip file
$zipPath = "./Builds/$archiveName"          # path to the zip file
$source = "./dist/*"                        # files which should be zipped (everything in dist folder)
$itchPath = "stiggstogg/$name" + ":html5"   # path of the itch.io project to which the file should be uploaded

# Overview
Write-Host "`nZIP 'n' Upload" -ForegroundColor Yellow
Write-Host "===============`n" -ForegroundColor Yellow
Write-Host "Name:     $name"
Write-Host "Version:  " -NoNewLine
Write-Host "$version" -ForegroundColor Yellow -BackgroundColor Blue
Write-Host "Zip:      $archiveName`n"

# Ask if the parameters are ok
Write-Host "Everything ok? [y/N] " -ForegroundColor Yellow -NoNewline
if ($(Read-Host) -eq "y")
{
    $execute = $true
}
else
{
    $execute = $false
}

# Check if file does already exist
if ($execute -And $(Test-Path -Path $zipPath))
{
    Write-Host "`n$archiveName does already exist.`nDo you want to continue and overwrite it? [y/N] " -ForegroundColor Red -NoNewline
    if ($(Read-Host) -eq "y")
    {
        Remove-Item $zipPath                                   # delete existing zip (otherwise just the new files will be added by 7zip
        Write-Host "`n$zipPath deleted." -ForegroundColor Red
    }
    else {
        $execute = $false
    }
}

# Execution of the zip and upload
if ($execute)
{
    Write-Host "`nExecuting ZIP:" -ForegroundColor Green

    7z a $zipPath $source                                     # create archive with 7zip

    Write-Host "`nUpload to itch.io:" -ForegroundColor Green

    butler push $zipPath $itchPath --userversion $version

    Write-Host "`nEverything Done!`n" -ForegroundColor Green
}
else
{
    Write-Host "`nCanceled! Nothing done.`n"  -ForegroundColor Red
}