import { By, until } from 'selenium-webdriver';
import { config } from '../support/config.js';

export default class HomePage {
    constructor(driver) {
        this.driver = driver;

        // Headline / any generic visible element once the home page has loaded
        this.sectionHeadline = By.css('h1, h2, .hero-title, .page-title, .banner-title');

        // Main navigation menu
        this.menuProducts = By.xpath(
            "//a[@class='nav-link collapse-button collapsed' and contains(., 'Productos')]"
        );

        // Element inside the "Products" dropdown to confirm it was opened
        this.productMenuPanelItem = By.xpath(
            "//*[contains(., 'Facephi Authentication') or contains(., 'Facephi Onboarding') or contains(., 'Facephi Identity Platform')]"
        );

        // "Contacta" button (desktop CTA)
        this.menuContact = By.css('div.site-ctas.d-none.d-xl-block a#header-cta-contact');

        // Generic headlines
        this.sectionHeadline = By.css('h1, h2, .hero-title, .page-title');

        // Cookie banner (based on your screenshot: buttons like “Accept all cookies” and “Reject cookies”)
        this.cookieModal = By.css("div[role='dialog'], .CybotCookiebotDialog, .CookiebotDialog");
        this.cookieAcceptAllButton = By.xpath(
            "//button[contains(., 'Permitir todas las cookies') or contains(., 'Aceptar') or contains(., 'Accept')]"
        );
        this.cookieRejectButton = By.xpath(
            "//button[contains(., 'Rechazar') or contains(., 'Reject')]"
        );
    }

    // Dynamic locator for main menu sections
    getMenuLocator(section) {
        return By.xpath(
            `//a[@class='nav-link collapse-button collapsed' and contains(., '${section}')]`
        );
    }

    // Dynamic locator for submenu items
    getSubMenuLocator(subSection) {
        return By.xpath(`//span[@class='nav-item-just-name' and contains(., '${subSection}')]`);
    }

    async open() {
        await this.driver.get(config.baseUrl);

        // Wait for the page body to be visible
        await this.driver.wait(until.elementLocated(By.css('body')), config.defaultTimeout);

        // Try closing the cookie banner if present
        await this.acceptCookiesIfPresent();

        // Ensure that the main content is visible behind the popup
        await this.driver.wait(until.elementLocated(this.sectionHeadline), config.defaultTimeout);
    }

    async acceptCookiesIfPresent() {
        try {
            // Check if the cookie popup exists
            const modal = await this.driver.findElements(this.cookieModal);
            if (modal.length === 0) {
                // Nothing to close -> exit
                return;
            }

            // Try clicking on “Accept all cookies”
            const allowBtns = await this.driver.findElements(this.cookieAcceptAllButton);
            if (allowBtns.length > 0) {
                await allowBtns[0].click();
                return;
            }

            // If “Accept” not found, try “Reject cookies”
            const rejectBtns = await this.driver.findElements(this.cookieRejectButton);
            if (rejectBtns.length > 0) {
                await rejectBtns[0].click();
                return;
            }

            // If neither accept nor reject is found, continue (don’t break the test)
        } catch (err) {
            // Do not stop the tests due to cookie banner issues
            console.warn('Could not handle cookie banner:', err.message);
        }
    }

    async goToSection(section) {
        const locator = this.getMenuLocator(section);

        const link = await this.driver.wait(until.elementLocated(locator), config.defaultTimeout);

        // Click to force the mega-menu to open
        await link.click();

        // Wait for at least one item in the "Products" dropdown to appear
        await this.driver.wait(until.elementLocated(this.productMenuPanelItem), config.defaultTimeout);
    }

    async goToSubSection(subSection) {
        const locator = this.getSubMenuLocator(subSection);

        const link = await this.driver.wait(until.elementLocated(locator), config.defaultTimeout);

        // Click to open the related submenu
        await link.click();

        // Wait for some content to appear in the dropdown
        await this.driver.wait(until.elementLocated(this.productMenuPanelItem), config.defaultTimeout);
    }

    async goToContact() {
        // 1. Locate the "Contacta" link ONLY within the desktop CTA block
        const contactLink = await this.driver.wait(
            until.elementLocated(By.css('div.site-ctas.d-none.d-xl-block a#header-cta-contact')),
            config.defaultTimeout
        );

        // 2. Ensure it’s visible/clickable
        await this.driver.executeScript("arguments[0].scrollIntoView({block:'center'});", contactLink);
        await this.driver.wait(until.elementIsVisible(contactLink), config.defaultTimeout);

        // 3. Stable click (via JS) to avoid overlays or hover transitions
        await this.driver.executeScript('arguments[0].click();', contactLink);

        // 4. If the navigation opens a new URL in the SAME tab:
        //    wait until the URL contains /contacta
        try {
            await this.driver.wait(until.urlContains('/contacta'), config.defaultTimeout);
        } catch (e) {
            // If the URL didn’t change, it might have opened in another tab
            // Switch to the newest tab if needed
            const handles = await this.driver.getAllWindowHandles();
            if (handles.length > 1) {
                await this.driver.switchTo().window(handles[handles.length - 1]);
            }
        }

        // 5. Wait until the contact page has loaded:
        //    form, input fields, textareas, main heading... anything to validate readiness
        const contactPageReady = By.css("form, input, textarea, h1, h2, .contact-form, [name='email']");

        await this.driver.wait(until.elementLocated(contactPageReady), config.defaultTimeout);
    }

    async getPageHeadline() {
        const el = await this.driver.wait(
            until.elementLocated(this.sectionHeadline),
            config.defaultTimeout
        );
        return el.getText();
    }
}
