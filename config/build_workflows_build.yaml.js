
`
name: Build Vue Project

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: build vue project "prj1"
        working-directory: ./prj1
        run: |
          yarn install
          yarn build
      - name: build vue project "prj2"
        working-directory: ./prj2
        run: |
          yarn install
          yarn build
      - name: Commit to special path
        env:
          # 仓库用户名
          REPO_USERNAME: ""
          # GitHub Pages仓库名
          DIST_REPO: ""
          # GitHub Token
          GITHUB_TOKEN: \${{ secrets.ACT_TOKEN }}
        run: |
          rm -rf .git
          mv ./prj1/dist ./prj1_view
          mv ./prj2/dist ./prj2_view
          rm -rf ./prj1
          rm -rf ./prj2
          git config --global user.email "1134098699@qq.com"
          git config --global user.name "ibas"
          git init && git add .
          git commit -m "build at $(date +'%Y-%m-%d %H:%M:%S')"
          git push --force --quiet https://$GITHUB_TOKEN@github.com/SunIBAS/main.git master:views
`