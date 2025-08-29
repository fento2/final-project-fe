import { Card, CardContent } from "@/components/ui/card";

const DashboardUser = () => {
  return (
    <>
      <div className="w-full h-screen">
        <div>
          <div className="mx-14 p-4">
            <h3
              className="text-2xl font-bold text-indigo-500
            -tracking-wider"
            >
              Personal Data
            </h3>
            <span className="text-sm text-gray-600">
              Fill in the data according to your ID card.
            </span>
          </div>
          <Card className="mx-14">
            <CardContent></CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
export default DashboardUser;
