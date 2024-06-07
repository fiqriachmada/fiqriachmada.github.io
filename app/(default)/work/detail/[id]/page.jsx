// Import necessary modules
import WorkCardDetail from "@/components/work/detail/workCardDetail";
import { fetchWorkData } from "@/lib/fetchWorkData";
import { fetchWorkDataById } from "@/lib/fetchWorkDataById";

// Define the generateStaticParams function
export async function generateStaticParams() {
  // Fetch work data to determine dynamic paths
  const data = await fetchWorkData();
  console.log("data", data);
  return data.data;

  // Generate static paths based on the fetched data
  // const paths = data.map((workItem) => ({
  //   params: { id: workItem.id.toString() },
  // }));

  // // Return the generated static paths
  // return {
  //   paths,
  //   fallback: false,
  // };
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
    <>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <div className="grid grid-cols-1 gap-10">
        <WorkCardDetail data={data.data} />
      </div>
    </>
  );
  // Your component implementation...
}
