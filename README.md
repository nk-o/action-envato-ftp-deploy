# Envato FTP Deploy

Deploy your ZIP files to Envato FTP.

## Configuration

### Required secrets

* `ENVATO_USERNAME` - your Envato username
* `ENVATO_PERSONAL_TOKEN` - personal token of Envato API <https://help.author.envato.com/hc/en-us/articles/360000472603-How-to-get-an-API-Key>
* `ZIP_FILES` - list of ZIP files to upload

[Secrets are set in your repository settings](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets). They cannot be viewed once stored.

## Example Workflow File

```yaml
name: Deploy to Envato FTP
on:
  push:
    tags:
    - "v*"
  pull_request:
    tags:
    - "v*"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master

      - name: Build
        run: |
          npm install
          npm run build

      - name: Deploy to Envato FTP
        uses: nk-o/action-envato-ftp-deploy@master
        with:
          ENVATO_USERNAME: ${{ secrets.ENVATO_USERNAME }}
          ENVATO_PERSONAL_TOKEN: ${{ secrets.ENVATO_PERSONAL_TOKEN }}
          ZIP_FILES: |
            ./dist/theme.zip
            ./dist/theme-full.zip
```
