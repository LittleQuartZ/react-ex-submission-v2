import { createRouteConfig } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { rootRouter } from "../App";
import InputBox from "../components/InputBox";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { asyncLogin } from "../states/auth/thunks";

const LoginPage = () => {
  const isLogin = useAppSelector((state) => !!state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLogin) {
      rootRouter.history.back();
    }
  }, [isLogin]);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onLoginSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    dispatch(asyncLogin({ email, password }));
  };

  return (
    <form
      onSubmit={onLoginSubmit}
      className="container absolute top-1/2 left-1/2 mx-auto flex -translate-x-1/2 -translate-y-1/2 flex-col justify-center gap-4 p-4"
    >
      <h1 className="text-2xl font-bold">Login with your account!</h1>
      <InputBox
        type="email"
        placeholder="Email"
        className="border-2 border-indigo-500 p-4 text-lg"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputBox
        type="password"
        placeholder="Password"
        className="border-2 border-indigo-500 p-4 text-lg"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="bg-indigo-500 p-4 font-bold text-white">
        Login
      </button>
      <rootRouter.Link
        to="/register"
        className="ml-auto text-indigo-500 hover:underline"
      >
        Don&apos;t have an account? register here!
      </rootRouter.Link>
    </form>
  );
};

export const loginRoute = createRouteConfig().createRoute({
  path: "login",
  component: LoginPage,
});

export default LoginPage;
