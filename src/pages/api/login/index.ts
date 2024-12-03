import { NextApiRequest, NextApiResponse } from "next";
import puppeteer, { Cookie } from "puppeteer";

function cookiesToString(cookies: Cookie[]): string {
  let cookieStirng = "";
  for (let index = 0; index < cookies.length; index++) {
    const cookie = cookies[index];
    cookieStirng += `${cookie.name}=${cookie.value}`;
    if (index !== cookies.length - 1) {
      cookieStirng += "; ";
    }
  }
  return cookieStirng;
}

async function getCookies(username: string, password: string): Promise<string> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.meican.com/auth/signin/mailPassword");
  await page.setViewport({ width: 375, height: 667 });
  const email = await page.waitForSelector('input[name="mail"]');
  const pwd = await page.waitForSelector('input[name="password"]');
  await email?.type(username);
  await pwd?.type(password);
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
  const cookies = await page.cookies();
  await browser.close();
  return cookiesToString(cookies);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = await getCookies(req.body.username, req.body.password);
  res.status(200).json({ cookie: cookies });
}
