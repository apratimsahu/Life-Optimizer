# Azure Deployment Guide for Life Optimizer

## Prerequisites
- Azure account
- Azure CLI installed
- GitHub repository

## Option 1: Azure Static Web Apps (Recommended)

### Option A: Azure Portal (Easiest)
1. Go to [Azure Portal](https://portal.azure.com)
2. Search for "Static Web Apps" and create new
3. Choose GitHub and authorize
4. Select repository: `apratimsahu/Life-Optimizer`
5. Branch: `main`
6. Build preset: `React`
7. App location: `/`
8. Output location: `dist`

Azure will automatically create GitHub Actions workflow and deploy on every push to main.

### Option B: Azure CLI

#### Step 1: Install Azure CLI
```bash
# Install Azure CLI (Windows)
winget install Microsoft.AzureCLI
```

#### Step 2: Login and Create Static Web App
```bash
# Login to Azure
az login

# Create resource group
az group create --name life-optimizer-rg --location "Central India"

# Create static web app
az staticwebapp create \
  --name life-optimizer-app \
  --resource-group life-optimizer-rg \
  --source https://github.com/apratimsahu/Life-Optimizer \
  --location "Central India" \
  --branch main \
  --app-location "/" \
  --output-location "dist"
```

### Step 3: Build Configuration
Create `.github/workflows/azure-static-web-apps.yml`:
```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          output_location: "dist"

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

## Option 2: Azure App Service

### Step 1: Create App Service
```bash
# Create App Service plan
az appservice plan create \
  --name life-optimizer-plan \
  --resource-group life-optimizer-rg \
  --sku FREE \
  --location "Central India"

# Create web app
az webapp create \
  --name life-optimizer-webapp \
  --resource-group life-optimizer-rg \
  --plan life-optimizer-plan \
  --runtime "NODE|18-lts"
```

### Step 2: Deploy from Local Git
```bash
# Set up deployment credentials
az webapp deployment user set --user-name YOUR_USERNAME --password YOUR_PASSWORD

# Configure local git deployment
az webapp deployment source config-local-git \
  --name life-optimizer-webapp \
  --resource-group life-optimizer-rg

# Deploy
git remote add azure <git-clone-url>
npm run build
git add .
git commit -m "Deploy to Azure"
git push azure main
```

## Cost Monitoring

### Set up budget alerts
```bash
# Create budget
az consumption budget create \
  --budget-name "life-optimizer-budget" \
  --resource-group life-optimizer-rg \
  --amount 2000 \
  --category "Cost" \
  --time-grain "Monthly"
```

## Custom Domain Setup

### For Static Web Apps
```bash
# Add custom domain
az staticwebapp hostname set \
  --name life-optimizer-app \
  --resource-group life-optimizer-rg \
  --hostname "your-domain.com"
```

## Environment Variables
For production settings, add environment variables in Azure portal or via CLI:
```bash
az staticwebapp appsettings set \
  --name life-optimizer-app \
  --setting-names "NODE_ENV=production"
```

## Monitoring Setup
```bash
# Create Application Insights
az monitor app-insights component create \
  --app life-optimizer-insights \
  --location "Central India" \
  --resource-group life-optimizer-rg
```
