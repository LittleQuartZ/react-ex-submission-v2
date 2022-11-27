import { Vote, type Thread } from "../utils/api";
import { RiArrowDownSLine, RiArrowUpSLine, RiChat3Line } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useEffect, useState } from "react";
import { rootRouter } from "../App";
import { asyncVoteThreads } from "../states/threads/thunks";

type Props = {
  thread: Thread;
};

const ThreadItem = ({ thread }: Props) => {
  const [userId, owner] = useAppSelector((state) => [
    state.auth.user?.id,
    state.users.find((user) => user.id === thread.ownerId),
  ]);
  const [voted, setVoted] = useState<-1 | 0 | 1>(0);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userId) {
      thread.upVotesBy.includes(userId)
        ? setVoted(1)
        : thread.downVotesBy.includes(userId)
        ? setVoted(-1)
        : setVoted(0);
    }
  }, [thread]);

  const vote = (type: Vote["voteType"]) => {
    if ((voted === 1 && type === 1) || (voted === -1 && type === -1)) {
      setVoted(0);
      dispatch(asyncVoteThreads({ type: 0, threadId: thread.id }));
      return;
    }

    setVoted(type);
    dispatch(asyncVoteThreads({ type, threadId: thread.id }));
  };

  return (
    <article className="group relative border-2 border-indigo-300 bg-white p-4 transition hover:border-indigo-500">
      <rootRouter.Link
        to="/threads/:id"
        params={{ id: thread.id }}
        className="text-xl font-bold line-clamp-1"
      >
        {thread.title}
      </rootRouter.Link>
      <section className="flex justify-between text-sm">
        <span className="text-indigo-700">@{owner?.name}</span>
        <span className="text-gray-500">
          {new Date(thread.createdAt).toLocaleString()}
        </span>
      </section>
      <p className="my-2 line-clamp-3">{thread.body}</p>
      <section className="flex gap-2 text-gray-700">
        <button
          onClick={() => vote(1)}
          className={`flex items-center ${voted === 1 && "text-green-500"}`}
        >
          <RiArrowUpSLine className="h-6 w-6" /> {thread.upVotesBy.length}
        </button>
        <button
          onClick={() => vote(-1)}
          className={`flex items-center ${voted === -1 && "text-red-500"}`}
        >
          <RiArrowDownSLine className="h-6 w-6" /> {thread.downVotesBy.length}
        </button>
        <span className="ml-4 bg-indigo-300 px-4">{thread.category}</span>
        <button className="ml-auto flex items-center gap-2">
          {thread.totalComments} <RiChat3Line className="h-6 w-6" />
        </button>
      </section>

      <div
        aria-hidden
        className="absolute top-0 left-0 -z-10 h-full w-full border-2 border-indigo-500 transition group-hover:translate-x-2 group-hover:translate-y-2"
      />
    </article>
  );
};

export default ThreadItem;
