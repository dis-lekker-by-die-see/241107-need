// Interfaces for TypeScript to handle data types
interface Item {
  name: string;
  status: string;
  timestamp: string;
}

interface Category {
  name: string;
  items: Item[];
}

// Helper function to fetch data from the server
async function fetchData(url: string): Promise<any> {
  const response = await fetch(url);
  return response.json();
}

// Helper function to send data to the server
async function postData(url: string, data: any): Promise<void> {
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// Toggle item selection for Shopping Now page
function toggleItem(element: HTMLElement): void {
  element.classList.toggle("toggled");
}

// Add a new category to the list
async function addCategory(): Promise<void> {
  const categoryName = prompt("Enter new category name:");
  if (categoryName) {
    const data = await fetchData("backend/loadData.php");
    data.categories.push({ name: categoryName, items: [] });
    await postData("backend/saveData.php", data);
    location.reload(); // Reload to display the new category
  }
}

// Add a new item to a specific category
async function addItem(categoryName: string): Promise<void> {
  const itemName = prompt(`Enter new item name for ${categoryName}:`);
  if (itemName) {
    const data = await fetchData("backend/loadData.php");
    const category = data.categories.find(
      (cat: Category) => cat.name === categoryName
    );
    if (category) {
      category.items.push({
        name: itemName,
        status: "Need Now",
        timestamp: new Date().toISOString(),
      });
      await postData("backend/saveData.php", data);
      location.reload();
    }
  }
}

// Edit an existing category name
async function editCategory(categoryName: string): Promise<void> {
  const newCategoryName = prompt("Edit category name:", categoryName);
  if (newCategoryName) {
    const data = await fetchData("backend/loadData.php");
    const category = data.categories.find(
      (cat: Category) => cat.name === categoryName
    );
    if (category) {
      category.name = newCategoryName;
      await postData("backend/saveData.php", data);
      location.reload();
    }
  }
}

// Edit an existing item name
async function editItem(itemName: string): Promise<void> {
  const newItemName = prompt("Edit item name:", itemName);
  if (newItemName) {
    const data = await fetchData("backend/loadData.php");
    for (const category of data.categories) {
      const item = category.items.find((i: Item) => i.name === itemName);
      if (item) {
        item.name = newItemName;
        await postData("backend/saveData.php", data);
        location.reload();
        return;
      }
    }
  }
}

// Delete a category
async function deleteCategory(categoryName: string): Promise<void> {
  if (confirm(`Delete category ${categoryName}?`)) {
    const data = await fetchData("backend/loadData.php");
    data.categories = data.categories.filter(
      (cat: Category) => cat.name !== categoryName
    );
    await postData("backend/saveData.php", data);
    location.reload();
  }
}

// Delete an item
async function deleteItem(itemName: string): Promise<void> {
  if (confirm(`Delete item ${itemName}?`)) {
    const data = await fetchData("backend/loadData.php");
    for (const category of data.categories) {
      category.items = category.items.filter((i: Item) => i.name !== itemName);
    }
    await postData("backend/saveData.php", data);
    location.reload();
  }
}

// Finish shopping: remove items marked as "toggled" and save them to history
async function finishShopping(): Promise<void> {
  const data = await fetchData("backend/loadData.php");
  const now = new Date();
  const historyData = { categories: [] as Category[] };

  // Loop through categories and items
  for (const category of data.categories) {
    const historyCategory = { name: category.name, items: [] as Item[] };
    const remainingItems = [];

    for (const item of category.items) {
      const element = document.querySelector(`[data-item="${item.name}"]`);
      const isToggled = element?.classList.contains("toggled");

      if (isToggled && item.status !== "Always Need") {
        historyCategory.items.push(item); // Add to history
      } else {
        remainingItems.push(item); // Keep in need.json
      }
    }

    if (historyCategory.items.length > 0) {
      historyData.categories.push(historyCategory);
    }

    category.items = remainingItems; // Update the remaining items
  }

  // Save remaining items to need.json
  await postData("backend/saveData.php", data);

  // Save history data
  const historyFileName = `data/history/${now
    .toISOString()
    .replace(/[:.]/g, "-")}.json`;
  await postData(historyFileName, historyData);

  location.href = "main_list.php"; // Return to main list
}

// Cancel shopping without saving
function cancelShopping(): void {
  location.href = "main_list.php";
}

// Export history as an Excel file
async function exportHistory(): Promise<void> {
  const response = await fetch("backend/exportHistory.php");
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "exported_history.xlsx";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// Event listeners (if needed) can be added here

// Compile this TypeScript file to JavaScript by running `tsc main.ts`
