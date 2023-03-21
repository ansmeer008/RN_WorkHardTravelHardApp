import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [editText, setEditText] = useState("");
  const travel = () => {
    setWorking(false);
    saveWhere(false);
  };
  const work = () => {
    setWorking(true);
    saveWhere(true);
  };
  const onChangeText = (e) => setText(e);
  const onEditTextChange = (e) => setEditText(e);

  const saveWhere = async (where) => {
    try {
      await AsyncStorage.setItem("@where", JSON.stringify(where));
    } catch (error) {
      console.log(error);
    }
  };

  const loadWhere = async () => {
    const str = await AsyncStorage.getItem("@where");
    setWorking(JSON.parse(str));
  };

  const saveToDos = async (toSave) => {
    try {
      await AsyncStorage.setItem("@toDos", JSON.stringify(toSave));
    } catch (error) {
      console.log(error);
    }
  };

  const loadToDos = async () => {
    const str = await AsyncStorage.getItem("@toDos");
    setToDos(JSON.parse(str));
  };

  const addToDo = async () => {
    if (text === "") {
      return;
    }
    const newToDos = Object.assign({}, toDos, {
      [Date.now()]: { text, working, done: false, editting: false },
    });
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };

  const deleteToDo = (key) => {
    return Alert.alert("Delete To Do?", "Are u sure?", [
      { text: "Cancel" },
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
  };

  const changeDone = async (key) => {
    const newToDos = {
      ...toDos,
      [key]: { ...toDos[key], done: !toDos[key].done },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
  };

  const changeEditting = async (key) => {
    const newToDos = {
      ...toDos,
      [key]: { ...toDos[key], editting: !toDos[key].editting },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
  };

  const editToDoText = async (key) => {
    const newToDos = {
      ...toDos,
      [key]: { ...toDos[key], text: editText, editting: false },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setEditText("");
  };

  useEffect(() => {
    loadToDos();
    loadWhere();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{ ...styles.btnText, color: working ? theme.grey : "white" }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onChangeText={onChangeText}
        onSubmitEditing={addToDo}
        value={text}
        placeholder={working ? "Add a To Do" : "Where do u want to go?"}
        style={styles.input}
        returnKeyType="done"
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              {toDos[key].done ? (
                <TouchableOpacity
                  style={{ marginRight: 30 }}
                  onPress={() => changeDone(key)}
                >
                  <Fontisto
                    name="checkbox-active"
                    size={18}
                    color={theme.grey}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{ marginRight: 30 }}
                  onPress={() => changeDone(key)}
                >
                  <Fontisto
                    name="checkbox-passive"
                    size={18}
                    color={theme.grey}
                  />
                </TouchableOpacity>
              )}
              {toDos[key].editting ? (
                <TextInput
                  style={styles.editInput}
                  onSubmitEditing={() => editToDoText(key)}
                  defaultValue={toDos[key].text}
                  onChangeText={onEditTextChange}
                  returnKeyType="done"
                />
              ) : (
                <Text
                  style={
                    toDos[key].done
                      ? {
                          ...styles.toDoText,
                          textDecorationLine: "line-through",
                        }
                      : styles.toDoText
                  }
                >
                  {toDos[key].text}
                </Text>
              )}
              <View style={styles.btnBox}>
                {toDos[key].done ? null : (
                  <TouchableOpacity onPress={() => changeEditting(key)}>
                    <Fontisto name="eraser" size={18} color={theme.grey} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Fontisto name="trash" size={18} color={theme.grey} />
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
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    color: "white",
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  editInput: {
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 20,
    fontSize: 16,
  },
  toDo: {
    flex: 1,
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    flex: 7,
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  btnBox: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
