import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { storeTodo, getTodo, updateTodo } from "@/hooks/StorageRequests";
import { StatusBar } from "expo-status-bar";

const TodoApp = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newTodo, setNewTodo] = useState<string>("");
  const [todos, setTodos] = useState<any[]>([
    {
      userId: 0,
      id: 0,
      title: "Add new",
      completed: false
    }
  ]);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [editTodo, setEditTodo] = useState<any>(null);
  const [editTitle, setEditTitle] = useState<string>("");

  
  useEffect(() => {
    const fetchTodos = async () => {
      const result = await getTodo();
      setTodos(result);
    };
    fetchTodos();
  }, [isLoading]);

  // Add new todo
  const onAddTodo = async () => {
    if (newTodo.trim()) {
      setIsLoading(true);
      const newTodoItem = {
        userId: 1,
        id: todos?.length + 1,
        title: newTodo,
        completed: false,
      };
      const updatedTodos = todos ? [...todos, newTodoItem] : [newTodoItem];
      await storeTodo(updatedTodos);
      setTodos(updatedTodos);
      setNewTodo("");
      setIsLoading(false);
    }
  };

  // Delete any todo by the todo's id
  const handleDelete = async (id: number) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    await updateTodo(updatedTodos);
    storeTodo(updatedTodos);
    setTodos(updatedTodos);
  };

  const handleEdit = (item: any) => {
    setEditTodo(item);
    setEditTitle(item.title);
    setIsEditModalVisible(true);
  };

  const handleUpdate = async () => {
    if (editTitle.trim()) {
      const updatedTodos = todos.map((todo) =>
        todo.id === editTodo.id
          ? { ...todo, title: editTitle }
          : todo
      );
      await updateTodo(updatedTodos);
      storeTodo(updatedTodos);
      setTodos(updatedTodos);
      setIsEditModalVisible(false); // Close modal
    }
  };

  return (
    <SafeAreaView className="px-4 py-2 bg-white">
      <StatusBar style="dark" />
      <View className="bg-blue500">
        <Text className="text-2xl text-black/70 font-semibold">InSync Todo</Text>
      </View>
      <View className="flex-row border border-gray-400 rounded-xl mt-5 mb-2">
        <TextInput
          className="p-2 rounded-2xl grow"
          placeholder="What do you have planned?"
          value={newTodo}
          onChangeText={(e) => setNewTodo(e)}
        />
        <TouchableOpacity
          className="bg-blue-800 rounded-xl flex items-center"
          onPress={onAddTodo}
        >
          <Text className="text-white p-2 px-3">Add task</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="bg-white/70 h-full mt-4">
        <Text className="mb-3 font-bold text-lg text-green-700 ">My Todos</Text>
        <View className="gap-3">
          {todos?.length > 0 ? (
            todos?.map((item, i) => (
              <View key={i} className="flex-row flex-1 justify-between items-center border-b border-gray-300 pb-2">
                <Text className="text-blue flex-wrap text-gray-500 text-lg">
                  {item.title}
                </Text>
                <View className="flex-row gap-1">
                  <TouchableOpacity onPress={() => handleEdit(item)}>
                    <Text className="text-blue-700 font-semibold text-sm">Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Text className="text-red-600 font-semibold text-sm">Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View className="flex-row flex-1 justify-center">
              <Text className="text-blue flex-wrap text-center text-blue-600">No Todos, Add ☝ </Text>
            </View>
          )}
        </View>
      </ScrollView>

      
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-xl w-3/4">
            <Text className="text-xl mb-4">Edit Todo</Text>
            <TextInput
              value={editTitle}
              onChangeText={(text) => setEditTitle(text)}
              placeholder="Edit Todo"
              className="border p-2 rounded-lg"
            />
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity className="bg-red-600 rounded-xl flex-row items-center p-2" onPress={() => setIsEditModalVisible(false)}>
                <Text className="text-white">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity className=" bg-green-700 rounded-xl flex-row items-center p-2" onPress={handleUpdate}>
                <Text className="text-white"> Save </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

export default TodoApp;
