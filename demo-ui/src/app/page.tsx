import { CreateJobForm } from "@/components/CreateJobForm";
import { JobsList } from "@/components/JobsList";

export default function Home() {
  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold text-center mb-8">Scraper Dashboard</h1>
      <CreateJobForm />
      <JobsList />
    </main>
  );
}
