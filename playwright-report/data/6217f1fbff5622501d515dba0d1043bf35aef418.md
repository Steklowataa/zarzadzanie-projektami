# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.test.ts >> Test 2. Stworzenie projektu
- Location: auth.test.ts:108:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h2').filter({ hasText: 'Sasza projekt' })
Expected: visible
Error: strict mode violation: locator('h2').filter({ hasText: 'Sasza projekt' }) resolved to 2 elements:
    1) <h2 class="text-xl font-bold tracking-tight">Sasza projekt</h2> aka getByRole('heading', { name: 'Sasza projekt' }).first()
    2) <h2 class="text-xl font-bold tracking-tight">Sasza projekt</h2> aka getByRole('heading', { name: 'Sasza projekt' }).nth(1)

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('h2').filter({ hasText: 'Sasza projekt' })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]
  - banner [ref=e13]:
    - link "142 Sasza" [ref=e14] [cursor=pointer]:
      - /url: /messages
      - generic [ref=e16]: "142"
      - generic [ref=e17]: Sasza
    - generic [ref=e18]:
      - link "Użytkownicy" [ref=e19] [cursor=pointer]:
        - /url: /users
      - link "+ Create Project" [ref=e20] [cursor=pointer]:
        - /url: /projects/create
      - button "Wyloguj" [ref=e21]
  - generic [ref=e22]:
    - heading "Projects" [level=1] [ref=e25]
    - button "All Projects" [ref=e27]:
      - img [ref=e28]
      - generic [ref=e33]: All Projects
      - img [ref=e34]
    - generic [ref=e36]:
      - generic [ref=e37]:
        - heading "Sasza projekt" [level=2] [ref=e39]
        - paragraph [ref=e40]: Opis projektu testowego
        - generic [ref=e41]:
          - button "Delete" [ref=e42]
          - button "Edit" [ref=e43]
          - link "Go to Stories →" [ref=e44] [cursor=pointer]:
            - /url: /projects/44626b09-c012-4015-8209-3112da9da552/stories
      - generic [ref=e45]:
        - heading "Sasza projekt" [level=2] [ref=e47]
        - paragraph [ref=e48]: Opis projektu testowego
        - generic [ref=e49]:
          - button "Delete" [ref=e50]
          - button "Edit" [ref=e51]
          - link "Go to Stories →" [ref=e52] [cursor=pointer]:
            - /url: /projects/87e3704d-452a-43cd-b6bd-dd8ad2f2ef26/stories
      - generic [ref=e53]:
        - heading "New project for testing" [level=2] [ref=e55]
        - paragraph [ref=e56]: sdsdf
        - generic [ref=e57]:
          - button "Delete" [ref=e58]
          - button "Edit" [ref=e59]
          - link "Go to Stories →" [ref=e60] [cursor=pointer]:
            - /url: /projects/90b1e345-1c6f-44ae-80ad-549c370bd33e/stories
```

# Test source

```ts
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
  114 |     sessionStorage.setItem(firebaseKey, rawUserData);
  115 |     window.dispatchEvent(new Event('storage'));
  116 |   });
  117 | 
  118 |   const uniqueName = `Sasza projekt`;
  119 |   await page.locator('#inputName').fill(uniqueName);
  120 |   await page.locator('#inputDescription').fill('Opis projektu testowego');
  121 | 
  122 |   await page.waitForTimeout(2000);
  123 | 
  124 |   const saveBtn = page.locator("button").filter({ hasText: /^Save Project$/i });
  125 |   await saveBtn.dispatchEvent('click');
  126 |   
  127 |   await page.waitForURL("**/projects", { timeout: 15000 });
  128 | 
  129 |   const showAllBtn = page.getByRole('button', { name: /Show all projects/i });
  130 |   if (await showAllBtn.isVisible()) {
  131 |       await showAllBtn.click();
  132 |   }
  133 | 
> 134 |   await expect(page.locator('h2', { hasText: uniqueName })).toBeVisible({ timeout: 10000 });
      |                                                             ^ Error: expect(locator).toBeVisible() failed
  135 | 
  136 |   console.log(`Test 2: Sukces! Stworzono projekt: ${uniqueName}`);
  137 | });
  138 | 
  139 | test("Test 3. Stworzenie historyjki w projekcie", async ({ page }) => {
  140 |   await openProject(page, "Sasza projekt");
  141 | 
  142 |   await page.getByRole("button", {  name: /Create Story/i, }).click();
  143 | 
  144 |   const storyName = "My story";
  145 | 
  146 |   await page.locator("#inputName").fill(storyName);
  147 | 
  148 |   await page.locator("#inputDescription").fill("Automatyczny opis zadania");
  149 | 
  150 |   await page.getByRole("button", { name: /^Create Story$/i,}).click();
  151 | 
  152 |   await expect(page).toHaveURL(/.*\/stories$/);
  153 | 
  154 |   console.log(`Test 3: Sukces: Historyjka "${storyName}" utworzona!`);
  155 | 
  156 | });
  157 | 
  158 | test("Test 4. Stworzenie taski whistoryjce", async ({ page }) => {
  159 |   await openProject(page, "Sasza projekt");
  160 | 
  161 |   const storyCard = page.locator("div.relative.rounded-2xl").filter({has: page.locator("h3", {hasText: "My story",}),}).last();
  162 | 
  163 |   await reloadUntilVisible(page, storyCard, 7000);
  164 | 
  165 |   await storyCard.click();
  166 | 
  167 |   await expect(page).toHaveURL(/.*\/tasks/);
  168 | 
  169 |   await page.getByRole("button", {name: /Create Task/i,}).click();
  170 | 
  171 |   await expect(page).toHaveURL(/.*\/tasks\/create/);
  172 | 
  173 |   await page.locator("#inputTimeofWork").fill("2");
  174 | 
  175 |   await page.locator("#inputName").fill("New task test");
  176 | 
  177 |   await page.locator("#inputDescription").fill("Some description");
  178 | 
  179 |   await page.locator("select").selectOption("medium");
  180 | 
  181 |   await page.getByRole("button", {name: /Create Task/i}).last().click();
  182 | 
  183 |   await expect(page).toHaveURL(/.*\/tasks/);
  184 | 
  185 |   const newTask = page.locator("div, li").filter({hasText: "New task test",}).first();
  186 | 
  187 |   await reloadUntilVisible(page, newTask, 8000);
  188 | 
  189 |   console.log("Test 4: Zadanie potwierdzone na liście!");
  190 | });
  191 | 
  192 | 
  193 | 
  194 | test("Test 5. Przypisanie usera do taski i zmiana statusu", async ({ page }) => {
  195 |   await openProject(page, "Sasza projekt");
  196 |   const storyCard = page.locator("div.relative.rounded-2xl").filter({
  197 |     has: page.locator("h3", { hasText: "My story" }),
  198 |   }).last();
  199 | 
  200 |   await reloadUntilVisible(page, storyCard, 10000);
  201 | 
  202 |   await expect(storyCard).toBeVisible({ timeout: 10000 });
  203 |   await storyCard.click();
  204 | 
  205 |   await expect(page).toHaveURL(/.*\/tasks/);
  206 |   
  207 |   const taskCard = page.locator("div.group").filter({
  208 |     has: page.locator("h4", { hasText: "New task test" })
  209 |   }).first();
  210 | 
  211 |   await reloadUntilVisible(page, taskCard, 10000);
  212 |   await expect(taskCard).toBeVisible();
  213 | 
  214 |   const unassignedBtn = taskCard.locator("span", { hasText: /Unassigned/i });
  215 |   await expect(unassignedBtn).toBeVisible({ timeout: 10000 });
  216 |   await unassignedBtn.click();
  217 | 
  218 |   const userOption = page.locator("button").filter({
  219 |     hasText: /АЛЕКСАНДРА/i 
  220 |   }).first();
  221 | 
  222 |   await expect(userOption).toBeVisible({ timeout: 10000 });
  223 | 
  224 |   const assignPromise = page.waitForResponse(res => 
  225 |     res.url().includes("firestore.googleapis.com")
  226 |   );
  227 |   
  228 |   await userOption.click();
  229 |   await assignPromise;
  230 |   console.log("Test 5: przypisanie uzytkownika do taski")
  231 | 
  232 |   const statusToggle = taskCard.getByTestId("status-toggle");
  233 |   await statusToggle.click();
  234 | 
```