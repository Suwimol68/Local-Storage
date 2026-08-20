import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type AddTodoProps = {
  refresh: () => void;
};

export default function AddTodo({ refresh }: AddTodoProps) {
  const [title, setTitle] = useState("");
  const db = useSQLiteContext();

  // ==========================================
  // ADD NEW TODO
  // ==========================================
  const addTodo = async () => {
    if (!title.trim()) {
      Alert.alert(
        "Add Task",
        "Please enter a task before adding."
      );
      return;
    }

    try {
      const query =
        "INSERT INTO todos (title, completed) VALUES (?, ?);";

      await db.runAsync(query, [
        title.trim(),
        0,
      ]);

      setTitle("");

      refresh();
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.message
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* INPUT */}
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <FontAwesome
            name="pencil"
            size={16}
            color="#6267DC"
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="What do you need to do?"
          placeholderTextColor="#A3A9AE"
          value={title}
          onChangeText={setTitle}
          returnKeyType="done"
          onSubmitEditing={addTodo}
          maxLength={80}
        />
      </View>

      {/* ADD BUTTON */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={addTodo}
        activeOpacity={0.8}
      >
        <FontAwesome
          name="plus"
          size={16}
          color="#FFFFFF"
        />

        <Text style={styles.addButtonText}>
          Add
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  // ==========================================
  // INPUT
  // ==========================================
  inputContainer: {
    flex: 1,
    height: 55,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFFFFF",

    borderRadius: 18,

    borderWidth: 2,
    borderColor: "#EAE5DA",

    paddingHorizontal: 9,

    shadowColor: "#53616A",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    elevation: 2,
  },

  iconContainer: {
    width: 36,
    height: 36,

    borderRadius: 12,

    backgroundColor: "#ECECFF",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 7,
  },

  input: {
    flex: 1,

    color: "#10293D",

    fontSize: 14,
    fontWeight: "600",

    paddingVertical: 0,
  },

  // ==========================================
  // ADD BUTTON
  // ==========================================
  addButton: {
    height: 55,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#FF6849",

    paddingHorizontal: 18,

    borderRadius: 18,

    borderBottomWidth: 4,
    borderBottomColor: "#D94C33",

    shadowColor: "#C4543E",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 6,

    elevation: 4,
  },

  addButtonText: {
    color: "#FFFFFF",

    fontSize: 14,
    fontWeight: "900",

    marginLeft: 6,
  },
});