import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTutorById, getAssignedCategories } from "@/services/tutor.service";
import { getReviewsByTutor } from "@/services/review.service";
import { TutorDetail } from "./TutorDetail";


interface TutorDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TutorDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const tutorResult = await getTutorById(id);
  const tutorName = tutorResult.success && tutorResult.data ? (tutorResult.data as { name?: string }).name : "Tutor";

  return {
    title: `${tutorName || "Tutor"} | SkillBridge`,
    description: `View ${tutorName || "Tutor"}'s profile, reviews, and book a session on SkillBridge.`,
  };
}

export default async function TutorDetailPage({ params }: TutorDetailPageProps) {
  const { id } = await params;

  // Fetch tutor data, categories, and reviews in parallel
  const [tutorResult, categoriesResult, reviewsResult] = await Promise.all([
    getTutorById(id),
    getAssignedCategories(id),
    getReviewsByTutor(id),
  ]);

  if (!tutorResult.success || !tutorResult.data) {
    notFound();
  }

  const tutor = tutorResult.data;
  const categories = categoriesResult.success ? categoriesResult.data ?? [] : [];
  const reviews = reviewsResult.success ? reviewsResult.data : [];

  return (
    <TutorDetail
      tutor={tutor}
      categories={categories}
      reviews={reviews}
    />
  );
}
