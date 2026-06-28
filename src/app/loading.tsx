export default function Loading() {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-secondary-200 border-t-primary-500" />
          <p className="mt-4 text-secondary-500">Loading...</p>
        </div>
      </div>
    );
  }