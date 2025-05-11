import { Button, Pagination, Table } from "flowbite-react";
import { useContext, useEffect, useState, type FC } from "react";
import { LuFilter } from "react-icons/lu";
import { LoadingContext } from "../contexts/LoadingContext";
import { SearchContext } from "../contexts/SearchContext";
import { MerchantModel } from "../models/merchant";
import { PaginationResponse } from "../objects/pagination";
import { deleteMerchant, getMerchants } from "../services/api/merchantApi";
import { getPagination } from "../utils/helper";
import ModalMerchant from "./ModalMerchant";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

interface MerchantTableProps {}

const MerchantTable: FC<MerchantTableProps> = ({}) => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);
  const { search, setSearch } = useContext(SearchContext);
  const [merchants, setMerchants] = useState<MerchantModel[]>([]);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(20);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const [merchant, setMerchant] = useState<MerchantModel>();
  const nav = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted) {
      getAllCategories();
    }
  }, [mounted, page, size, search]);

  const getAllCategories = () => {
    getMerchants({ page, size, search }).then((res: any) => {
      setMerchants(res.data.items);
      setPagination(getPagination(res.data));
    });
  };
  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold ">{t('merchant')}</h1>
        <div className="flex items-center gap-2">
          <Button
            gradientDuoTone="purpleToBlue"
            pill
            onClick={() => {
              setMerchant({
                name: "",
                address: "",
                phone: "",

              });
              setShowModal(true);
            }}
          >
            + Merchant
          </Button>
          <LuFilter
            className=" cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => {}}
          />
        </div>
      </div>
      <div className="h-[calc(100vh-300px)] overflow-y-auto">
        <Table hoverable className=" ">
          <Table.Head>
            <Table.HeadCell>{t('code')}</Table.HeadCell>
            <Table.HeadCell>{t('name')}</Table.HeadCell>
            <Table.HeadCell>{t('description')}</Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {merchants.length === 0 && (
              <Table.Row>
                <Table.Cell colSpan={5} className="text-center">
                  No data found.
                </Table.Cell>
              </Table.Row>
            )}
            {merchants.map((merchant) => (
              <Table.Row key={merchant.id}>
                <Table.Cell>{merchant.name}</Table.Cell>
                <Table.Cell>{merchant.address}</Table.Cell>
                <Table.Cell>{merchant.phone}</Table.Cell>
                <Table.Cell>
                  {merchant.company_id && (
                    <a
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                      onClick={() => {
                      nav(`/merchant/${merchant.id}`);
                      }}
                    >
                      View
                    </a>
                  )}
                  {merchant.company_id && (
                    <a
                      className="font-medium text-red-600 hover:underline dark:text-red-500 ms-2 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          window.confirm(
                            `Are you sure you want to delete  ${merchant.name}?`
                          )
                        ) {
                          deleteMerchant(merchant?.id!).then(() => {
                            getAllCategories();
                          });
                        }
                      }}
                    >
                      Delete
                    </a>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <Pagination
        className="mt-4"
        currentPage={page}
        totalPages={pagination?.total_pages ?? 0}
        onPageChange={(val) => {
          setPage(val);
        }}
        showIcons
      />
      {merchant && (
        <ModalMerchant
          show={showModal}
          setShow={setShowModal}
          onCreate={getAllCategories}
          merchant={merchant!}
          setMerchant={setMerchant}
        />
      )}
    </div>
  );
};
export default MerchantTable;
