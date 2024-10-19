import { Browser } from "puppeteer";
import { getCurrencyCode } from "@/lib/helpers";
import UserAgent from "user-agents";
import logger from "./logger";

/**
 *
 * @param ebayUrl string
 * @param storeName string
 * @param retries int
 * @param Identity string
 * @param browser Browser => a pupetteer browser instance
 * @returns data
 */
export const scraper = async (
  ebayUrl: string,
  storeName: string,
  retries = 4,
  Identity: string,
  browser: Browser
): Promise<CSVData> => {
  logger.info("Recieved a scraping request, proceeding...");
  const page = await browser.newPage();
  const agent = new UserAgent();

  try {
    await page.setUserAgent(agent.toString());
    await page.setViewport({
      width: Math.floor(Math.random() * 800) + 800,
      height: Math.floor(Math.random() * 600) + 600,
    });

    logger.info(`Scraping ebay URL: ${ebayUrl}`);
    await page.goto(ebayUrl, {
      waitUntil: "domcontentloaded",
      timeout: 100000,
    }); // 100-second timeout

    // Extract the rank of the store from the page
    const rank = await page.evaluate((storeName: string) => {
      // Construct an array from the unordered list containing the listings, excluding unwanted `li` elements
      const listings = Array.from(
        document.querySelectorAll("ul.srp-results.srp-list.clearfix > li")
      ).filter((el) => {
        // Ignore `li` elements with these irrelevant classes
        const classList = el.classList;
        return !(
          classList.contains(
            "srp-river-answer srp-river-answer--BASIC_PAGINATION_V2 srp-river-answer--hide-pagination"
          ) &&
          (classList.contains(
            "srp-river-answer srp-river-answer--NAVIGATION_ANSWER_COLLAPSIBLE_CAROUSEL"
          ) ||
            classList.contains(
              "srp-river-answer srp-river-answer--REWRITE_START"
            ))
        );
      });

      let foundRank = 0;
      listings.some((el, index) => {
        // Find the span element that contains the store name
        const sellerInfoSpan = el.querySelector(
          "span.s-item__seller-info-text"
        );

        if (sellerInfoSpan && sellerInfoSpan.textContent) {
          const text = sellerInfoSpan.textContent.trim(); // Trim for clean comparison
          const extractedStoreName = text.split(" ")[0]; // Extract the store name

          if (extractedStoreName.includes(storeName)) {
            foundRank = index + 1; // Rank starts from 1
            return true; // Exit loop when store is found
          }
        }
        return false;
      });

      return foundRank;
    }, storeName);

    logger.info(
      `Found the rank of ${storeName} for the product ${Identity} at rank=${rank}`
    );

    // random movement to simulate human behaviour
    await page.mouse.down();

    // Extract the currency symbol
    const currency = await page.evaluate(() => {
      const priceElement = document.querySelector(
        "span.x-textrange__label.width-1.currency-label span"
      );
      return priceElement ? priceElement.textContent?.trim().charAt(0) : "$";
    });

    // Only call getCurrencyCode if currency is not undefined
    let currencyCode: string | undefined;
    if (currency) {
      currencyCode = getCurrencyCode(currency);
    } else {
      logger.error("Currency symbol not found");
    }
    logger.info(
      `Found the currnecy code of the product "${Identity}" to be CURRENCY= "${currency}",converted to => CURRENCY_CODE= "${currencyCode}"`
    );

    // random movement to simulate human behaviour
    await page.mouse.move(200, 200);

    await page.close();

    logger.info(
      `Finished scraping URL= ${ebayUrl} found rank=${rank}, CURRENCY_CODE=${currencyCode}`
    );
    return {
      Identity,
      eBayURL: ebayUrl,
      Rank: rank || 0, // Default to 0 if not found
      Currency: currencyCode,
    };
  } catch (error) {
    logger.error(`Error scraping URL ${ebayUrl}:`, error);
    await page.close();

    // Retry mechanism for failed requests
    if (retries > 0) {
      logger.info(`Retrying... Attempts left: ${retries}`);
      return scraper(ebayUrl, storeName, retries - 1, Identity, browser);
    }

    return {
      Identity,
      eBayURL: ebayUrl,
      Rank: 0,
      Currency: "USD", // Fallback values
    };
  }
};
