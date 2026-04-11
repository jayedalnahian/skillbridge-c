export default function TutorDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Tutor Detail</h1>
      <p className="text-gray-600 mt-2">Tutor ID: {params.id}</p>
    </div>
  );
}
