// Storage Conttroller
// /
// /
// /
// /
// /
// /
// /
// Item Controller
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure...state
  const data = {
    items: [
      // { id: 0, name: "Steak Dinner", calories: 1200 },
      // { id: 1, name: "Cookie", calories: 400 },
      // { id: 2, name: "Eggs", calories: 300 },
    ],
    currentItem: null,
    totalCalories: 0,
  };

  // Public methods
  return {
    getItems: () => data.items,
    addItems: (name, calories) => {
      let ID;
      if (name !== "" && calories !== "") {
        ID = data.items.length - 1 + 1;
        // ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },
    getTotalCalories: () => {
      let total = 0;
      data.items.forEach((item) => {
        total += item.calories;
      });
      // Set total cal in data structure
      data.totalCalories = total;

      // Return total
      return data.totalCalories;
    },
    getItemById: (id) => {
      found = null;
      data.items.forEach((item) => {
        if (item.id === id) found = item;
      });
      return found;
    },
    updateItem: (name, calories) => {
      calories = parseInt(calories);
      found = null;
      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    setCurrentItem: (item) => {
      data.currentItem = item;
    },
    getCurrentItem: () => data.currentItem,
    logData: () => data,
  };
})();
//
//
// /
// /
// /
// /
//
// /
// /
// /
// /
// UI Controller
const UICtrl = (function () {
  // UI Selectors
  const UISelectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
  };

  // Public methods
  return {
    populateItemList: (items) => {
      let html = "";
      items.forEach((item) => {
        html += `
         <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i
          ></a>
        </li>
        `;

        // Display in Item List
        document.querySelector(UISelectors.itemList).innerHTML = html;
      });
    },
    getItemInput: () => {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    addListItem: function (item) {
      // Show the List
      document.querySelector(UISelectors.itemList).style.display = "block";
      // Create list Item element
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      li.innerHTML = `
      <strong>${item.name} : </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i
            ></a>
      `;
      // Add Item to DOM
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    clearInput: () => {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    hideList: () => {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: (totalCalories) => {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },
    clearEditState: () => {
      UICtrl.clearInput();
      // Hiding buttons
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    addItemToForm: (item) => {
      document.querySelector(UISelectors.itemNameInput).value = item.name;
      document.querySelector(UISelectors.itemCaloriesInput).value =
        item.calories;
    },
    showEditState: () => {
      // Displaying buttons
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getUISelectors: () => UISelectors,
  };
})();

//
//
// /
// /
// /
// /
//
//
// /
// /
// /
// /
// App Controller
const App = (function (ItemCtrl, UICtrl) {
  //Load Event listeners
  const loadEventListeners = () => {
    // Get UISelectors
    const UISelectors = UICtrl.getUISelectors();

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // Disable add item by Enter key
    document.addEventListener("keypress", (e) => {
      if (e.keyCode === 13 || e.which === 13) {
        console.log("Enetr Disbaled");
      }
    });

    // Add item edit event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // Add item update submit event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);
  };

  const itemAddSubmit = (e) => {
    // Get Input from UICtrl
    const input = UICtrl.getItemInput();
    // console.log(input.name, input.calories);

    // Add Input to items
    const newItem = ItemCtrl.addItems(input.name, input.calories);
    // console.log(newItem);

    // Add new item to UI
    UICtrl.addListItem(newItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Clear fields
    UICtrl.clearInput();

    e.preventDefault();
  };

  const itemEditClick = (e) => {
    if (e.target.classList.contains("edit-item")) {
      // console.log(e.target);
      const listId = e.target.parentElement.parentElement.id;
      // console.log(listId);
      const listArray = listId.split("-");
      // console.log(listArray);
      const id = parseInt(listArray[1]);
      // console.log(id);

      // Item to get
      const itemToEdit = ItemCtrl.getItemById(id);
      // console.log(itemToEdit);

      // Set Current Item
      ItemCtrl.setCurrentItem(itemToEdit);
      // Get current Item
      const item = ItemCtrl.getCurrentItem();
      // Add current item to form
      UICtrl.addItemToForm(item);
      // Display buttons
      UICtrl.showEditState();
    }
    e.preventDefault();
  };

  const itemUpdateSubmit = (e) => {
    // console.log("Update");
    // Get Current Item
    const input = UICtrl.getItemInput();
    // Put in Updated item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    e.preventDefault();
  };

  //
  //
  // Public methods
  return {
    init: function () {
      // Clear Edit state/Set initial state
      UICtrl.clearEditState();

      // fetch items from Data Structure
      const items = ItemCtrl.getItems();
      if (items.length === 0) {
        //Hide UL List
        UICtrl.hideList();
      } else {
        // Populate list with  items
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
      // Load Event Listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, UICtrl);
// Initialize the app
App.init();
// console.log(App.init.items);
