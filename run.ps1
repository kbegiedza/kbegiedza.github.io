$ProjectPath = ${PWD}.Path

Write-Host $ProjectPath

docker.exe build -t kbegiedza/jekyll -f .\Dockerfile .
docker.exe run -it --rm -v ${ProjectPath}:/project -p 4000:4000 --name jekyll kbegiedza/jekyll