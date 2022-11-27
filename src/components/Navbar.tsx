import { useEffect } from "react";
import {
  RiLoginCircleLine,
  RiLogoutCircleLine,
  RiTrophyLine,
} from "react-icons/ri";
import { rootRouter } from "../App";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { clearAuth, setAuthToken } from "../states/auth/actions";
import { asyncGetUserProfile } from "../states/auth/thunks";
import GLOBAL_CONFIG from "../utils/globals";

const Navbar = () => {
  const isLogin = useAppSelector(
    (state) => !!state.auth.user || !!state.auth.token
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem(GLOBAL_CONFIG.API_LOCAL_KEY);
    if (token) {
      dispatch(asyncGetUserProfile(token));
      dispatch(setAuthToken(token));
    }
  }, []);

  const onLogoutClick = () => {
    localStorage.removeItem(GLOBAL_CONFIG.API_LOCAL_KEY);
    dispatch(clearAuth());
  };

  return (
    <div className="sticky top-0 z-30 w-full bg-indigo-300 p-4">
      <nav className="container mx-auto flex items-center">
        <rootRouter.Link to="/" className="text-2xl font-bold hover:underline">
          Home
        </rootRouter.Link>
        <rootRouter.Link to="/leaderboards" className="ml-auto mr-8 font-bold">
          <RiTrophyLine className="text-2xl text-yellow-500" />
        </rootRouter.Link>
        {isLogin ? (
          <button onClick={onLogoutClick}>
            <RiLogoutCircleLine className="text-2xl text-red-500" />
          </button>
        ) : (
          <rootRouter.Link to="/login">
            <RiLoginCircleLine className="text-2xl text-green-500" />
          </rootRouter.Link>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
