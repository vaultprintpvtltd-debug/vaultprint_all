export function calculatePrice({
  pages,
  color = false,
  duplex = false,
  copies = 1
}) {
  let billablePages = pages;

  // Duplex printing reduces sheets
  if (duplex) {
    billablePages = Math.ceil(pages / 2);
  }

  // Base price per page
  const pricePerPage = color ? 5 : 2;

  let total = billablePages * pricePerPage * copies;

  // Bulk discounts
  if (billablePages >= 100) {
    total *= 0.8; // 20% off
  } else if (billablePages >= 50) {
    total *= 0.9; // 10% off
  }

  return Math.round(total);
}
