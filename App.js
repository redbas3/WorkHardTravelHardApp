import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { theme } from "./colors";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";

const WORKING_KEY = "@working";
const STORAGE_KEY = "@toDos";

export default function App() {
  const [editingId, setEditingId] = useState("");
  const [editingText, setEditingText] = useState("");
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  useEffect(() => {
    loadWorking();
    loadToDos();
  }, []);
  const travel = () => {
    setWorking(false);
    saveWorking(false);
  };
  const work = () => {
    setWorking(true);
    saveWorking(true);
  };

  const onChangeText = (payload) => setText(payload);
  const onEditChangeText = (payload) => setEditingText(payload);

  const saveWorking = async (payload) => {
    try {
      // toSave = {};
      await AsyncStorage.setItem(WORKING_KEY, payload ? "true" : "false");
    } catch (e) {}
  };
  const saveToDos = async (toSave) => {
    try {
      // toSave = {};
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {}
  };
  const editTodo = async () => {
    const newToDos = { ...toDos };
    newToDos[editingId].text = editingText;
    setToDos(newToDos);
    await saveToDos(newToDos);
    setEditingId("");
    setEditingText("");
  };
  const loadWorking = async () => {
    try {
      const s = await AsyncStorage.getItem(WORKING_KEY);
      if (s === "true") {
        setWorking(true);
      } else if (s === "false") {
        setWorking(false);
      }
    } catch (e) {}
  };
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      console.log(s);
      setToDos(JSON.parse(s));
    } catch (e) {}
  };
  const addTodo = async (payload) => {
    if (text == "") {
      return;
    }
    const newToDos = {
      [Date.now()]: { text, working, keep: false },
      ...toDos,
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");

    console.log(newToDos);
  };
  const toggleToDo = async (key) => {
    const newToDos = { ...toDos };
    newToDos[key].keep = !newToDos[key].keep;
    setToDos(newToDos);
    await saveToDos(newToDos);
  };
  const openEditToDo = (key, text) => {
    setEditingId(key);
    setEditingText(text);
  };
  const deleteToDo = async (key) => {
    Alert.alert("Delete TO Do?", "Are you Sure?", [
      {
        text: "Cancel",
      },
      {
        text: "I'm Sure",
        style: "destructive",
        onPress: async () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          await saveToDos(newToDos);
        },
      },
    ]);
    return;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
            onPress={() => work()}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
            onPress={() => travel()}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onChangeText={onChangeText}
        onSubmitEditing={addTodo}
        value={text}
        returnKeyType="done"
        placeholder={working ? "Add a To Do" : "Where do you want a go"}
        style={styles.input}
      />
      <Text
        style={{
          color: "white",
          fontSize: 20,
          marginBottom: 10,
          marginLeft: 5,
        }}
      >
        To Do List
      </Text>
      <ScrollView style={{ flex: 1 }}>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working && !toDos[key].keep ? (
            <View key={key} style={styles.toDo}>
              {editingId === key ? null : (
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
              )}
              {editingId === key ? (
                <TextInput
                  onChangeText={onEditChangeText}
                  onSubmitEditing={editTodo}
                  value={editingText}
                  returnKeyType="done"
                  style={styles.inputEdit}
                />
              ) : null}
              <View style={styles.btnWrap}>
                <TouchableOpacity
                  onPress={() => openEditToDo(key, toDos[key].text)}
                >
                  <MaterialCommunityIcons
                    name="square-edit-outline"
                    size={20}
                    color="white"
                    style={{ paddingHorizontal: 8 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleToDo(key)}>
                  <MaterialCommunityIcons
                    name="tray-arrow-down"
                    size={20}
                    color="white"
                    style={{ paddingHorizontal: 8 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Fontisto
                    name="trash"
                    size={20}
                    color="white"
                    style={{ paddingHorizontal: 8 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        )}
      </ScrollView>
      <Text
        style={{
          color: "white",
          fontSize: 20,
          marginTop: 30,
          marginLeft: 5,
        }}
      >
        End List
      </Text>
      <ScrollView style={{ flex: 1, marginTop: 10 }}>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working && toDos[key].keep ? (
            <View key={key} style={styles.toDo}>
              <Text style={styles.keepdToDoText}>{toDos[key].text}</Text>
              <View style={styles.btnWrap}>
                <TouchableOpacity onPress={() => toggleToDo(key)}>
                  <MaterialCommunityIcons
                    name="tray-arrow-up"
                    size={20}
                    color="white"
                    style={{ paddingHorizontal: 8 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Fontisto
                    name="trash"
                    size={20}
                    color="white"
                    style={{ paddingHorizontal: 8 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
    color: "white",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  inputEdit: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    fontSize: 16,
    marginRight: 6,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  keepdToDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textDecorationLine: "line-through",
  },
  btnWrap: {
    flexDirection: "row",
  },
});
