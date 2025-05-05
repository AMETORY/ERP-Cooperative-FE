import { Button, Pagination, Table } from "flowbite-react";
import { useContext, useEffect, useState, type FC } from "react";
import { LuFilter } from "react-icons/lu";
import { LoadingContext } from "../contexts/LoadingContext";
import { SearchContext } from "../contexts/SearchContext";
import { UnitModel } from "../models/unit";
import { PaginationResponse } from "../objects/pagination";
import { deleteUnit, getUnits } from "../services/api/unitApi";
import { getPagination } from "../utils/helper";
import ModalUnit from "./ModalUnit";
import { useTranslation } from 'react-i18next';

interface UnitTableProps {}

const UnitTable: FC<UnitTableProps> = ({}) => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);
  const { search, setSearch } = useContext(SearchContext);
  const [units, setUnits] = useState<UnitModel[]>([]);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(20);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const [unit, setUnit] = useState<UnitModel>();

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted) {
      getAllCategories();
    }
  }, [mounted, page, size, search]);

  const getAllCategories = () => {
    getUnits({ page, size, search }).then((res: any) => {
      setUnits(res.data.items);
      setPagination(getPagination(res.data));
    });
  };
  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold ">{t('product_unit')}</h1>
        <div className="flex items-center gap-2">
          <Button
            gradientDuoTone="purpleToBlue"
            pill
            onClick={() => {
              setUnit({
                name: "",
                description: "",
                code: "",
              });
              setShowModal(true);
            }}
          >
            + Unit
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
            {units.length === 0 && (
              <Table.Row>
                <Table.Cell colSpan={5} className="text-center">
                  No data found.
                </Table.Cell>
              </Table.Row>
            )}
            {units.map((unit) => (
              <Table.Row key={unit.id}>
                <Table.Cell>{unit.code}</Table.Cell>
                <Table.Cell>{unit.name}</Table.Cell>
                <Table.Cell>{unit.description}</Table.Cell>
                <Table.Cell>
                  {unit.company_id && (
                    <a
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                      onClick={() => {
                        setUnit(unit);
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </a>
                  )}
                  {unit.company_id && (
                    <a
                      className="font-medium text-red-600 hover:underline dark:text-red-500 ms-2 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          window.confirm(
                            `Are you sure you want to delete  ${unit.name}?`
                          )
                        ) {
                          deleteUnit(unit?.id!).then(() => {
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
      {unit && (
        <ModalUnit
          show={showModal}
          setShow={setShowModal}
          onCreate={getAllCategories}
          unit={unit!}
          setUnit={setUnit}
        />
      )}
    </div>
  );
};
export default UnitTable;
