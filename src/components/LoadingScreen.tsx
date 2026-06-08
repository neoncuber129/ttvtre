export function LoadingScreen({ title }: { title?: string }) {
  return (
    <section className="card upload-card">
      <div className="spinner-wrap">
        <div className="spinner" />
        <span>{title ?? 'Đang tải kịch bản...'}</span>
      </div>
    </section>
  )
}
