import { test, expect } from '@playwright/test';

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';

// 🔹 Helper: Login
async function login(page, email, password) {
  await page.goto(`${BASE_URL}/login`);

  await page.getByPlaceholder('you@email.com').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.locator('#login-btn').click();

  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

// 🔹 Helper: Future Date
function futureDateValue() {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return date.toISOString().slice(0, 16);
}

test('End-to-End Event Booking Flow', async ({ page }) => {

  const email = 'niteshtrivedi.84@gmail.com';
  const password = 'Nitesh@01';

  const eventTitle = `Test Event ${Date.now()}`;
  let seatsBeforeBooking;
  let seatsAfterBooking;
  let bookingRef;

  // Step 1 — Login
  await login(page, email, password);

  // Step 2 — Create Event
  await page.goto(`${BASE_URL}/admin/events`);

  await page.locator('#event-title-input').fill(eventTitle);
  await page.locator('#admin-event-form textarea').fill('Automation Test Event');

  await page.getByLabel('City').fill('Ahmedabad');
  await page.getByLabel('Venue').fill('Test Venue');
  await page.getByLabel('Event Date & Time').fill(futureDateValue());

  await page.getByLabel('Price ($)').fill('100');
  await page.getByLabel('Total Seats').fill('50');

  await page.locator('#add-event-btn').click();

  await expect(page.getByText('Event created!')).toBeVisible();

  // Step 3 — Capture Seats Before Booking
  await page.goto(`${BASE_URL}/events`);

  const cards = page.locator('[data-testid="event-card"]');
  await expect(cards.first()).toBeVisible();

  const eventCard = cards.filter({ hasText: eventTitle }).first();
  await expect(eventCard).toBeVisible();

  const seatText = await eventCard.locator('text=/seat/i').innerText();
  seatsBeforeBooking = parseInt(seatText.match(/\d+/)[0]);

  // Step 4 — Start Booking
  await eventCard.locator('[data-testid="book-now-btn"]').click();

  // Step 5 — Fill Booking Form
  await expect(page.locator('#ticket-count')).toHaveText('1');

  await page.getByLabel('Full Name').fill('Test User');
  await page.locator('#customer-email').fill(email);
  await page.getByPlaceholder('+91 98765 43210').fill('9876543210');

  await page.locator('.confirm-booking-btn').click();

  // Step 6 — Capture Booking Reference
  const bookingRefElement = page.locator('.booking-ref').first();
  await expect(bookingRefElement).toBeVisible();

  bookingRef = (await bookingRefElement.innerText()).trim();

  // Step 7 — Verify in My Bookings
  await page.getByRole('link', { name: 'View My Bookings' }).click();
  await expect(page).toHaveURL(`${BASE_URL}/bookings`);

  const bookingCards = page.locator('#booking-card');
  await expect(bookingCards.first()).toBeVisible();

  const matchedCard = bookingCards.filter({
    has: page.locator('.booking-ref', { hasText: bookingRef })
  });

  await expect(matchedCard).toBeVisible();
  await expect(matchedCard).toContainText(eventTitle);

  // Step 8 — Verify Seat Reduction
  await page.goto(`${BASE_URL}/events`);

  const updatedCard = page.locator('[data-testid="event-card"]').filter({ hasText: eventTitle }).first();
  await expect(updatedCard).toBeVisible();

  const updatedSeatText = await updatedCard.locator('text=/seat/i').innerText();
  seatsAfterBooking = parseInt(updatedSeatText.match(/\d+/)[0]);

  expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
});