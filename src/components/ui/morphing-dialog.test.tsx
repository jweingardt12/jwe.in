import { test, expect } from '@playwright/test';

test.describe('MorphingDialog', () => {
  test('maintains scroll position when dialog is opened and closed', async ({ page }) => {
    // Navigate to the test page
    await page.goto('/test-morphing-dialog');
    
    // Create a long page to enable scrolling
    await page.evaluate(() => {
      document.body.style.height = '3000px';
      window.scrollTo(0, 1500);
    });
    
    // Store the initial scroll position
    const initialScrollPosition = await page.evaluate(() => window.scrollY);
    
    // Click the dialog trigger
    await page.click('[role="button"][aria-haspopup="dialog"]');
    
    // Verify the dialog is open
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Close the dialog
    await page.click('button[aria-label="Close dialog"]');
    
    // Wait for the dialog to close
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    
    // Verify the scroll position is maintained
    const finalScrollPosition = await page.evaluate(() => window.scrollY);
    expect(finalScrollPosition).toBe(initialScrollPosition);
  });
}); 