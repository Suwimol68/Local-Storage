import { Stack } from "expo-router";
import {
  SQLiteDatabase,
  SQLiteProvider,
} from "expo-sqlite";

export default function RootLayout() {

  const createTable = async (db: SQLiteDatabase) => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0
      );
    `);
  };

  return (
    <SQLiteProvider
      databaseName="todos.db"
      onInit={createTable}
      options={{ useNewConnection: false }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#F5F7FF",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "My Tasks",
          }}
        />
      </Stack>
    </SQLiteProvider>
  );
}