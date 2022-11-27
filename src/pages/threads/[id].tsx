import { createRouteConfig, useMatch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RiArrowUpSLine, RiArrowDownSLine } from "react-icons/ri";
import { z } from "zod";
import CommentForm from "../../components/CommentForm";
import CommentItem from "../../components/CommentItem";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { clearThreadDetail } from "../../states/threads/actions";
import {
  asyncGetThreadDetail,
  asyncVoteThreadDetail,
} from "../../states/threads/thunks";
import { ThreadDetail, Vote } from "../../utils/api";

const ThreadDetailPage = () => {
  const { params } = useMatch(threadDetailRoute.id);
  const id = params.id as string;

  const [threadDetail, userId] = useAppSelector((state) => [
    state.threads.detail,
    state.auth.user?.id,
  ]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(asyncGetThreadDetail(id));

    return () => {
      dispatch(clearThreadDetail());
    };
  }, []);

  const [voted, setVoted] = useState<-1 | 0 | 1>(0);

  useEffect(() => {
    if (userId) {
      threadDetail?.upVotesBy.includes(userId)
        ? setVoted(1)
        : threadDetail?.downVotesBy.includes(userId)
        ? setVoted(-1)
        : setVoted(0);
    }
  }, [threadDetail]);

  const vote = (type: Vote["voteType"]) => {
    if (!userId) {
      alert("You have to login to vote!");
      return;
    }

    if ((voted === 1 && type === 1) || (voted === -1 && type === -1)) {
      setVoted(0);
      dispatch(
        asyncVoteThreadDetail({
          type: 0,
          threadId: threadDetail?.id as ThreadDetail["id"],
        })
      );
      return;
    }

    setVoted(type);
    dispatch(
      asyncVoteThreadDetail({
        type,
        threadId: threadDetail?.id as ThreadDetail["id"],
      })
    );
  };

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
              onClick={() => vote(1)}
              className={`flex items-center ${voted === 1 && "text-green-500"}`}
            >
              <RiArrowUpSLine className="text-2xl" />{" "}
              {threadDetail.upVotesBy.length}
            </button>
            <button
              onClick={() => vote(-1)}
              className={`flex items-center ${voted === -1 && "text-red-500"}`}
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
            <CommentForm />
            {threadDetail.comments.map((comment) => (
              <CommentItem comment={comment} key={comment.id} />
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
