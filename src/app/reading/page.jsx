
export default async function Page() {
  let feedData = [];
  
  try {
    const res = await fetch('YOUR_API_ENDPOINT');
    if (!res.ok) {
      throw new Error(`Failed to fetch feed: ${res.status} ${res.statusText}`);
    }
    feedData = await res.json();
  } catch (error) {
    console.error('Error fetching JSON feed:', error);
    return (
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h2>Error loading reading list</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Render your feedData here */}
        </div>
      </div>
    </div>
  );
}
