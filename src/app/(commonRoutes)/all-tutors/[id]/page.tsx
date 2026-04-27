export default async function TutorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Tutor Detail</h1>
      <p className="text-gray-600 mt-2">Tutor ID: {id}</p>
    </div>
  );
}
