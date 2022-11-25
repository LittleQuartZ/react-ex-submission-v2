import { createRouteConfig } from "@tanstack/react-router";
import { useEffect } from "react";
import ThreadForm from "../components/ThreadForm";
import ThreadItem from "../components/ThreadItem";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { asyncGetAllThreads } from "../states/threads/thunks";
import { asyncGetAllUsers } from "../states/users/thunks";

const IndexPage = () => {
  const [threads, authedUser] = useAppSelector((state) => [
    state.threads.list,
    state.auth.user,
  ]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(asyncGetAllUsers());
      dispatch(asyncGetAllThreads());
    })();
  }, []);

  return (
    <main className="container mx-auto grid gap-4 p-4">
      {authedUser && <ThreadForm />}
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
