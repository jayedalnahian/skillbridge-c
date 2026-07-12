import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

const CARD_COUNT = 8;

export default function AllTutorsLoading() {
  return (

   <div className="h-screen w-screen flex items-center justify-center">
     <Spinner className="h-20 w-20" />

   </div>
       
  );
}

