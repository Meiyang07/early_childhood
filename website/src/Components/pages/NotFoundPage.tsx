



export default function NotFoundPage() {
  return (
    <section className="grid min-h-[55vh] place-content-center place-items-center gap-3 px-6 text-center">
      <h1 className="m-0 font-serif text-[clamp(2.5rem,6vw,4rem)] font-bold">Page not found</h1>
      <SiteLink
        to="/"
        className="inline-flex items-center justify-center rounded-full bg-brand-blue px-7 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        Return home
      </SiteLink>
    </section>
  );
}