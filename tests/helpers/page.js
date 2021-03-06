const puppeteer = require('puppeteer');
const sessionFactory = require("../factories/sessionFactory");
const userFactory = require("../factories/userFactory");

class CustomPage {
    constructor(page) {
        this.page = page;
    }

    static async build() {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbhttp://lx']
        });
        const page = await browser.newPage();
        const customPage = new CustomPage(page);
        return new Proxy(customPage, {
            get: function (target, property) {
                return customPage[property] || browser[property] || page[property];
            }
        });
    }

    async login() {
        const user = await userFactory();
        const {sessionString, sig} = sessionFactory(user);

        await this.page.setCookie({name: 'session', value: sessionString});
        await this.page.setCookie({name: 'session.sig', value: sig});

        await this.page.goto("http://localhost:3000/blogs");

        await this.page.waitFor('a[href="/auth/logout"]');

    }

    async getContentOf(selector) {
        return this.page.$eval(selector, el => el.innerHTML);
    }
}


module.exports = CustomPage;