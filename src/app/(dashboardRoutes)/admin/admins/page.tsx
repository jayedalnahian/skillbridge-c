import AdminTable from "@/components/modules/dashboard/admin/admins/AdminTable";
import { QUERY_KEYS } from "@/lib/constants";
import { getAllAdmins } from "@/services/admin.service";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const AdminAdminsPage = async ({
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
    queryKey: [QUERY_KEYS.ADMINS, queryString],
    queryFn: () => getAllAdmins(queryString),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  });
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AdminTable initialQueryString={queryString} />
      </HydrationBoundary>
    </>
  );
};

export default AdminAdminsPage;
