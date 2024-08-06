const puppeteer = require('puppeteer');

// create new function
// access response object express provides for us and pass it as a parameter to scrapeLogic
// within scrapeLogic, access response object and use it to send a response "..."
const scrapeLogic = async res => {
	// Launch the browser and open a new blank page
	const browser = await puppeteer.launch(); // outside of try-catch block because we want it to be accessible within the finally scope below
	// if something goes wrong with puppeteer's launch method within try, that will going to crash our app

	// wrap scrapeLogic in try-catch-finally
	try {
		const page = await browser.newPage();
		// throw new Error('Whoops!'); // dummy error

		// Navigate the page to a URL.
		await page.goto('https://developer.chrome.com/');

		// Set screen size.
		await page.setViewport({ width: 1080, height: 1024 });

		// Type into search box.
		await page.locator('.devsite-search-field').fill('automate beyond recorder');

		// Wait and click on first result.
		await page.locator('.devsite-result-item-link').click();

		// Locate the full title with a unique string.
		const textSelector = await page.locator('text/Customize and automate').waitHandle();
		const fullTitle = await textSelector?.evaluate(el => el.textContent);

		// Print the full title.
		const logStatement = `The title of this blog post is ${fullTitle}`;
		console.log(logStatement);
		res.send(logStatement);
	} catch (e) {
		console.error(e);
		// in case we catch error, also send a response to the user
		res.send(`Something went wrong while running Puppeteer: ${e}`);
	} finally {
		// have the browser close no matter what
		await browser.close();
	}
};

// export it as named export using module.export
module.exports = { scrapeLogic };