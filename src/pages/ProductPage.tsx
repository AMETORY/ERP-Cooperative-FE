import { Tabs } from "flowbite-react";
import { useState, type FC } from "react";
import { BsListCheck } from "react-icons/bs";
import { IoPricetagOutline } from "react-icons/io5";
import { RiShoppingBagLine } from "react-icons/ri";
import AdminLayout from "../components/layouts/admin";
import ProductTable from "../components/ProductTable";
import ModalProduct from "../components/ModalProduct";
import { ProductModel } from "../models/product";
import ProductCategoryTable from "../components/ProductCategoryTable";
import PriceCategoryTable from "../components/PriceCategoryTable";

interface ProductPageProps {}

const ProductPage: FC<ProductPageProps> = ({}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [product, setProduct] = useState<ProductModel>();

  return (
    <AdminLayout>
      <div className="w-full h-full flex flex-col gap-4 px-8">
        <Tabs
          aria-label="Default tabs"
          variant="default"
          onActiveTabChange={(tab) => {
            setActiveTab(tab);
            // console.log(tab);
          }}
          className="mt-4"
        >
          <Tabs.Item
            active={activeTab === 0}
            title="Product"
            icon={RiShoppingBagLine}
          >
            <ProductTable />
          </Tabs.Item>
          <Tabs.Item
            active={activeTab === 1}
            title="Category"
            icon={BsListCheck}
          >
            <ProductCategoryTable />
          </Tabs.Item>
          <Tabs.Item
            active={activeTab === 2}
            title="Price Category"
            icon={IoPricetagOutline}
          >
            <PriceCategoryTable />
          </Tabs.Item>
          {/* <Tabs.Item active={activeTab === 3} title="Sales Quote" icon={PiQuotes}>
          </Tabs.Item> */}
        </Tabs>
      </div>

    </AdminLayout>
  );
};
export default ProductPage;
