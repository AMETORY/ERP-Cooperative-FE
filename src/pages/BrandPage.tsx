import { Button, Label, Modal, Table, TextInput } from "flowbite-react";
import { useContext, useEffect, useState, type FC } from "react";
import toast from "react-hot-toast";
import { LuFilter } from "react-icons/lu";
import AdminLayout from "../components/layouts/admin";
import { LoadingContext } from "../contexts/LoadingContext";
import { SearchContext } from "../contexts/SearchContext";
import { BrandModel } from "../models/brand";
import { PaginationResponse } from "../objects/pagination";
import {
  createBrand,
  deleteBrand,
  getBrands,
  updateBrand,
} from "../services/api/brandApi";
import { getPagination, money } from "../utils/helper";
import { AccountModel } from "../models/account";
import { getAccountDetail, getAccounts } from "../services/api/accountApi";
import Select, { InputActionMeta } from "react-select";
import { BsPercent } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface BrandPageProps {}

const BrandPage: FC<BrandPageProps> = ({}) => {
  const { t } = useTranslation();
  const { search, setSearch } = useContext(SearchContext);
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);
  const [brands, setBrands] = useState<BrandModel[]>([]);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(20);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const [brand, setBrand] = useState<BrandModel | null>(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState(0);
  const [payableAccounts, setPayableAccounts] = useState<AccountModel[]>([]);
  const [receibleAccounts, setReceivableAccounts] = useState<AccountModel[]>(
    []
  );
  const [selectedPayable, setSelectedPayable] = useState<AccountModel | null>(
    null
  );
  const [selectedReceivable, setSelectedReceivable] =
    useState<AccountModel | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      getAllBrands();
    }
  }, [mounted, page, size, search]);

  const getAllBrands = () => {
    setLoading(true);
    getBrands({ page, size, search })
      .then((e: any) => {
        setBrands(e.data.items);
        setPagination(getPagination(e.data));
      })
      .catch((error) => {
        toast.error(`${error}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <AdminLayout>
      <div className="p-8 ">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold ">{t("brand")}</h1>
          <div className="flex items-center gap-2">
            <Button
              gradientDuoTone="purpleToBlue"
              pill
              onClick={() => {
                setShowModal(true);
              }}
            >
              + {t("new_brand")}
            </Button>
            <LuFilter
              className=" cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowFilter(true);
              }}
            />
          </div>
        </div>
        <div className="h-[calc(100vh-200px)] overflow-y-auto">
          <Table>
            <Table.Head>
              <Table.HeadCell>{t("name")}</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {brands.map((brand) => (
                <Table.Row
                  key={brand.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>{brand.name}</Table.Cell>

                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <button
                        className="font-medium text-blue-600 hover:underline dark:text-blue-500 ms-2"
                        onClick={() => {
                          setBrand(brand);
                          setShowModal(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="font-medium text-red-600 hover:underline dark:text-red-500 ms-2"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this brand?"
                            )
                          ) {
                            deleteBrand(brand.id!).then(() => getAllBrands());
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header> {t("brand")}</Modal.Header>
        <Modal.Body>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                setLoading(true);
                let data = {
                  name: name,
                  code: code,
                  amount: amount,
                  account_payable_id: selectedPayable?.id,
                  account_receivable_id: selectedReceivable?.id,
                };
                if (brand) {
                  await updateBrand(brand.id!, data);
                } else {
                  await createBrand(data);
                }
                toast.success("Brand created successfully");
                setShowModal(false);
                setName("");
                setCode("");
                setAmount(0);
                setSelectedPayable(null);
                setSelectedReceivable(null);
                setShowModal(false);
                setBrand(null);
                getAllBrands();
              } catch (error) {
                toast.error(`${error}`);
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="flex flex-col space-y-4">
              <div>
                <Label htmlFor="brand-title" value={t("name")} />
                <TextInput
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  id="brand-title"
                  placeholder={t("brandName")}
                  required
                />
              </div>
              <div>
                <Label htmlFor="brand-code" value={t("code")} />
                <TextInput
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                  }}
                  id="brand-code"
                  placeholder={t("brandCode")}
                  required
                />
              </div>
            
            </div>
            <div className="mt-8 flex justify-end">
              <Button type="submit" onClick={() => {}}>
                {brand ? t("update") : t("save")}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </AdminLayout>
  );
};
export default BrandPage;
