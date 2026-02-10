export default function Loader({ text = "Loading...", size = "md" }) {
  const sizeClasses = { sm: "h-6 w-6 border-2", md: "h-10 w-10 border-3", lg: "h-14 w-14 border-4" };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-blue-200 border-t-blue-600`} />
      <p className="text-sm font-medium text-slate-500">{text}</p>
    </div>
  );
}
