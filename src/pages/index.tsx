import { createRouteConfig, useMatch, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
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
  const { search, Link } = useMatch(indexRoute.id);
  const selectedCategory = search.category as string;
  const categories = [
    ...new Set(
      threads.map(({ category }) => category).filter((category) => !!category)
    ),
  ];

  useEffect(() => {
    (async () => {
      await dispatch(asyncGetAllUsers());
      dispatch(asyncGetAllThreads());
    })();
  }, []);

  return (
    <main className="grid-cols-max container mx-auto grid gap-4 p-4">
      <section className="grid grid-flow-row-dense grid-cols-5 gap-2">
        {categories.map((category) => (
          <Link
            key={category}
            className={`border-2 border-indigo-300 py-2 text-center ${
              selectedCategory === category && "bg-indigo-300"
            }`}
            search={() => {
              if (!(category === selectedCategory)) {
                return { category };
              }

              return {};
            }}
          >
            {category}
          </Link>
        ))}
      </section>
      {authedUser && <ThreadForm />}
      {threads ? (
        selectedCategory ? (
          threads
            .filter((thread) =>
              thread.category
                .toLowerCase()
                .includes(selectedCategory.toLowerCase())
            )
            .map((thread) => <ThreadItem thread={thread} key={thread.id} />)
        ) : (
          threads.map((thread) => (
            <ThreadItem thread={thread} key={thread.id} />
          ))
        )
      ) : (
        <div>Loading...</div>
      )}
    </main>
  );
};

export const indexRoute = createRouteConfig().createRoute({
  path: "/",
  component: IndexPage,
  validateSearch: z.object({
    category: z.string().optional(),
  }),
});

export default IndexPage;
