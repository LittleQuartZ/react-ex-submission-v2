import { createRouteConfig } from "@tanstack/react-router";
import { useEffect } from "react";
import ThreadItem from "../components/ThreadItem";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { asyncGetAllThreads } from "../states/threads/thunks";
import { asyncGetAllUsers } from "../states/users/thunks";

const IndexPage = () => {
  const threads = useAppSelector((state) => state.threads.list);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(asyncGetAllThreads());
    dispatch(asyncGetAllUsers());
  }, []);

  return (
    <main className="container mx-auto grid gap-4 p-4">
      {threads &&
        threads.map((thread) => <ThreadItem thread={thread} key={thread.id} />)}
    </main>
  );
};

export const indexRoute = createRouteConfig().createRoute({
  path: "/",
  component: IndexPage,
});

export default IndexPage;
