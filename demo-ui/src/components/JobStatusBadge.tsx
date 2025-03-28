import { ScrapeJobStatus } from "@/graphql/graphql";
import { Badge } from "./ui/badge";

const getStatusColor = (status: ScrapeJobStatus) => {
  switch (status) {
    case ScrapeJobStatus.Done:
      return "bg-green-500";
    case ScrapeJobStatus.Running:
      return "bg-blue-500";
    case ScrapeJobStatus.Pending:
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

export const JobStatusBadge = ({ status }: { status: ScrapeJobStatus }) => {
  return (
    <Badge className={`${getStatusColor(status)} text-white capitalize`}>
      {status}
    </Badge>
  );
};
