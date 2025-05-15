import { Tabs } from "flowbite-react";
import { useState, type FC } from "react";
import { useTranslation } from 'react-i18next';
import { BsListCheck } from "react-icons/bs";
import { IoPricetagOutline } from "react-icons/io5";
import { PiDotsNine } from "react-icons/pi";
import { RiShoppingBagLine } from "react-icons/ri";
import { TbBrandDatabricks, TbRulerMeasure } from "react-icons/tb";
import AdminLayout from "../components/layouts/admin";
import PriceCategoryTable from "../components/PriceCategoryTable";
import ProductAttributeTable from "../components/ProductAttributeTable";
import ProductCategoryTable from "../components/ProductCategoryTable";
import ProductTable from "../components/ProductTable";
import UnitTable from "../components/UnitTable";
import { ProductModel } from "../models/product";
import BrandTable from "../components/BrandTable";

interface ProductPageProps {}

const ProductPage: FC<ProductPageProps> = ({}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [product, setProduct] = useState<ProductModel>();

  return (
    <AdminLayout>
      <div className="w-full flex flex-col gap-4 px-8">
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
            title={t("products") }
            icon={RiShoppingBagLine}
          >
            <ProductTable />
          </Tabs.Item>
          <Tabs.Item
            active={activeTab === 1}
            title=  {t("product_categories")}
            icon={BsListCheck}
          >
            <ProductCategoryTable />
          </Tabs.Item>
          <Tabs.Item
            active={activeTab === 2}
            title=  {t("brands")}
            icon={TbBrandDatabricks}
          >
            <BrandTable />
          </Tabs.Item>
          <Tabs.Item
            active={activeTab === 3}
            title={t("price_categories")}
            icon={IoPricetagOutline}
          >
            <PriceCategoryTable />
          </Tabs.Item>
          <Tabs.Item active={activeTab === 4} title={t("product_attributes")} icon={PiDotsNine}>
            <ProductAttributeTable />
          </Tabs.Item>
          <Tabs.Item active={activeTab === 5} title={t("units")} icon={TbRulerMeasure}>
            <UnitTable />
          </Tabs.Item>
        </Tabs>
      </div>

    </AdminLayout>
  );
};
export default ProductPage;
