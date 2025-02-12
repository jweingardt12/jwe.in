const { test, expect } = require('@playwright/test');

test('chat page loads and message submission works', async ({ page }) => {
  // Increase the timeout for this test
  test.setTimeout(60000);
  
  await page.goto('/chat');
  
  // Wait for the initial hero section
  await expect(page.locator('text=Chat with Jason')).toBeVisible();
  
  // Wait for the form to be visible
  const form = await page.waitForSelector('form.max-w-xl');
  
  // Wait for the input field to be visible
  const input = await page.waitForSelector('input[type="text"]');
  
  // Type a message
  const testMessage = 'Hello, this is a test message';
  await input.type(testMessage);
  
  // Click the submit button
  const submitButton = await page.waitForSelector('button[type="submit"]');
  await submitButton.click();
  
  // Wait for the chat interface to appear
  await expect(page.locator('.h-\\[600px\\]')).toBeVisible();
  
  // Verify that our message appears in the chat
  await expect(page.locator(`text=${testMessage}`)).toBeVisible();
  
  // Wait for the loading bubble to appear
  await expect(page.locator('.chat-bubble')).toBeVisible({ timeout: 10000 });
  
  // Wait for the AI response with a longer timeout
  // We'll wait for a second chat bubble to appear (the response)
  await expect(page.locator('.chat-bubble >> nth=1')).toBeVisible({ timeout: 30000 });
  
  // Verify we can send another message
  await page.fill('input[type="text"]', 'Another test message');
  await page.click('button[type="submit"]');
  
  // Wait for the new message to appear
  await expect(page.locator('text=Another test message')).toBeVisible({ timeout: 10000 });
}); 