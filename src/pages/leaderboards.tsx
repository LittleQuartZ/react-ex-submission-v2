import { createRouteConfig } from "@tanstack/react-router";
import { useEffect } from "react";
import { RiStarFill } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { asyncGetLeaderboards } from "../states/leaderboards/thunks";

const LeaderboardsPage = () => {
  const [leaderboards, userId] = useAppSelector((state) => [
    state.leaderboards,
    state.auth.user?.id,
  ]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(asyncGetLeaderboards());
  }, []);

  return (
    <main className="container mx-auto flex flex-col gap-4 p-4">
      <h1 className="text-center text-2xl font-bold">Leaderboards</h1>
      {leaderboards.map((placement, index) => (
        <div
          key={placement.user.id}
          className={`group relative flex gap-4 p-2 ${
            userId === placement.user.id ? "bg-indigo-200" : "bg-indigo-50"
          }`}
        >
          <img src={placement.user.avatar} className="rounded-full" />
          <div className="flex flex-col justify-center">
            <h1 className="font-bold text-indigo-500">
              @{placement.user.name}
            </h1>
            <h2>Score: {placement.score}</h2>
          </div>
          <span
            className={
              "absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-indigo-300 py-2 px-4 text-xl font-bold group-first-of-type:py-4 group-first-of-type:text-yellow-300"
            }
          >
            {index === 0 ? <RiStarFill /> : index + 1}
          </span>
        </div>
      ))}
    </main>
  );
};

export const leaderboardsRoute = createRouteConfig().createRoute({
  path: "leaderboards",
  component: LeaderboardsPage,
});

export default LeaderboardsPage;
