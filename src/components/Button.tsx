interface Props {
  type?: "submit";
  className?: string;
  children: React.ReactNode;
  full?: boolean;
  color?: "indigo" | "blue" | "red";
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button = (props: Props) => {
  let colorClasses;

  switch (props.color) {
    case "indigo":
      colorClasses = "bg-indigo-500";
      break;
    case "blue":
      colorClasses = "bg-blue-500";
      break;

    case "red":
      colorClasses = "bg-red-500";
      break;
    default:
      colorClasses = "bg-indigo-500";
      break;
  }

  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={`${props.className} ${colorClasses} ${
        props.full && "w-full"
      } flex justify-center gap-2 py-2 px-4 text-white disabled:bg-gray-300 disabled:text-black`}
    >
      {props.children}
    </button>
  );
};

export default Button;
