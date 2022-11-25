import { type Thread } from "../utils/api";
import { RiArrowDownSLine, RiArrowUpSLine, RiChat3Line } from "react-icons/ri";
import { useAppSelector } from "../hooks/redux";
import { useEffect, useState } from "react";

type Props = {
  thread: Thread;
};

// TODO: match threads and users, display owner name
const ThreadItem = ({ thread }: Props) => {
  const authedUser = useAppSelector((state) => state.auth.user);
  const [voted, setVoted] = useState<-1 | 0 | 1>(0);

  useEffect(() => {
    if (authedUser) {
      thread.upVotesBy.includes(authedUser.id)
        ? setVoted(1)
        : thread.downVotesBy.includes(authedUser.id)
        ? setVoted(-1)
        : setVoted(0);
    }
  }, [authedUser]);

  return (
    <article className="group relative border-2 border-indigo-300 bg-white p-4 transition hover:border-indigo-500">
      <h1 className="text-xl font-bold">{thread.title}</h1>
      <section className="flex justify-between text-sm">
        <h2 className="text-indigo-700">@{thread.ownerId}</h2>
        <span className="text-gray-500">
          {new Date(thread.createdAt).toLocaleString()}
        </span>
      </section>
      <p className="my-2 line-clamp-3">{thread.body}</p>
      <section className="flex gap-2 text-gray-700">
        <button
          className={`flex items-center ${voted === 1 && "text-green-500"}`}
        >
          <RiArrowUpSLine className="h-6 w-6" /> {thread.upVotesBy.length}
        </button>
        <button
          className={`flex items-center ${voted === -1 && "text-red-500"}`}
        >
          <RiArrowDownSLine className="h-6 w-6" /> {thread.downVotesBy.length}
        </button>
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
