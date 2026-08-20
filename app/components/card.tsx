import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSQLiteContext } from "expo-sqlite";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Todo = {
  id: number;
  title: string;
  completed: number;
};

type CardProps = {
  todo: Todo;
  refresh: () => void;
};

export default function Card({ todo, refresh }: CardProps) {
  const db = useSQLiteContext();

  // ==========================================
  // CARD COLORS
  // ==========================================
  const cardColors = [
    "#FFC83D", // Yellow
    "#6267DC", // Purple
    "#36B875", // Green
    "#1763A8", // Blue
    "#FF6849", // Coral
  ];

  const cardColor =
    cardColors[Math.abs(todo.id - 1) % cardColors.length];

  // Yellow ใช้ตัวหนังสือสีเข้ม
  const isYellow = cardColor === "#FFC83D";

  const titleColor = isYellow
    ? "#10293D"
    : "#FFFFFF";

  // ==========================================
  // TOGGLE COMPLETE
  // ==========================================
  const setCompleted = async () => {
    const markComplete =
      (todo.completed + 1) % 2;

    try {
      await db.runAsync(
        "UPDATE todos SET completed = ? WHERE id = ?",
        [markComplete, todo.id]
      );

      refresh();
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.message
      );
    }
  };

  // ==========================================
  // DELETE TODO
  // ==========================================
  const removeTodo = () => {
    Alert.alert(
      "Delete Task",
      `Do you really want to delete "${todo.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",

          onPress: async () => {
            try {
              await db.runAsync(
                "DELETE FROM todos WHERE id = ?",
                [todo.id]
              );

              refresh();
            } catch (err: any) {
              Alert.alert(
                "Error",
                err.message
              );
            }
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: cardColor,
        },
        todo.completed === 1 &&
          styles.completedContainer,
      ]}
    >
      {/* =====================================
          LEFT ICON
      ===================================== */}
      <TouchableOpacity
        style={styles.iconBox}
        onPress={setCompleted}
        activeOpacity={0.75}
      >
        <FontAwesome
          name={
            todo.completed === 1
              ? "check"
              : "star"
          }
          size={20}
          color={
            todo.completed === 1
              ? "#36B875"
              : cardColor
          }
        />
      </TouchableOpacity>

      {/* =====================================
          TASK DETAIL
      ===================================== */}
      <View style={styles.taskInfo}>
        <Text
          numberOfLines={2}
          style={[
            styles.title,
            {
              color: titleColor,
            },
            todo.completed === 1 &&
              styles.completedTitle,
          ]}
        >
          {todo.title}
        </Text>

        <TouchableOpacity
          onPress={setCompleted}
          activeOpacity={0.75}
        >
          <View style={styles.statusBadge}>
            <FontAwesome
              name={
                todo.completed === 1
                  ? "check-circle"
                  : "clock-o"
              }
              size={11}
              color={
                todo.completed === 1
                  ? "#278552"
                  : "#56616A"
              }
            />

            <Text
              style={[
                styles.statusText,
                todo.completed === 1 &&
                  styles.completedStatusText,
              ]}
            >
              {todo.completed === 1
                ? "Completed"
                : "To Do"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* =====================================
          ACTION BUTTONS
      ===================================== */}
      <View style={styles.actions}>
        {/* DONE */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={setCompleted}
          activeOpacity={0.7}
        >
          <FontAwesome
            name={
              todo.completed === 1
                ? "undo"
                : "check"
            }
            size={18}
            color={
              todo.completed === 1
                ? "#6267DC"
                : "#36B875"
            }
          />
        </TouchableOpacity>

        {/* DELETE */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={removeTodo}
          activeOpacity={0.7}
        >
          <FontAwesome
            name="trash-o"
            size={19}
            color="#FF6849"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ==========================================
  // CARD
  // ==========================================
  container: {
    width: "100%",

    minHeight: 88,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 14,
    paddingVertical: 13,

    marginBottom: 11,

    borderRadius: 21,

    borderBottomWidth: 5,
    borderBottomColor:
      "rgba(0,0,0,0.12)",

    shadowColor: "#42515C",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 7,

    elevation: 3,
  },

  completedContainer: {
    opacity: 0.72,
  },

  // ==========================================
  // LEFT ICON
  // ==========================================
  iconBox: {
    width: 48,
    height: 48,

    borderRadius: 16,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,

    elevation: 2,
  },

  // ==========================================
  // TASK INFO
  // ==========================================
  taskInfo: {
    flex: 1,
  },

  title: {
    fontSize: 17,
    fontWeight: "900",
  },

  completedTitle: {
    textDecorationLine: "line-through",
  },

  // ==========================================
  // STATUS
  // ==========================================
  statusBadge: {
    alignSelf: "flex-start",

    flexDirection: "row",
    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.88)",

    paddingHorizontal: 9,
    paddingVertical: 4,

    borderRadius: 10,

    marginTop: 7,
  },

  statusText: {
    color: "#56616A",

    fontSize: 10,
    fontWeight: "800",

    marginLeft: 5,
  },

  completedStatusText: {
    color: "#278552",
  },

  // ==========================================
  // ACTIONS
  // ==========================================
  actions: {
    flexDirection: "row",
    alignItems: "center",

    marginLeft: 8,
  },

  actionButton: {
    width: 36,
    height: 36,

    borderRadius: 12,

    backgroundColor:
      "rgba(255,255,255,0.92)",

    alignItems: "center",
    justifyContent: "center",

    marginLeft: 6,
  },
});