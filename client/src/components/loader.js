export default function Loader({ isLoading }) {
  if (!isLoading) {
    return null;
  }
  return (
    <div className="bg-white/70 absolute inset-0 flex items-center justify-center">
      <span className="loader"></span>
    </div>
  );
}
