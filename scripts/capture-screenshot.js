const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')

async function captureScreenshot() {
  let browser
  try {
    console.log('Launching browser...')
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    })

    console.log('Creating page...')
    const page = await browser.newPage()

    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    })

    console.log('Navigating to http://localhost:3000...')
    await page
      .goto('http://localhost:3000', {
        waitUntil: 'domcontentloaded',
        timeout: 20000,
      })
      .catch(() => console.log('Navigation completed with warnings'))

    console.log('Waiting for content to load...')
    await new Promise(r => setTimeout(r, 3000))

    // Create screenshots directory if it doesn't exist
    const screenshotsDir = path.join(__dirname, '../screenshots')
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true })
    }

    // Capture full page
    const filename = `screenshot-${new Date().toISOString().slice(0, 10)}-${Date.now()}.png`
    const filepath = path.join(screenshotsDir, filename)

    console.log('Taking screenshot...')
    await page.screenshot({
      path: filepath,
      fullPage: true,
      type: 'png',
    })

    console.log(`✓ Screenshot saved to: ${filepath}`)
    console.log(
      `  File size: ${(fs.statSync(filepath).size / 1024).toFixed(2)} KB`
    )
  } catch (error) {
    console.error('Error capturing screenshot:', error.message)
    process.exit(1)
  } finally {
    if (browser) await browser.close()
  }
}

captureScreenshot()
