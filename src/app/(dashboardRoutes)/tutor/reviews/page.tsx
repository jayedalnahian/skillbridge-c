import ReviewTable from "@/components/modules/dashboard/tutor/reviews/ReviewTable";
import { getAllReviews } from "@/services/review.service";
import { CACHE_DURATIONS, QUERY_KEYS } from "@/lib/constants";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const TutorReviewsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const queryParamsObjects = await searchParams;

  const queryString = Object.keys(queryParamsObjects)
    .map((key) => {
      const value = queryParamsObjects[key];

      if (value === undefined) {
        return "";
      }

      if (Array.isArray(value)) {
        return value
          .map(
            (item) => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`,
          )
          .join("&");
      }

      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .filter(Boolean)
    .join("&");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.REVIEWS, queryString],
    queryFn: () => getAllReviews(queryString),
    staleTime: CACHE_DURATIONS.ONE_HOUR,
    gcTime: CACHE_DURATIONS.SIX_HOURS,
  });

  return (
    <div className="p-6">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ReviewTable initialQueryString={queryString} />
      </HydrationBoundary>
    </div>
  );
};

export default TutorReviewsPage;
