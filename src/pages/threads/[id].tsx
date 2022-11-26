import { createRouteConfig, useMatch } from "@tanstack/react-router";
import { useEffect } from "react";
import { RiArrowUpSLine, RiArrowDownSLine, RiChat3Line } from "react-icons/ri";
import { z } from "zod";
import InputBox from "../../components/InputBox";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { clearThreadDetail } from "../../states/threads/actions";
import { asyncGetThreadDetail } from "../../states/threads/thunks";

const ThreadDetailPage = () => {
  const { params } = useMatch(threadDetailRoute.id);
  const id = params.id as string;

  const [threadDetail, userId] = useAppSelector((state) => [
    state.threads.detail,
    state.auth.user?.id,
  ]);
  const dispatch = useAppDispatch();

  const isVoted = (ids: string[] | undefined) => {
    return userId && ids && ids.includes(userId);
  };

  const upVoted = isVoted(threadDetail?.upVotesBy);
  const downVoted = isVoted(threadDetail?.downVotesBy);

  useEffect(() => {
    dispatch(asyncGetThreadDetail(id));

    return () => {
      dispatch(clearThreadDetail());
    };
  }, []);

  return (
    <main className="container mx-auto flex flex-col gap-2 p-4">
      {threadDetail && (
        <>
          <header className="flex items-center gap-4">
            <img src={threadDetail.owner.avatar} className="rounded-full" />

            <div>
              <h1 className="text-2xl font-bold">{threadDetail.title}</h1>
              <h2 className="text-indigo-700">@{threadDetail.owner.name}</h2>
            </div>
          </header>
          <p className="border-y-2 border-gray-300 py-2 text-lg">
            {threadDetail.body}
          </p>
          <section className="flex gap-4">
            <button
              className={`flex items-center ${upVoted && "text-green-500"}`}
            >
              <RiArrowUpSLine className="text-2xl" />{" "}
              {threadDetail.upVotesBy.length}
            </button>
            <button
              className={`flex items-center ${downVoted && "text-red-500"}`}
            >
              <RiArrowDownSLine className="text-2xl" />{" "}
              {threadDetail.downVotesBy.length}
            </button>
            <span className="ml-auto text-gray-500">
              {new Date(threadDetail.createdAt).toLocaleString()}
            </span>
          </section>
          <section className="flex flex-col">
            <h1 className="mb-4 text-xl">Comments:</h1>
            <form className="flex items-stretch">
              <InputBox
                type="text"
                className="w-full"
                placeholder="insert a new comment"
              />
              <button className="bg-indigo-500 px-4 text-white" type="submit">
                <RiChat3Line className="text-3xl" />
              </button>
            </form>
            {threadDetail.comments.map((comment) => (
              <article
                key={comment.id}
                className="border-x-2 border-indigo-500 px-4 py-2 last:border-b-2"
              >
                <header className="flex justify-between">
                  <h1 className="text-indigo-700">@{comment.owner.name}</h1>
                  <h2 className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </h2>
                </header>
                <p>{comment.content}</p>
                <section className="mt-2 flex gap-4">
                  <button
                    className={`flex items-center ${
                      isVoted(comment.upVotesBy) && "text-green-500"
                    }`}
                  >
                    <RiArrowUpSLine className="text-lg" />{" "}
                    {comment.upVotesBy.length}
                  </button>
                  <button
                    className={`flex items-center ${
                      isVoted(comment.downVotesBy) && "text-green-500"
                    }`}
                  >
                    <RiArrowDownSLine className="text-lg" />{" "}
                    {comment.downVotesBy.length}
                  </button>
                </section>
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  );
};

export const threadDetailRoute = createRouteConfig().createRoute({
  path: "threads/:id",
  id: "threadDetail",
  parseParams: (params) => ({
    id: z.string().parse(params.id),
  }),
  stringifyParams: ({ id }) => ({ id }),
  component: ThreadDetailPage,
});

export default ThreadDetailPage;
