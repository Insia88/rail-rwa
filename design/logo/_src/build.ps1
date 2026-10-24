# build.sh — rebuild RAIL brand assets + previews (run with PowerShell from _src)
#   powershell -File build.sh
$py = 'C:\Users\User\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe'
$src = 'C:\Users\User\Documents\deepseek-harness\default-workspace\rwa-nitro\design\logo\_src'
Set-Location $src

& $py build_brand.py assets
& $py build_brand.py favicons
foreach ($d in 'a','b','c') {
  node render.mjs "$src\favicon-$d.html" "$src\favicon-$d-32.png" 32 32 1 "#fav" | Select-Object -Last 1
}
& $py previews.py
