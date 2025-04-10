import type { FC } from "react";
import AdminLayout from "../components/layouts/admin";

interface ClosingBookProps {}

const ClosingBook: FC<ClosingBookProps> = ({}) => {
  return (
    <AdminLayout>
      <div className="container">
        <h1>Closing Book</h1>
      </div>
    </AdminLayout>
  );
};
export default ClosingBook;
