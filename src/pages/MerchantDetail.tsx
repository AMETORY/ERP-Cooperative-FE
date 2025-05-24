import { Button, Label, Tabs, Textarea, TextInput } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { BsImage, BsInfoCircle, BsPeople } from "react-icons/bs";
import { RiShoppingBagLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import Select from "react-select";
import AdminLayout from "../components/layouts/admin";
import MerchantProduct from "../components/MerchantProduct";
import MechantUser from "../components/MerchantUser";
import { MerchantModel } from "../models/merchant";
import { WarehouseModel } from "../models/warehouse";
import { uploadFile } from "../services/api/commonApi";
import { getMerchantDetail, updateMerchant } from "../services/api/merchantApi";
import { getWarehouses } from "../services/api/warehouseApi";
import { getSectors } from "../services/api/companyApi";
import {
  getDistricts,
  getProvinces,
  getRegencies,
  getVillages,
} from "../services/api/regionalApi";
import { WorkflowBuilder } from "../components/WorkflowStepBuilder";
import { GoWorkflow } from "react-icons/go";
import { MenuBuilder } from "../components/MenuBuilder";
import { HiOutlineMenu } from "react-icons/hi";
import MerchantDesk from "../components/MerchantDesk";
import { PriceCategoryModel } from "../models/price_category";
import { getPriceCategories } from "../services/api/priceCategoryApi";
import { FaMartiniGlass } from "react-icons/fa6";
import MerchantStation from "../components/MerchantStation";
import { TbGlass } from "react-icons/tb";
import { PiPlug } from "react-icons/pi";
import MerchantIntegration from "../components/MerchantIntegration";

interface MerchantDetailProps {}

const MerchantDetail: FC<MerchantDetailProps> = ({}) => {
  const { t } = useTranslation();
  const [merchant, setMerchant] = useState<MerchantModel>();
  const { merchantId } = useParams();
  const [isEditable, setIsEditable] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [warehouses, setWarehouses] = useState<WarehouseModel[]>([]);
  const [priceCategories, setPriceCategories] = useState<PriceCategoryModel[]>([]);
  const [provinces, setProvinces] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedProvince, setSelectedProvince] = useState<{
    label: string;
    value: string;
  }>();
  const [regencies, setRegencies] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedRegency, setSelectedRegency] = useState<{
    label: string;
    value: string;
  }>();
  const [districts, setDistricts] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedDistrict, setSelectedDistrict] = useState<{
    label: string;
    value: string;
  }>();
  const [villages, setVillages] = useState<{ label: string; value: string }[]>(
    []
  );
  const [selectedVillage, setSelectedVillage] = useState<{
    label: string;
    value: string;
  }>();

  const [zipCode, setZipCode] = useState("");
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      getProvinces().then((resp: any) => {
        setProvinces(
          resp.data.map((p: any) => ({ label: p.name, value: p.id }))
        );
      });
    }
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
    return () => {};
  }, []);

  useEffect(() => {
    console.log(merchantId);
    if (mounted && merchantId) {
      getDetail();
      getWarehouses({ page: 1, size: 10 }).then((res: any) =>
        setWarehouses(res.data.items)
      );
      getPriceCategories({ page: 1, size: 10 }).then((res: any) =>
        setPriceCategories(res.data.items)
      );
    }
  }, [mounted, merchantId]);

  const getDetail = () => {
    getMerchantDetail(merchantId!).then((resp: any) => {
      setMerchant(resp.data);
      setZipCode(resp.data.zip_code);
      if (resp.data.province_id) {
        getProvinces().then((res: any) => {
          let selected = res.data.find(
            (p: any) => p.id == resp.data.province_id
          );
          setSelectedProvince({
            label: selected.name,
            value: selected.id,
          });
        });
      }

      if (resp.data.regency_id) {
        getRegencies(resp.data.province_id).then((res: any) => {
          let selected = res.data.find(
            (p: any) => p.id == resp.data.regency_id
          );
          setSelectedRegency({
            value: selected.id,
            label: selected.name,
          });
        });
      }

      if (resp.data.district_id) {
        getDistricts(resp.data.regency_id).then((res: any) => {
          let selected = res.data.find(
            (p: any) => p.id == resp.data.district_id
          );
          setSelectedDistrict({
            value: selected.id,
            label: selected.name,
          });
        });
      }
      if (resp.data.village_id) {
        getVillages(resp.data.district_id).then((res: any) => {
          let selected = res.data.find(
            (p: any) => p.id == resp.data.village_id
          );
          setSelectedVillage({
            value: selected.id,
            label: selected.name,
          });
        });
      }
    });
  };

  const renderInfo = () => (
    <div className="grid grid-cols-2 gap-4 h-[calc(100vh-280px)] overflow-y-auto">
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
          <Label>{t("warehouse")}</Label>
          <Select
            options={warehouses.map((w) => ({ value: w.id, label: w.name }))}
            value={{
              value: merchant?.default_warehouse_id,
              label: merchant?.default_warehouse?.name,
            }}
            onChange={(e) =>
              setMerchant({
                ...merchant!,
                default_warehouse_id: e!.value!,
                default_warehouse: warehouses.find((w) => w.id === e!.value),
              })
            }
          />
        </div>
        <div>
          <Label>{t("price_categories")}</Label>
          <Select
            options={priceCategories.map((w) => ({ value: w.id, label: w.name }))}
            value={{
              value: merchant?.default_price_category_id,
              label: merchant?.default_price_category?.name,
            }}
            onChange={(e) =>
              setMerchant({
                ...merchant!,
                default_price_category_id: e!.value!,
                default_price_category: priceCategories.find((w) => w.id === e!.value),
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="province">Province</Label>
          <Select
            required
            options={provinces}
            value={selectedProvince}
            onChange={(option) => {
              setSelectedProvince(option!);
              getRegencies(option!.value).then((resp: any) => {
                setRegencies(
                  resp.data.map((s: any) => ({
                    value: s.id,
                    label: s.name,
                  }))
                );
              });
            }}
          />
        </div>
        <div>
          <Label htmlFor="regency">Regency</Label>
          <Select
            required
            options={regencies}
            value={selectedRegency}
            onChange={(option) => {
              setSelectedRegency(option!);
              getDistricts(option!.value).then((resp: any) => {
                setDistricts(
                  resp.data.map((s: any) => ({
                    value: s.id,
                    label: s.name,
                  }))
                );
              });
            }}
          />
        </div>
        <div>
          <Label htmlFor="district">District</Label>
          <Select
            required
            options={districts}
            value={selectedDistrict}
            onChange={(option) => {
              setSelectedDistrict(option!);
              getVillages(option!.value).then((resp: any) => {
                setVillages(
                  resp.data.map((s: any) => ({
                    value: s.id,
                    label: s.name,
                  }))
                );
              });
            }}
          />
        </div>
        <div>
          <Label htmlFor="village">Village</Label>
          <Select
            required
            options={villages}
            value={selectedVillage}
            onChange={(option) => {
              setSelectedVillage(option!);
            }}
          />
        </div>
        <div>
          <Label htmlFor="zip_code">Zip Code</Label>
          <TextInput
            id="zip_code"
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder={"Zip Code"}
            className="mt-1"
          />
        </div>
        <div>
          <Button
            onClick={() =>
              updateMerchant(merchant!.id!, {
                ...merchant!,
                province_id: selectedProvince?.value,
                regency_id: selectedRegency?.value,
                district_id: selectedDistrict?.value,
                village_id: selectedVillage?.value,
                zip_code: zipCode,
              }).then(() => {
                getDetail();
                toast.success(t("success"));
              })
            }
          >
            {t("save")}
          </Button>
        </div>
      </div>
      <div className="flex  justify-center">
        <div
          className="flex justify-center items-center w-64 h-64  cursor-pointer border-gray-100 border-2 rounded-full bg-gray-50 my-16"
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
          <Tabs.Item title={t("users")} icon={BsPeople}>
            <MechantUser merchant={merchant} />
          </Tabs.Item>
          <Tabs.Item title={t("workflow")} icon={GoWorkflow}>
            {merchant && <WorkflowBuilder merchant={merchant!} />}
          </Tabs.Item>
          <Tabs.Item title={t("menu")} icon={HiOutlineMenu}>
            {merchant && <MenuBuilder merchant={merchant!} />}
          </Tabs.Item>
          <Tabs.Item
            title={
              <div className="flex gap-2">
                <img className="w-6" src="/picnic-table.png" alt="" />
                <span> {t("desk")} </span>
              </div>
            }
          >
            {merchant && <MerchantDesk merchant={merchant!} />}
          </Tabs.Item>
          <Tabs.Item title={t("station")} icon={TbGlass}>
            {merchant && <MerchantStation merchant={merchant!} />}
          </Tabs.Item>
          <Tabs.Item title={t("integration")} icon={PiPlug}>
            {merchant && <MerchantIntegration merchant={merchant!} setMerchant={setMerchant} onUpdate={getDetail} />}
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
