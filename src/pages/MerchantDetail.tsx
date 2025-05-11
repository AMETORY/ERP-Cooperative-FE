import type { FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { MerchantModel } from "../models/merchant";
import {
  getMerchantDetail,
  getMerchantProducts,
  getMerchants,
  updateMerchant,
} from "../services/api/merchantApi";
import { useTranslation } from "react-i18next";
import { Button, Label, Tabs, Textarea, TextInput } from "flowbite-react";
import { BsCamera, BsImage, BsInfoCircle } from "react-icons/bs";
import { uploadFile } from "../services/api/commonApi";
import toast from "react-hot-toast";
import MerchantProduct from "../components/MerchantProduct";
import { RiShoppingBagLine } from "react-icons/ri";
import { PaginationResponse } from "../objects/pagination";
import { getPagination } from "../utils/helper";

interface MerchantDetailProps {}

const MerchantDetail: FC<MerchantDetailProps> = ({}) => {
  const { t } = useTranslation();
  const [merchant, setMerchant] = useState<MerchantModel>();
  const { merchantId } = useParams();
  const [isEditable, setIsEditable] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    setMounted(true);
    return () => {};
  }, []);

  useEffect(() => {
    console.log(merchantId);
    if (mounted && merchantId) {
      getDetail();
    }
  }, [mounted, merchantId]);

  const getDetail = () => {
    getMerchantDetail(merchantId!).then((resp: any) => {
      setMerchant(resp.data);

    });
  };

 
  const renderInfo = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col space-y-4">
        <div>
          <Label>{t("name")}</Label>
          <TextInput
            value={merchant?.name}
            onChange={(e) =>
              setMerchant({
                ...merchant!,
                name: e.target.value,
              })
            }
          />
        </div>
        <div>
          <Label>{t("phone")}</Label>
          <TextInput
            value={merchant?.phone}
            onChange={(e) =>
              setMerchant({
                ...merchant!,
                phone: e.target.value,
              })
            }
          />
        </div>
        <div>
          <Label>{t("address")}</Label>
          <Textarea
            value={merchant?.address}
            onChange={(e) =>
              setMerchant({
                ...merchant!,
                address: e.target.value,
              })
            }
          />
        </div>
        <div>
          <Button
            onClick={() =>
              updateMerchant(merchant!.id!, merchant).then(() => {
                getDetail();
                toast.success(t("success"));
              })
            }
          >
            {t("save")}
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div
          className="flex justify-center items-center w-64 h-64  cursor-pointer border-gray-100 border-2 rounded-full bg-gray-50"
          onClick={() => fileRef.current?.click()}
        >
          {merchant?.picture?.url ? (
            <img
              className="w-64 h-64 aspect-square object-cover rounded-full"
              src={merchant.picture.url}
              alt="profile"
            />
          ) : (
            <BsImage />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <div>
          <h1 className="text-3xl text-gray-900 font-bold">{merchant?.name}</h1>
          <p>{merchant?.address}</p>
        </div>
        <Tabs aria-label="Default tabs" className="mt-4">
          <Tabs.Item title={t("basic_info")} icon={BsInfoCircle}>
            {renderInfo()}
          </Tabs.Item>
          <Tabs.Item title={t("products")} icon={RiShoppingBagLine}>
            <MerchantProduct merchant={merchant} />
          </Tabs.Item>
        </Tabs>
      </div>
      <input
        type="file"
        className="hidden"
        accept="image/*"
        name=""
        ref={fileRef}
        onChange={(val) => {
          if (val.target.files) {
            uploadFile(val.target.files[0], {}, (val) => console.log).then(
              (v: any) => {
                updateMerchant(merchantId!, {
                  ...merchant!,
                  picture: v.data,
                }).then(getDetail);
              }
            );
          }
        }}
      />
    </AdminLayout>
  );
};
export default MerchantDetail;
