function FormButton({
  children,
  type = "submit",
  color = "blue",
}) {
  const colors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    red: "bg-red-600 hover:bg-red-700",
    yellow: "bg-yellow-500 hover:bg-yellow-600",
  };

  return (
    <button
      type={type}
      className={`
        ${colors[color]}
        w-full
        text-white
        py-3
        rounded-xl
        font-semibold
        transition
      `}
    >
      {children}
    </button>
  );
}

export default FormButton;