function FormInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
}) {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="
          w-full
          rounded-xl
          border
          border-gray-300
          dark:border-gray-600
          bg-white
          dark:bg-gray-800
          text-gray-900
          dark:text-white
          px-4
          py-3
          focus:ring-2
          focus:ring-blue-500
          focus:outline-none
          transition
        "
      />
    </div>
  );
}

export default FormInput;