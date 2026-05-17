# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.test.ts >> Test 6. Sprawdzenie projektów
- Location: auth.test.ts:255:5

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('h2')
Expected: 2
Received: 3
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('h2')
    9 × locator resolved to 3 elements
      - unexpected value "3"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e3]:
    - link "142 Sasza" [ref=e4] [cursor=pointer]:
      - /url: /messages
      - generic [ref=e6]: "142"
      - generic [ref=e7]: Sasza
    - generic [ref=e8]:
      - link "Użytkownicy" [ref=e9] [cursor=pointer]:
        - /url: /users
      - link "+ Create Project" [ref=e10] [cursor=pointer]:
        - /url: /projects/create
      - button "Wyloguj" [ref=e11]
  - generic [ref=e12]:
    - heading "Projects" [level=1] [ref=e15]
    - button "All Projects" [ref=e17]:
      - img [ref=e18]
      - generic [ref=e23]: All Projects
      - img [ref=e24]
    - generic [ref=e26]:
      - generic [ref=e27]:
        - heading "Sasza projekt" [level=2] [ref=e29]
        - paragraph [ref=e30]: Opis projektu testowego
        - generic [ref=e31]:
          - button "Delete" [ref=e32]
          - button "Edit" [ref=e33]
          - link "Go to Stories →" [ref=e34] [cursor=pointer]:
            - /url: /projects/44626b09-c012-4015-8209-3112da9da552/stories
      - generic [ref=e35]:
        - heading "Sasza projekt" [level=2] [ref=e37]
        - paragraph [ref=e38]: Opis projektu testowego
        - generic [ref=e39]:
          - button "Delete" [ref=e40]
          - button "Edit" [ref=e41]
          - link "Go to Stories →" [ref=e42] [cursor=pointer]:
            - /url: /projects/87e3704d-452a-43cd-b6bd-dd8ad2f2ef26/stories
      - generic [ref=e43]:
        - heading "New project for testing" [level=2] [ref=e45]
        - paragraph [ref=e46]: sdsdf
        - generic [ref=e47]:
          - button "Delete" [ref=e48]
          - button "Edit" [ref=e49]
          - link "Go to Stories →" [ref=e50] [cursor=pointer]:
            - /url: /projects/90b1e345-1c6f-44ae-80ad-549c370bd33e/stories
  - button "Open Next.js Dev Tools" [ref=e56] [cursor=pointer]:
    - img [ref=e57]
  - alert [ref=e60]
```

# Test source

```ts
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
  235 |   const setDoneBtn = page.getByTestId("set-done-button");
  236 | 
  237 |   await expect(setDoneBtn).toBeVisible({ timeout: 5000 });
  238 |   
  239 |   const donePromise = page.waitForResponse(res => 
  240 |     res.url().includes("firestore.googleapis.com")
  241 |   );
  242 |   
  243 | 
  244 |   await setDoneBtn.click({ force: true });
  245 |   await donePromise;
  246 | 
  247 |   const finishedLabel = taskCard.locator("span", { hasText: /Finished/i });
  248 |   await reloadUntilVisible(page, finishedLabel, 15000);
  249 |   
  250 |   await expect(finishedLabel).toBeVisible();
  251 |   console.log("Test 5: zmiana statusu na done")
  252 | 
  253 | });
  254 | 
  255 | test("Test 6. Sprawdzenie projektów", async ({ page }) => {
  256 |   await page.goto("http://localhost:3000/projects");
  257 | 
  258 |   const emptyStateBtn = page.locator('button', { hasText: /SHOW ALL PROJECTS/i });
  259 |   if (await emptyStateBtn.isVisible()) {
  260 |     await emptyStateBtn.click();
  261 |   }
  262 | 
  263 |   const projectCards = page.locator('div.rounded-3xl');
  264 |   await projectCards.first().waitFor();
  265 |   const targetProject = projectCards.filter({ hasText: /New project for testing/i });
  266 |   await expect(targetProject).toBeVisible();
  267 |   await page.locator('button').filter({ hasText: /Project/i }).first().click();
  268 |   await page.getByRole('button', { name: /Show all projects/i }).click();
  269 | 
> 270 |   await expect(page.locator('h2')).toHaveCount(2);
      |                                    ^ Error: expect(locator).toHaveCount(expected) failed
  271 |   
  272 |   const allTitles = await page.locator("h2").allInnerTexts();
  273 |   const total = allTitles.length;
  274 | 
  275 |   
  276 |   let activeProjectName = "Nie znaleziono projektu o wskazanym ID";
  277 | 
  278 |   const cards = page.locator('div.rounded-3xl');
  279 |   const count = await cards.count();
  280 | 
  281 |   for (let i = 0; i < count; i++) {
  282 |     const card = cards.nth(i);
  283 |     const hasActiveLabel = await card.locator('span', { hasText: /^Active$/ }).isVisible();
  284 |     
  285 |     if (hasActiveLabel) {
  286 |         activeProjectName = await card.locator('h2').innerText();
  287 |         break;
  288 |     }
  289 |   }
  290 | 
  291 |   if (activeProjectName.includes("Nie znaleziono")) {
  292 |       const backupTitle = await page.locator('h2', { hasText: /New project for testing/i }).innerText();
  293 |       activeProjectName = `${backupTitle}`;
  294 |   }
  295 | 
  296 |   console.log(`Lacznie projektow na stronie jest: ${total}, aktywny projekt jest o nazwie: ${activeProjectName}`);
  297 | });
```