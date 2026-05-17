# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.test.ts >> Test 5. Przypisanie usera do taski i zmiana statusu
- Location: auth.test.ts:194:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('div.relative.rounded-2xl').filter({ has: locator('h3').filter({ hasText: 'My story' }) }).last()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('div.relative.rounded-2xl').filter({ has: locator('h3').filter({ hasText: 'My story' }) }).last()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - img "bg" [ref=e4]
    - button "Back to Projects" [ref=e5] [cursor=pointer]:
      - img [ref=e6]
      - text: Back to Projects
    - generic [ref=e8]:
      - heading "Sasza projekt" [level=1] [ref=e10]
      - button "Create Story" [ref=e11] [cursor=pointer]:
        - img [ref=e12]
        - text: Create Story
    - generic [ref=e13]:
      - button "Active" [ref=e14]
      - button "In progress" [ref=e15]
      - button "Done" [ref=e16]
    - paragraph [ref=e22]: No stories in this category
  - button "Open Next.js Dev Tools" [ref=e28] [cursor=pointer]:
    - img [ref=e29]
  - alert [ref=e32]
```

# Test source

```ts
  1   | import { test, expect, Page, Locator } from "@playwright/test"
  2   | 
  3   | //funkcje pomocnicze
  4   | async function reloadUntilVisible(
  5   |   page: Page,
  6   |   locator: Locator,
  7   |   timeout = 5000
  8   | ) {
  9   |   try {
  10  |     await expect(locator).toBeVisible({ timeout });
  11  |   } catch {
  12  |     await page.reload();
> 13  |     await expect(locator).toBeVisible({ timeout: 10000 });
      |                           ^ Error: expect(locator).toBeVisible() failed
  14  |   }
  15  | }
  16  | 
  17  | async function openProject(page: Page, projectName: string) {
  18  |   await page.goto("http://localhost:3000/projects");
  19  |   await page.reload();
  20  | 
  21  |   const filterMenuBtn = page.getByRole("button", {
  22  |     name: /Active Project Only/i,
  23  |   });
  24  | 
  25  |   await expect(filterMenuBtn).toBeVisible();
  26  | 
  27  |   await filterMenuBtn.click();
  28  | 
  29  |   await page.locator("button.w-full").filter({ hasText: /Show All Projects/i }).click();
  30  | 
  31  |   const projectCard = page.locator("div.rounded-3xl").filter({has: page.locator("h2", {hasText: projectName})}).first();
  32  | 
  33  |   try {
  34  |     await expect(projectCard).toBeVisible({ timeout: 5000 });
  35  |   } catch {
  36  |     await page.reload();
  37  | 
  38  |     await filterMenuBtn.click();
  39  | 
  40  |     await page.locator("button.w-full").filter({ hasText: /Show All Projects/i }).click();
  41  | 
  42  |     await expect(projectCard).toBeVisible({
  43  |       timeout: 10000,
  44  |     });
  45  |   }
  46  | 
  47  |   await projectCard
  48  |     .getByRole("link", {
  49  |       name: /Go to Stories/i,
  50  |     })
  51  |     .click();
  52  | }
  53  | 
  54  | test.beforeEach(async ({ page }) => {
  55  |   await page.goto('http://localhost:3000');
  56  |   
  57  |   await page.evaluate(() => {
  58  |     const rawUserData = '{"uid":"l47KfxbLYOYdEX4Ee2OkAMvMOSl1","email":"slizzzerin@gmail.com","emailVerified":true,"displayName":"Лагодюк Александра","isAnonymous":false,"photoURL":"https://lh3.googleusercontent.com/a/ACg8ocJuTV0MEjJyclxL-TEMW9MMzmEbQ89Xs6i_6zyEXZhKx-4j0g=s96-c","providerData":[{"providerId":"google.com","uid":"108847287318366808864","displayName":"Лагодюк Александра","email":"slizzzerin@gmail.com","phoneNumber":null,"photoURL":"https://lh3.googleusercontent.com/a/ACg8ocJuTV0MEjJyclxL-TEMW9MMzmEbQ89Xs6i_6zyEXZhKx-4j0g=s96-c"}],"stsTokenManager":{"refreshToken":"AMf-vByW_js5ZCyHu_MObb-rR15u5WVkFknjWWiOZ3KKBqUS0xmkSGwRy-Rgu8hpEt2yAIpIyTjc-_xaiMl-BM3VKijf-bpWgPk4Qtw8DTsro4IC_gINqMSVRh7XnXWFtf0aZMcYKZqsaRIgZFzy6fawte6JJ3dAylx_paXBZDjCXEthLV5L4KNtnQ-zz5Kj1gYyBMi2lzLnqbA2Ha_0J4sFiGbPLLZy55vlFMzERQ6SHFL_Qh9CSpYyHstkv4OxvoOOEyP4bVSUXgCxOWcdw6V5d8R4u_XVUc6oFbBwk7TPzeSB9RAMBMZ91-1vLMVQNcCNaiuDzX5pOBe5px73wMTBiz1SeW9T0GXCxmUcc9ALGnGmHfv-wu-_dqZBBSkVyX26nJsOZ_s1jo0wrKfKIirh3hWkp3fXU9f3ap6K67f1Dl4JZ9ipdqYmHtAdyMTZumNzGN_OmeSsM7n28OA29KfQhrztQqsBGQULxReQtEue1HKFDXJ9rJ0Ybsci_AiSvIy2rvr6bNA9","accessToken":"eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg2OGU0YWNlMGI2NTE2ZDM2YjlmNTZkZThjZTQ5Nzg4ZmNjZGFjNDMiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoi0JvQsNCz0L7QtNGO0Log0JDQu9C10LrRgdCw0L3QtNGA0LAiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSnVUVjBNRWpKeWNseEwtVEVNVzlNTXptRWJRODlYczZpXzZ6eUVYWmhLeC00ajBnPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3phcnphZHphbmllLXByb2pla3RhbWktMzY5ODYiLCJhdWQiOiJ6YXJ6YWR6YW5pZS1wcm9qZWt0YW1pLTM2OTg2IiwiYXV0aF90aW1lIjoxNzc4MjQzNTE0LCJ1c2VyX2lkIjoibDQ3S2Z4YkxZT1lkRVg0RWUyT2tBTXZNT1NsMSIsInN1YiI6Imw0N0tmeGJMWU9ZZEVYNEVlMk9rQU12TU9TbDEiLCJpYXQiOjE3Nzg0ODk1NDMsImV4cCI6MTc3ODQ5MzE0MywiZW1haWwiOiJzbGl6enplcmluQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTA4ODQ3Mjg3MzE4MzY2ODA4ODY0Il0sImVtYWlsIjpbInNsaXp6emVyaW5AZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.pP1EDQl-xS0SdktNnKBdkgtUsXodLJtiyInmwoW-IEc6kWoYOG7UqUrpCvpgjem30XwduABZKJI5Uq59IwElwv6NlbWPuzJ05tWbZGB9nTrGjoiOdoRe-EHN4BxJ0rEzLOwokA4kMVxAk8GbgEsgXucKeuH6z8aRQUnTiXax62e1w2U6TEoRgul5eOFvXt6vfIiEQLR9w-KsgMZLL8Z0tP9glpDplzpSM1oqTC8Hx-qbiC9rLinva5Uo0uwSopl3sjACRjVpdXZYV3eBsC0iijztwD52iWAQ8xCPg7S2417pXIYo5-8j8RXADZfy_UZypo95Yu01ozYL-e5TIBedJg","expirationTime":1778493144031},"createdAt":"1778083300828","lastLoginAt":"1778243514604","apiKey":"AIzaSyAMZsVuv_kPQvlBLBFviL6xgOBcjO_DXzY","appName":"[DEFAULT]"}';
  59  |     
  60  |     const firebaseKey = 'firebase:authUser:AIzaSyAMZsVuv_kPQvlBLBFviL6xgOBcjO_DXzY:[DEFAULT]'; 
  61  | 
  62  |     sessionStorage.setItem(firebaseKey, rawUserData);
  63  |     
  64  |     localStorage.setItem("activeProjectId", "4fc41fc2-f1c7-4525-b40e-94abc1d30102");
  65  |   });
  66  | 
  67  |   await page.reload();
  68  | });
  69  | 
  70  | 
  71  | test("Test 1. Odczyt wiadomości", async ({ page }) => {
  72  |   await page.goto("http://localhost:3000/projects");
  73  |   const link = page.locator("header").getByRole("link").filter({ hasText: /Sasza|Лагодюк/i });
  74  |   await link.click();
  75  | 
  76  |   await expect(page).toHaveURL(/.*messages/);
  77  |   const anyMessage = page.locator('div.cursor-pointer');
  78  |   await anyMessage.first().waitFor({ state: 'visible', timeout: 15000 });
  79  | 
  80  |   const unreadMessage = page.locator('div.cursor-pointer').filter({
  81  |     has: page.locator('div.bg-\\[\\#B1FF58\\]')
  82  |   }).first();
  83  | 
  84  |   if (await unreadMessage.count() > 0) {
  85  |     const msgTitle = await unreadMessage.locator('span').innerText();
  86  |     const msgPreview = await unreadMessage.locator('p').innerText();    
  87  |     await unreadMessage.click({ force: true });
  88  | 
  89  |     const activePanel = page.locator('div[class*="w-2/3"]');
  90  |     
  91  |     const heading = activePanel.locator('h1');
  92  |     await expect(heading).toHaveText(msgTitle, { timeout: 10000 });
  93  |     
  94  |     const fullMessage = await activePanel.locator('p.leading-relaxed').innerText();
  95  |     const messageDate = await activePanel.locator('p.text-xs').innerText();
  96  | 
  97  |     console.log(`Test 1: Tytuł: ${msgTitle}`);
  98  |     console.log(`Podgląd: ${msgPreview}`);
  99  |     console.log(`Pełna treść: ${fullMessage}`);
  100 |     console.log(`Data: ${messageDate}`);
  101 | 
  102 |   } else {
  103 |     const firstMsgTitle = await anyMessage.first().locator('span').innerText();
  104 |     console.log(`Brak nowych wiadomości. Pierwsza dostępna to: ${firstMsgTitle}`);
  105 |   }
  106 | });
  107 | 
  108 | test("Test 2. Stworzenie projektu", async ({ page }) => {
  109 |   await page.goto("http://localhost:3000/projects/create");
  110 | 
  111 |   await page.evaluate(() => {
  112 |     const rawUserData = '{"uid":"l47KfxbLYOYdEX4Ee2OkAMvMOSl1","email":"slizzzerin@gmail.com","emailVerified":true,"displayName":"Лагодюк Александра","isAnonymous":false,"photoURL":"https://lh3.googleusercontent.com/a/ACg8ocJuTV0MEjJyclxL-TEMW9MMzmEbQ89Xs6i_6zyEXZhKx-4j0g=s96-c","providerData":[{"providerId":"google.com","uid":"108847287318366808864","displayName":"Лагодюк Александра","email":"slizzzerin@gmail.com","phoneNumber":null,"photoURL":"https://lh3.googleusercontent.com/a/ACg8ocJuTV0MEjJyclxL-TEMW9MMzmEbQ89Xs6i_6zyEXZhKx-4j0g=s96-c"}],"stsTokenManager":{"refreshToken":"AMf-vByW_js5ZCyHu_MObb-rR15u5WVkFknjWWiOZ3KKBqUS0xmkSGwRy-Rgu8hpEt2yAIpIyTjc-_xaiMl-BM3VKijf-bpWgPk4Qtw8DTsro4IC_gINqMSVRh7XnXWFtf0aZMcYKZqsaRIgZFzy6fawte6JJ3dAylx_paXBZDjCXEthLV5L4KNtnQ-zz5Kj1gYyBMi2lzLnqbA2Ha_0J4sFiGbPLLZy55vlFMzERQ6SHFL_Qh9CSpYyHstkv4OxvoOOEyP4bVSUXgCxOWcdw6V5d8R4u_XVUc6oFbBwk7TPzeSB9RAMBMZ91-1vLMVQNcCNaiuDzX5pOBe5px73wMTBiz1SeW9T0GXCxmUcc9ALGnGmHfv-wu-_dqZBBSkVyX26nJsOZ_s1jo0wrKfKIirh3hWkp3fXU9f3ap6K67f1Dl4JZ9ipdqYmHtAdyMTZumNzGN_OmeSsM7n28OA29KfQhrztQqsBGQULxReQtEue1HKFDXJ9rJ0Ybsci_AiSvIy2rvr6bNA9","accessToken":"eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg2OGU0YWNlMGI2NTE2ZDM2YjlmNTZkZThjZTQ5Nzg4ZmNjZGFjNDMiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoi0JvQsNCz0L7QtNGO0Log0JDQu9C10LrRgdCw0L3QtNGA0LAiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSnVUVjBNRWpKeWNseEwtVEVNVzlNTXptRWJRODlYczZpXzZ6eUVYWmhLeC00ajBnPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3phcnphZHphbmllLXByb2pla3RhbWktMzY5ODYiLCJhdWQiOiJ6YXJ6YWR6YW5pZS1wcm9qZWt0YW1pLTM2OTg2IiwiYXV0aF90aW1lIjoxNzc4MjQzNTE0LCJ1c2VyX2lkIjoibDQ3S2Z4YkxZT1lkRVg0RWUyT2tBTXZNT1NsMSIsInN1YiI6Imw0N0tmeGJMWU9ZZEVYNEVlMk9rQU12TU9TbDEiLCJpYXQiOjE3Nzg0ODk1NDMsImV4cCI6MTc3ODQ5MzE0MywiZW1haWwiOiJzbGl6enplcmluQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTA4ODQ3Mjg3MzE4MzY2ODA4ODY0Il0sImVtYWlsIjpbInNsaXp6emVyaW5AZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.pP1EDQl-xS0SdktNnKBdkgtUsXodLJtiyInmwoW-IEc6kWoYOG7UqUrpCvpgjem30XwduABZKJI5Uq59IwElwv6NlbWPuzJ05tWbZGB9nTrGjoiOdoRe-EHN4BxJ0rEzLOwokA4kMVxAk8GbgEsgXucKeuH6z8aRQUnTiXax62e1w2U6TEoRgul5eOFvXt6vfIiEQLR9w-KsgMZLL8Z0tP9glpDplzpSM1oqTC8Hx-qbiC9rLinva5Uo0uwSopl3sjACRjVpdXZYV3eBsC0iijztwD52iWAQ8xCPg7S2417pXIYo5-8j8RXADZfy_UZypo95Yu01ozYL-e5TIBedJg","expirationTime":1778493144031},"createdAt":"1778083300828","lastLoginAt":"1778243514604","apiKey":"AIzaSyAMZsVuv_kPQvlBLBFviL6xgOBcjO_DXzY","appName":"[DEFAULT]"}';
  113 |     const firebaseKey = 'firebase:authUser:AIzaSyAMZsVuv_kPQvlBLBFviL6xgOBcjO_DXzY:[DEFAULT]';
```