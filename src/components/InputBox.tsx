type InputProps = Partial<{
  color: "indigo" | "blue";
  type: "text" | "password" | "email";
  asTextArea: true | undefined;
  className: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: string;
  placeholder: string;
}>;

type TextAreaProps = Omit<InputProps, "onChange" | "type"> &
  Partial<{
    asTextArea: true;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  }>;

const InputBox = ({
  color,
  asTextArea,
  ...props
}: InputProps & TextAreaProps) => {
  let colorClasses;
  const commonClasses = "border-2 p-4 outline-none";

  switch (color) {
    case "indigo":
      colorClasses = "border-indigo-500";
      break;
    case "blue":
      colorClasses = "border-blue-500";
      break;
    default:
      colorClasses = "border-indigo-500";
      break;
  }

  if (asTextArea) {
    return (
      <textarea
        {...props}
        className={`min-h-[100px] ${commonClasses} ${props.className} ${colorClasses}`}
      />
    );
  }

  return (
    <input
      {...props}
      className={`${commonClasses} ${props.className} ${colorClasses}`}
    />
  );
};

export default InputBox;
