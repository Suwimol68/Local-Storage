import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AddTodo from "./components/addTodo";
import Card from "./components/card";

type Todo = {
  id: number;
  title: string;
  completed: number;
};

type FilterType = "all" | "todo" | "done";

export default function Index() {
  const db = useSQLiteContext();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");

  // =====================================
  // READ TODOS
  // =====================================
  const getTodos = async () => {
    try {
      const results = await db.getAllAsync<Todo>(
        "SELECT * FROM todos ORDER BY id DESC"
      );

      setTodos(results);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Cannot read todos.");
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  // =====================================
  // STATISTICS
  // =====================================
  const total = todos.length;

  const completed = todos.filter(
    (todo) => todo.completed === 1
  ).length;

  const remaining = total - completed;

  const progress =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  // =====================================
  // PROGRESS MESSAGE
  // =====================================
  const getProgressMessage = () => {
    if (total === 0) {
      return "Let's add your first task!";
    }

    if (progress === 100) {
      return "Amazing! All tasks completed!";
    }

    if (progress >= 75) {
      return "Almost there!";
    }

    if (progress >= 50) {
      return "Great progress!";
    }

    if (progress >= 25) {
      return "Keep going!";
    }

    return "Let's get started!";
  };

  // =====================================
  // FILTER
  // =====================================
  const filteredTodos = todos.filter((todo) => {
    if (filter === "todo") {
      return todo.completed === 0;
    }

    if (filter === "done") {
      return todo.completed === 1;
    }

    return true;
  });

  // =====================================
  // DATE
  // =====================================
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // =====================================
  // HEADER CONTENT
  // =====================================
  const ListHeader = () => (
    <>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Daily Planner
          </Text>

          <Text style={styles.date}>
            {today}
          </Text>
        </View>

        <View style={styles.helloBubble}>
          <Text style={styles.helloText}>
            Hello!
          </Text>
        </View>
      </View>

      {/* FILTER */}
      <View style={styles.topTabs}>
        <TouchableOpacity
          style={[
            styles.topTabButton,
            filter === "all"
              ? styles.allTab
              : styles.inactiveTab,
          ]}
          onPress={() => setFilter("all")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.topTabText,
              filter !== "all" &&
                styles.inactiveTabText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.topTabButton,
            filter === "todo"
              ? styles.todoTab
              : styles.inactiveTab,
          ]}
          onPress={() => setFilter("todo")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.topTabText,
              filter !== "todo" &&
                styles.inactiveTabText,
              filter === "todo" &&
                styles.darkText,
            ]}
          >
            To Do
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.topTabButton,
            filter === "done"
              ? styles.doneTab
              : styles.inactiveTab,
          ]}
          onPress={() => setFilter("done")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.topTabText,
              filter !== "done" &&
                styles.inactiveTabText,
            ]}
          >
            Done
          </Text>
        </TouchableOpacity>
      </View>

      {/* PROGRESS */}
      <View style={styles.progressCard}>
        <View style={styles.progressTop}>
          <View style={styles.progressIcon}>
            <FontAwesome
              name="star"
              size={18}
              color="#FF9E28"
            />
          </View>

          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>
              Today's Progress
            </Text>

            <Text style={styles.progressMessage}>
              {getProgressMessage()}
            </Text>
          </View>

          <View style={styles.percentBox}>
            <Text style={styles.percentText}>
              {progress}%
            </Text>
          </View>
        </View>

        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${progress}%`,
              },
            ]}
          />
        </View>

        <View style={styles.progressBottom}>
          <Text style={styles.progressDetail}>
            {completed} completed
          </Text>

          <Text style={styles.progressDetail}>
            {remaining} remaining
          </Text>
        </View>
      </View>

      {/* STATISTICS */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.totalCard]}>
          <FontAwesome
            name="list"
            size={18}
            color="#A66B00"
          />

          <Text style={styles.statNumber}>
            {total}
          </Text>

          <Text style={styles.statLabel}>
            Total
          </Text>
        </View>

        <View style={[styles.statCard, styles.doneCard]}>
          <FontAwesome
            name="check"
            size={18}
            color="#137149"
          />

          <Text style={styles.statNumber}>
            {completed}
          </Text>

          <Text style={styles.statLabel}>
            Done
          </Text>
        </View>

        <View style={[styles.statCard, styles.leftCard]}>
          <FontAwesome
            name="clock-o"
            size={19}
            color="#4249B7"
          />

          <Text style={styles.statNumber}>
            {remaining}
          </Text>

          <Text style={styles.statLabel}>
            Left
          </Text>
        </View>
      </View>

      {/* ADD TASK */}
      <View style={styles.addSection}>
        <Text style={styles.sectionTitle}>
          Add Task
        </Text>

        <Text style={styles.sectionSubtitle}>
          What do you want to get done?
        </Text>

        <View style={styles.addTodoSpace}>
          <AddTodo refresh={getTodos} />
        </View>
      </View>

      {/* TASK HEADER */}
      <View style={styles.taskHeader}>
        <View>
          <Text style={styles.taskTitle}>
            My Tasks
          </Text>

          <Text style={styles.taskSubtitle}>
            Complete your goals for today
          </Text>
        </View>

        <View style={styles.taskCount}>
          <Text style={styles.taskCountText}>
            {filteredTodos.length}
          </Text>
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top"]}
    >
      <View style={styles.container}>
        <FlatList
          data={filteredTodos}
          keyExtractor={(item) =>
            item.id.toString()
          }
          renderItem={({ item }) => (
            <Card
              todo={item}
              refresh={getTodos}
            />
          )}
          ListHeaderComponent={ListHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <FontAwesome
                  name={
                    filter === "todo"
                      ? "check-circle"
                      : "list-alt"
                  }
                  size={28}
                  color="#36B875"
                />
              </View>

              <Text style={styles.emptyTitle}>
                {filter === "todo"
                  ? "You're all done!"
                  : filter === "done"
                  ? "No completed tasks"
                  : "No tasks yet"}
              </Text>

              <Text style={styles.emptyText}>
                {filter === "all"
                  ? "Add a task and start planning your day."
                  : "Try another tab to see your tasks."}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // =====================
  // SAFE AREA
  // =====================
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF8EA",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFF8EA",
  },

  content: {
    // เพิ่มพื้นที่ว่างด้านบน
    paddingTop: 36,
    paddingHorizontal: 20,
    paddingBottom: 45,
  },

  // =====================
  // HEADER
  // =====================
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    // เพิ่มช่องว่างก่อน Filter
    marginBottom: 22,
  },

  title: {
    color: "#10293D",
    fontSize: 29,
    fontWeight: "900",
  },

  date: {
    color: "#818A90",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },

  helloBubble: {
    backgroundColor: "#B9E3F8",

    paddingHorizontal: 17,
    paddingVertical: 10,

    borderRadius: 17,
    borderBottomLeftRadius: 5,
  },

  helloText: {
    color: "#10293D",
    fontSize: 16,
    fontWeight: "900",
  },

  // =====================
  // FILTER
  // =====================
  topTabs: {
    flexDirection: "row",

    height: 46,

    borderRadius: 17,
    overflow: "hidden",

    marginBottom: 13,
  },

  topTabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  allTab: {
    backgroundColor: "#FF6849",
  },

  todoTab: {
    backgroundColor: "#FFD13D",
  },

  doneTab: {
    backgroundColor: "#36B875",
  },

  inactiveTab: {
    backgroundColor: "#F0EEE8",
  },

  topTabText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  darkText: {
    color: "#10293D",
  },

  inactiveTabText: {
    color: "#939996",
  },

  // =====================
  // PROGRESS
  // =====================
  progressCard: {
    backgroundColor: "#FFC83D",

    padding: 14,

    borderRadius: 22,

    borderBottomWidth: 5,
    borderBottomColor: "#EFA91F",

    marginBottom: 13,
  },

  progressTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  progressIcon: {
    width: 38,
    height: 38,

    borderRadius: 12,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 9,
  },

  progressInfo: {
    flex: 1,
  },

  progressTitle: {
    color: "#10293D",
    fontSize: 16,
    fontWeight: "900",
  },

  progressMessage: {
    color: "#715814",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 2,
  },

  percentBox: {
    backgroundColor: "#FFFFFF",

    paddingHorizontal: 10,
    paddingVertical: 6,

    borderRadius: 11,
  },

  percentText: {
    color: "#10293D",
    fontSize: 14,
    fontWeight: "900",
  },

  progressBackground: {
    height: 9,

    backgroundColor: "#FFF2A8",

    borderRadius: 20,

    overflow: "hidden",

    marginTop: 12,
  },

  progressBar: {
    height: "100%",
    backgroundColor: "#36B875",
  },

  progressBottom: {
    flexDirection: "row",
    justifyContent: "space-between",

    marginTop: 7,
  },

  progressDetail: {
    color: "#705B23",
    fontSize: 9,
    fontWeight: "700",
  },

  // =====================
  // STATISTICS
  // =====================
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",

    marginBottom: 15,
  },

  statCard: {
    width: "31%",

    minHeight: 84,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 18,

    borderBottomWidth: 4,
  },

  totalCard: {
    backgroundColor: "#FFD977",
    borderBottomColor: "#EFB83C",
  },

  doneCard: {
    backgroundColor: "#BDEBCF",
    borderBottomColor: "#75C997",
  },

  leftCard: {
    backgroundColor: "#C8CBFF",
    borderBottomColor: "#9398E7",
  },

  statNumber: {
    color: "#10293D",
    fontSize: 19,
    fontWeight: "900",
    marginTop: 3,
  },

  statLabel: {
    color: "#58646C",
    fontSize: 10,
    fontWeight: "700",
  },

  // =====================
  // ADD TASK
  // =====================
  addSection: {
    marginBottom: 15,
  },

  sectionTitle: {
    color: "#10293D",
    fontSize: 17,
    fontWeight: "900",
  },

  sectionSubtitle: {
    color: "#92999D",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 1,
  },

  addTodoSpace: {
    marginTop: 7,
  },

  // =====================
  // TASK HEADER
  // =====================
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 10,
  },

  taskTitle: {
    color: "#10293D",
    fontSize: 18,
    fontWeight: "900",
  },

  taskSubtitle: {
    color: "#92999D",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },

  taskCount: {
    width: 32,
    height: 32,

    backgroundColor: "#36B875",

    borderRadius: 11,

    alignItems: "center",
    justifyContent: "center",
  },

  taskCountText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  // =====================
  // EMPTY
  // =====================
  empty: {
    alignItems: "center",
    paddingVertical: 20,
  },

  emptyIcon: {
    width: 52,
    height: 52,

    borderRadius: 17,

    backgroundColor: "#E0F5E9",

    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    color: "#10293D",
    fontSize: 16,
    fontWeight: "900",

    marginTop: 8,
  },

  emptyText: {
    color: "#92999D",
    fontSize: 10,

    textAlign: "center",

    marginTop: 3,
  },
});