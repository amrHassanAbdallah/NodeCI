const Page = require('./helpers/page');
let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('localhost:3000');
});

afterEach(async () => {
    await page.close();
});

test('The header has the correct logo', async () => {

    //form function to string to pass it to the browser.
    const text = await page.getContentOf('a.brand-logo');
    expect(text).toEqual('Blogster');

});

test('clicking login starts oauth flow', async () => {
    await page.click('.right a');
    const url = await page.url();
    expect(url).toMatch('accounts.google.com');
});


test('When signed in, shows logout button', async () => {
    await page.login();
    const text = await page.getContentOf('a[href="/auth/logout"]');
    expect(text).toEqual('Logout');
});
