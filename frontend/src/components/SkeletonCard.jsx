export default function SkeletonCard() {
  return (
    <div className="skeleton">
      <div className="skeleton-poster" />
      <div className="skeleton-info">
        <div className="skeleton-line" />
        <div className="skeleton-line short" />
      </div>
    </div>
  );
}