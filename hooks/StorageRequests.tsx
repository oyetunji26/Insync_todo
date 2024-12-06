import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeTodo = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("todolist", jsonValue);
    // console.log(jsonValue)
  } catch (error) {
    // saving error
    console.error(error);
  }
};

export const getTodo = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("todolist");
    //   return jsonValue != null ? JSON.parse(jsonValue) : null;
    // jsonValue != null ? console.log('Stored data',JSON.parse(jsonValue)) : null
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    // saving error
    console.error(error);
  }
};

export const updatTodo = async (newItem) => {
  try {
    // Step 1: Retrieve existing data
    const existingData = await AsyncStorage.getItem("yourKey");

    let dataArray = [];
    if (existingData) {
      // Step 2: Parse existing data
      dataArray = JSON.parse(existingData);
    }

    // Step 3: Update the data
    const index = dataArray.findIndex((item) => item.id === newItem.id);
    if (index > -1) {
      // If the item exists, update it
      dataArray[index] = newItem;
    } else {
      // If the item does not exist, append it
      dataArray.push(newItem);
    }

    // Step 4: Save the updated data
    await AsyncStorage.setItem("yourKey", JSON.stringify(dataArray));

    console.log("Data updated successfully!");
  } catch (error) {
    console.error("Error updating data:", error);
  }
};

export const updateTodo = async (newValue) => {
  try {
    const storedValue = await AsyncStorage.getItem("todolist");
    const parsedValue = storedValue !== null ? JSON.parse(storedValue) : [];
    const updatedValue = [...parsedValue, newValue];
    const jsonUpdatedValue = JSON.stringify(updatedValue);
    await AsyncStorage.setItem("todolist", jsonUpdatedValue);
  } catch (error) {
    console.error(error);
  }
};

export const removeTodos = async () => {
  try {
    await AsyncStorage.removeItem("todolist");
  } catch (error) {
    console.log(error);
  }
};
