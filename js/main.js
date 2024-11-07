"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Helper function to fetch data from the server
function fetchData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        return response.json();
    });
}
// Helper function to send data to the server
function postData(url, data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    });
}
// Toggle item selection for Shopping Now page
function toggleItem(element) {
    element.classList.toggle("toggled");
}
// Add a new category to the list
function addCategory() {
    return __awaiter(this, void 0, void 0, function* () {
        const categoryName = prompt("Enter new category name:");
        if (categoryName) {
            const data = yield fetchData("backend/loadData.php");
            data.categories.push({ name: categoryName, items: [] });
            yield postData("backend/saveData.php", data);
            location.reload(); // Reload to display the new category
        }
    });
}
// Add a new item to a specific category
function addItem(categoryName) {
    return __awaiter(this, void 0, void 0, function* () {
        const itemName = prompt(`Enter new item name for ${categoryName}:`);
        if (itemName) {
            const data = yield fetchData("backend/loadData.php");
            const category = data.categories.find((cat) => cat.name === categoryName);
            if (category) {
                category.items.push({
                    name: itemName,
                    status: "Need Now",
                    timestamp: new Date().toISOString(),
                });
                yield postData("backend/saveData.php", data);
                location.reload();
            }
        }
    });
}
// Edit an existing category name
function editCategory(categoryName) {
    return __awaiter(this, void 0, void 0, function* () {
        const newCategoryName = prompt("Edit category name:", categoryName);
        if (newCategoryName) {
            const data = yield fetchData("backend/loadData.php");
            const category = data.categories.find((cat) => cat.name === categoryName);
            if (category) {
                category.name = newCategoryName;
                yield postData("backend/saveData.php", data);
                location.reload();
            }
        }
    });
}
// Edit an existing item name
function editItem(itemName) {
    return __awaiter(this, void 0, void 0, function* () {
        const newItemName = prompt("Edit item name:", itemName);
        if (newItemName) {
            const data = yield fetchData("backend/loadData.php");
            for (const category of data.categories) {
                const item = category.items.find((i) => i.name === itemName);
                if (item) {
                    item.name = newItemName;
                    yield postData("backend/saveData.php", data);
                    location.reload();
                    return;
                }
            }
        }
    });
}
// Delete a category
function deleteCategory(categoryName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (confirm(`Delete category ${categoryName}?`)) {
            const data = yield fetchData("backend/loadData.php");
            data.categories = data.categories.filter((cat) => cat.name !== categoryName);
            yield postData("backend/saveData.php", data);
            location.reload();
        }
    });
}
// Delete an item
function deleteItem(itemName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (confirm(`Delete item ${itemName}?`)) {
            const data = yield fetchData("backend/loadData.php");
            for (const category of data.categories) {
                category.items = category.items.filter((i) => i.name !== itemName);
            }
            yield postData("backend/saveData.php", data);
            location.reload();
        }
    });
}
// Finish shopping: remove items marked as "toggled" and save them to history
function finishShopping() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fetchData("backend/loadData.php");
        const now = new Date();
        const historyData = { categories: [] };
        // Loop through categories and items
        for (const category of data.categories) {
            const historyCategory = { name: category.name, items: [] };
            const remainingItems = [];
            for (const item of category.items) {
                const element = document.querySelector(`[data-item="${item.name}"]`);
                const isToggled = element === null || element === void 0 ? void 0 : element.classList.contains("toggled");
                if (isToggled && item.status !== "Always Need") {
                    historyCategory.items.push(item); // Add to history
                }
                else {
                    remainingItems.push(item); // Keep in need.json
                }
            }
            if (historyCategory.items.length > 0) {
                historyData.categories.push(historyCategory);
            }
            category.items = remainingItems; // Update the remaining items
        }
        // Save remaining items to need.json
        yield postData("backend/saveData.php", data);
        // Save history data
        const historyFileName = `data/history/${now
            .toISOString()
            .replace(/[:.]/g, "-")}.json`;
        yield postData(historyFileName, historyData);
        location.href = "main_list.php"; // Return to main list
    });
}
// Cancel shopping without saving
function cancelShopping() {
    location.href = "main_list.php";
}
// Export history as an Excel file
function exportHistory() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("backend/exportHistory.php");
        const blob = yield response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "exported_history.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
    });
}
// Event listeners (if needed) can be added here
// Compile this TypeScript file to JavaScript by running `tsc main.ts`
