// MerchantDesk.tsx
import React, { useContext, useEffect, useState } from "react";
import { TableList } from "./TableList";
import { RestaurantTable, Table } from "../models/table";
import { TableGenerator } from "./TableGenerator";
import { MerchantLayoutModel, MerchantModel } from "../models/merchant";
import {
  Button,
  ButtonGroup,
  Label,
  Modal,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useTranslation } from "react-i18next";
import { LoadingContext } from "../contexts/LoadingContext";
import toast from "react-hot-toast";
import {
  addMerchantDesk,
  createLayout,
  deleteMerchant,
  deleteMerchantDesk,
  getLayoutDetail,
  getLayouts,
  getMerchantDesk,
  updateMerchantDesk,
} from "../services/api/merchantApi";
import { PiPencil } from "react-icons/pi";
import { generateUUID } from "../utils/helper";
import { RestaurantLayout } from "./RestaurantLayout";
import { LayoutEditor } from "./LayoutEditor";
import { tab } from "@testing-library/user-event/dist/tab";

interface MerchantDeskProps {
  merchant: MerchantModel;
}
const MerchantDesk: React.FC<MerchantDeskProps> = ({ merchant }) => {
  const { loading, setLoading } = useContext(LoadingContext);
  const { t } = useTranslation();
  const [modalTable, setModalTable] = useState(false);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalEdit, setModalEdit] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table>();
  const [modalLayout, setModalLayout] = useState(false);
  const [layouts, setLayouts] = useState<MerchantLayoutModel[]>([]);
  const [layoutName, setLayoutName] = useState("");
  const [layoutDesc, setLayoutDesc] = useState("");
  const [selectedLayout, setSelectedLayout] = useState<MerchantLayoutModel>();
  const [view, setView] = useState("table");
  const [updatedTable, setUpdatedTable] = useState<RestaurantTable[]>([]);
  const [modalAddTable, setModalAddTable] = useState(false);
  const [showLayout, setShowLayout] = useState(true);

  const [selectedTableIds, setSelectedTableIds] = useState<string[]>([]);
  useEffect(() => {
    if (merchant) {
      getAllTables();
      getAllLayouts();
    }
  }, [merchant]);

  const getAllTables = () => {
    getMerchantDesk(merchant.id!, { page: 1, size: 1000, search: "" }).then(
      (res: any) => {
        setTables(
          res.data.items.map((item: any) => ({
            id: item.id,
            number: item.desk_name,
            status: item.status.toLowerCase(),
            capacity: item.capacity,
            shape: item.shape,
            width: item.width,
            height: item.height,
            position: item.position,
            merchant_desk_layout_id: item.merchant_desk_layout_id,
          }))
        );
      }
    );
  };

  const renderLayoutGrid = () => (
    <div className="grid grid-cols-3 gap-4">
      {layouts.map((layout) => (
        <div
          key={layout.id}
          className="hover:bg-[#ffb6b9]  py-2 flex  flex-col gap-4  items-center cursor-pointer px-2 w-full  justify-center rounded-lg mb-2 last:mb-0 border border-gray-200 h-[120px] relative"
          onClick={() => {
            setSelectedLayout(layout);
            setView("editor");
          }}
        >
          <h3 className="font-semibold text-2xl">{layout.name}</h3>
          <p>{layout.description}</p>
        </div>
      ))}
    </div>
  );
  const renderTableGrid = () => (
    <div className="grid grid-cols-5 gap-4">
      {tables.map((table) => (
        <div
          className="hover:bg-[#ffb6b9]  py-2 flex  flex-col gap-2 items-center cursor-pointer px-2 w-full  justify-between rounded-lg mb-2 last:mb-0 border border-gray-200 h-[120px] relative"
          style={
            selectedIds.includes(table.id!)
              ? { backgroundColor: "#4c8aed" }
              : {}
          }
          key={table.id}
          onClick={() => {
            if (selectedIds.includes(table.id!)) {
              setSelectedIds(selectedIds.filter((id) => id !== table.id!));
            } else {
              setSelectedIds([...selectedIds, table.id!]);
            }
          }}
        >
          <span className="font-semibold text-2xl text-gray-700">
            {table.number}
          </span>
          <div className="flex items-center flex-col gap-1">
            <div>
              <span className={`table-view ${table.status} rounded-lg  px-4`}>
                {table.status === "available" && t("status_available")}
                {table.status === "occupied" && t("status_filled")}
                {table.status === "reserved" && t("status_reserved")}
              </span>
            </div>
            <span className=" text-sm text-gray-700">
              {t("capacity_alert", { capacity: table.capacity })}
            </span>
          </div>

          <button
            className="top-2 right-2 absolute"
            onClick={() => {
              setSelectedTable(table);
              setModalEdit(true);
            }}
          >
            <PiPencil />
          </button>
        </div>
      ))}
    </div>
  );

  const getAllLayouts = () => {
    getLayouts(merchant.id!, { page: 1, size: 1000, search: "" }).then(
      (res: any) => {
        setLayouts(res.data.items);
      }
    );
  };

  return (
    <div>
      <div className="flex justify-between mb-4 gap-4">
        <div className="flex gap-4">
          <ButtonGroup>
            <Button
              color={view === "table" ? undefined : "gray"}
              onClick={() => setView("table")}
              className=""
            >
              {t("desk")}
            </Button>
            <Button
              color={view === "layout" ? undefined : "gray"}
              onClick={() => setView("layout")}
              className=""
            >
              {t("layout")}
            </Button>
            <Button color={view === "editor" ? undefined : "gray"} className="">
              {t("editor")}
            </Button>
          </ButtonGroup>
        </div>
        {view == "layout" && (
          <Button onClick={() => setModalLayout(true)}>
            {t("create_layout")}
          </Button>
        )}
        {view == "table" && (
          <ButtonGroup>
            <Button onClick={() => setModalTable(true)}>
              {t("create_tables")}
            </Button>
            {selectedIds.length > 0 && (
              <Button
                className="bg-red-600 text-white"
                onClick={async () => {
                  try {
                    const confirmDelete = window.confirm(
                      t("confirm_delete", {
                        description: `${selectedIds.length} ${t("item")}`,
                      })
                    );
                    if (confirmDelete) {
                      setLoading(true);
                      for (const element of selectedIds) {
                        await deleteMerchantDesk(merchant!.id!, element);
                      }
                      getAllTables();
                    }
                  } catch (error) {
                    toast.error(`${error}`);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {t("delete")}
              </Button>
            )}
            {tables.length > 0 && (
              <Button
                color="red"
                onClick={() => {
                  if (selectedIds.length === tables.length) {
                    setSelectedIds([]);
                  } else {
                    setSelectedIds(tables.map((table) => table.id!));
                  }
                }}
              >
                {t("select_all")}
              </Button>
            )}
          </ButtonGroup>
        )}
        {view == "editor" && (
          <ButtonGroup>
            <Button
              onClick={() => {
                console.log(updatedTable);
              }}
            >
              {t("save")}
            </Button>
            <Button onClick={() => setModalAddTable(true)}>
              {t("add_table")}
            </Button>
          </ButtonGroup>
        )}
      </div>
      <div className=" h-[calc(100vh-340px)] overflow-y-auto">
        {view === "table" && renderTableGrid()}
        {view === "layout" && renderLayoutGrid()}
        {view === "editor" && selectedLayout && showLayout && (
          <LayoutEditor
            merchant={merchant}
            initialTables={(selectedLayout?.merchant_desks ?? []).map(
              (table) => ({
                id: table.id,
                number: table.desk_name,
                status: table.status.toLowerCase(),
                capacity: table.capacity,
                position: {
                  ...table!.position!,
                  x: table!.position?.x ?? 0,
                  y: table!.position?.y ?? 0,
                  rotation: table!.position?.rotation ?? 0,
                },
                shape: table.shape,
                width: table.width,
                height: table.height,
              })
            )}
            onSave={(tables: RestaurantTable[]) => {
              console.log(tables);
            }}
            onUpdate={(tables: RestaurantTable[]) => {
              setUpdatedTable(tables);
            }}
          />
        )}
      </div>

      <Modal
        size="1000px"
        show={modalTable}
        onClose={() => setModalTable(false)}
        className="merchant-modal"
      >
        <Modal.Body>
          <div className="merchant-settings ">
            <div className="settings-container">
              <div
                className="generator-section"
                style={{ height: "calc(100vh - 300px)", overflowY: "auto" }}
              >
                <TableGenerator
                  onTablesGenerated={(val) => {
                    setTables((prev) => [...prev, ...val]);
                  }}
                />
              </div>
              <div
                className="tables-section"
                style={{ height: "calc(100vh - 300px)", overflowY: "auto" }}
              >
                <TableList tables={tables} onTablesChange={setTables} />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end gap-2">
          <Button color="gray" onClick={() => setModalTable(false)}>
            Close
          </Button>
          <Button
            onClick={async () => {
              try {
                setModalTable(false);
                setLoading(true);
                for (let index = 0; index < tables.length; index++) {
                  const element = tables[index];

                  let data = {
                    id: element.id,
                    merchant_id: merchant!.id,
                    desk_name: element.number,
                    status: element.status.toUpperCase(),
                    order_number: index,
                    capacity: element.capacity,
                  };
                  await addMerchantDesk(merchant!.id!, data);
                }

                toast.success("Save successfully");
              } catch (error) {
                toast.error(`${error}`);
              } finally {
                setLoading(false);
              }
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={modalEdit} onClose={() => setModalEdit(false)}>
        <Modal.Header>Edit Table</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col space-y-4">
            <div>
              <Label htmlFor="number" value={t("number")} />
              <TextInput
                id="number"
                type="text"
                value={selectedTable?.number}
                onChange={(e) =>
                  setSelectedTable({
                    ...selectedTable!,
                    number: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="status" value={t("status")} />
              <Select
                id="status"
                value={selectedTable?.status}
                onChange={(e) =>
                  setSelectedTable({
                    ...selectedTable!,
                    status: e.target.value as
                      | "available"
                      | "occupied"
                      | "reserved",
                  })
                }
              >
                <option value="available">{t("status_available")}</option>
                <option value="occupied">{t("status_filled")}</option>
                <option value="reserved">{t("status_reserved")}</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="capacity" value={t("capacity")} />
              <TextInput
                id="capacity"
                type="number"
                min="1"
                max="20"
                value={selectedTable?.capacity}
                onChange={(e) =>
                  setSelectedTable({
                    ...selectedTable!,
                    capacity: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end gap-2">
          <Button color="gray" onClick={() => setModalEdit(false)}>
            {t("cancel")}
          </Button>
          <Button
            onClick={async () => {
              try {
                setLoading(true);
                await updateMerchantDesk(merchant!.id!, selectedTable!.id, {
                  merchant_id: merchant!.id,
                  desk_name: selectedTable?.number,
                  status: selectedTable?.status.toUpperCase(),
                  capacity: selectedTable?.capacity,
                });
                setModalEdit(false);
                setSelectedTable(undefined);
                toast.success(t("update_successful"));
                getAllTables();
              } catch (error) {
                toast.error(`${error}`);
              } finally {
                setLoading(false);
              }
            }}
          >
            {t("save")}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={modalLayout} onClose={() => setModalLayout(false)}>
        <Modal.Header>Layout</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col space-y-4">
            <div>
              <Label htmlFor="name" value={t("name")} />
              <TextInput
                id="name"
                value={layoutName}
                onChange={(e) => setLayoutName(e.target.value)}
                placeholder="Name"
              />
            </div>
            <div>
              <Label htmlFor="description" value={t("description")} />
              <Textarea
                id="description"
                value={layoutDesc}
                onChange={(e) => setLayoutDesc(e.target.value)}
                placeholder="Description"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end gap-2">
          <Button color="gray" onClick={() => setModalLayout(false)}>
            {t("cancel")}
          </Button>
          <Button
            onClick={() => {
              createLayout(merchant!.id!, {
                id: generateUUID(),
                name: layoutName,
                description: layoutDesc,
                merchant_id: merchant!.id,
              }).then(() => {
                setModalLayout(false);
                getAllLayouts();
                setLayoutName("");
                setLayoutDesc("");
              });
            }}
          >
            {t("save")}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={modalAddTable} onClose={() => setModalTable(false)}>
        <Modal.Header>Select Table</Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-3 gap-4">
            {tables
              .filter((e) => !e.merchant_desk_layout_id)
              .map((element) => (
                <div
                  className="flex flex-row items-center justify-center border rounded-lg p-2 hover:bg-red-200 cursor-pointer h-[100px]"
                  style={{
                    backgroundColor: selectedTableIds.includes(element.id!)
                      ? "#4c8aed"
                      : "",
                  }}
                  onClick={() => {
                    if (selectedTableIds.includes(element.id!)) {
                      setSelectedTableIds(
                        selectedTableIds.filter((id) => id !== element.id!)
                      );
                    } else {
                      setSelectedTableIds([...selectedTableIds, element.id!]);
                    }
                  }}
                >
                  <div className="">{element.number}</div>
                </div>
              ))}
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end gap-2">
          <Button color="gray" onClick={() => setModalAddTable(false)}>
            {t("cancel")}
          </Button>
          <Button
            onClick={async () => {
              setLoading(true);
              for (const element of selectedTableIds) {
                await updateMerchantDesk(merchant!.id!, element, {
                  merchant_desk_layout_id: selectedLayout!.id,
                });
              }
              setModalAddTable(false);
              setSelectedTableIds([]);
              getAllLayouts();
              getAllTables();
              getLayoutDetail(merchant.id!, selectedLayout!.id).then(
                (res: any) => {
                  setSelectedLayout(res.data);
                  setShowLayout(false)
                  setTimeout(() => {
                    setShowLayout(true);
                    setLoading(false);
                  }, 300);
                }
              );
            }}
          >
            {t("save")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default MerchantDesk;
