// Import necessary modules
import WorkCardDetail from "@/components/work/detail/workCardDetail";
import { fetchWorkData } from "@/lib/fetchWorkData";
import { fetchWorkDataById } from "@/lib/fetchWorkDataById";

// Define the generateStaticParams function
export async function generateStaticParams() {
  const data = await fetchWorkData();

  return data.data;
}

// Export the default function for the Server Component
export default async function WorkDetailPage(params) {
  let data = [];
  let error = null;

  const id = params.params.id;

  try {
    data = await fetchWorkDataById(id);
  } catch (err) {
    error = err.message;
  }
  return (

    <div className="">
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        <WorkCardDetail data={data.data} />
      </div>

);
  // Your component implementation...
}
