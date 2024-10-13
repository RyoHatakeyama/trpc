import express from "express";
import { Request, Response } from "express";
import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { z } from "zod";

const app = express();
const PORT = 5000;

app.use(cors());

interface Todo {
  id: string;
  content: string;
}

const todoList: Todo[] = [
  {
    id: "1",
    content: "Learn TRPC",
  },
  {
    id: "2",
    content: "Learn React",
  },
  {
    id: "3",
    content: "Learn TypeScript",
  },
];

const t = initTRPC.create();
const router = t.router;
const publicProcedure = t.procedure;

const appRouter = router({
  test: publicProcedure.query(() => {
    return "Hello TRPC";
  }),
  getTodos: publicProcedure.query(() => {
    return todoList;
  }),
  addTodo: publicProcedure.input(z.string()).mutation((req) => {
    const todo: Todo = {
      id: (todoList.length + 1).toString(),
      content: req.input,
    };
    todoList.push(todo);
    return todo;
  }),
  deleteTodo: publicProcedure.input(z.string()).mutation((req) => {
    const index = todoList.findIndex((todo) => todo.id === req.input);
    if (index === -1) {
      return todoList;
    }
    todoList.splice(index, 1);
    return todoList;
  }),
});

app.use("/trpc", trpcExpress.createExpressMiddleware({ router: appRouter }));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export type AppRouter = typeof appRouter;
