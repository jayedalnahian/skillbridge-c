import StudentTable from "@/components/modules/dashboard/admin/students/StudentTable";
import { QUERY_KEYS } from "@/lib/constants";
import { getAllStudents } from "@/services/student.service";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const StudentsPage = async ({
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
    queryKey: [QUERY_KEYS.STUDENTS, queryString],
    queryFn: () => getAllStudents(queryString),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  });
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <StudentTable initialQueryString={queryString} />
      </HydrationBoundary>
    </>
  );
};

export default StudentsPage;
