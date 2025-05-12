// MenuBuilder.tsx
import React, { useEffect, useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { MenuItem, MenuCategory } from "../models/menu_item";
import { MenuCategoryList } from "./MenuCategoryList";
import {
  SortableCategory,
  SortableMenuItem,
  SortableSubCategory,
} from "./SortableCategory";
import { BsImage, BsPlus } from "react-icons/bs";
import { MerchantModel } from "../models/merchant";
import { Modal, TextInput } from "flowbite-react";
import { generateUUID } from "../utils/helper";
import { ProductModel } from "../models/product";
import { getMerchantProducts, updateMerchant } from "../services/api/merchantApi";
import toast from "react-hot-toast";

interface MenuBuilderProps {
  merchant: MerchantModel;
}
export const MenuBuilder: React.FC<MenuBuilderProps> = ({ merchant }) => {
  const [menuCategories, setMenuCategories] = useState<MenuCategory>([]);
  const [merchantProducts, setMerchantProducts] = useState<ProductModel[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(
    null
  );
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [modalCategory, setModalCategory] = useState(false);
  const [modalSubCategory, setModalSubCategory] = useState(false);
  const [modalProduct, setModalProduct] = useState(false);
  const [categoryId, setCategoryId] = useState();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

  

    const findCategoryAndIndex = (categories: MenuCategory, itemId: string) => {
      for (let i = 0; i < categories.length; i++) {
        // Check main categories
        if (categories[i].id === itemId) {
          return { category: categories, index: i };
        }

        // Check subcategories
        if (categories[i].children) {
          for (let j = 0; j < categories[i].children!.length; j++) {
            if (categories[i].children![j].id === itemId) {
              return { category: categories[i].children!, index: j };
            }

            // Check menu items
            if (categories[i].children![j].children) {
              for (
                let k = 0;
                k < categories[i].children![j].children!.length;
                k++
              ) {
                if (categories[i].children![j].children![k].id === itemId) {
                  return {
                    category: categories[i].children![j].children!,
                    index: k,
                  };
                }
              }
            }
          }
        }
      }
      return null;
    };

    const activeItem = findCategoryAndIndex(
      menuCategories,
      active.id.toString()
    );
    const overItem = findCategoryAndIndex(menuCategories, over.id.toString());

    if (activeItem && overItem && activeItem.category === overItem.category) {
      setMenuCategories((prevCategories) => {
        const newCategories = JSON.parse(JSON.stringify(prevCategories));
        const found = findCategoryAndIndex(newCategories, active.id.toString());

        if (found) {
          const { category, index } = found;
          const overIndex = category.findIndex((item) => item.id === over.id);
          category.splice(overIndex, 0, category.splice(index, 1)[0]);
        }

        return newCategories;
      });
    }
  };

  const addNewCategory = (name: string) => {
    const newCategory: MenuItem = {
      id: generateUUID(),
      name: name,
      children: [],
    };
    setMenuCategories([...menuCategories, newCategory]);
  };

  const addNewSubCategory = (parentId: string, name: string) => {
    setMenuCategories((prevCategories) =>
      prevCategories.map((category) => {
        if (category.id === parentId) {
          return {
            ...category,
            children: [
              ...(category.children || []),
              {
                id: generateUUID(),
                name: name,
                children: [],
              },
            ],
          };
        }
        return category;
      })
    );
  };

  useEffect(() => {
    if (merchant) {
      getAllProductMerchants();
    //   console.log(merchant)
      setMenuCategories(merchant.menu);
    }
  }, [merchant]);

  const getAllProductMerchants = async () => {
    getMerchantProducts(merchant.id!, {
      page: 1,
      size: 1000,
      search: "",
    }).then((resp: any) => {
      setMerchantProducts(resp.data.items);
    });
  };

  const addNewMenuItem = (parentId: string, product: ProductModel) => {
    setMenuCategories((prevCategories) =>
      prevCategories.map((category) => {
        if (category.id === parentId) {
          return category;
        }

        if (category.children) {
          const updatedChildren = category.children.map((subCategory) => {
            if (subCategory.id === parentId) {
              return {
                ...subCategory,
                children: [
                  ...(subCategory.children || []),
                  {
                    id: generateUUID(),
                    name: product.display_name || product.name,
                    product,
                  },
                ],
              };
            }
            return subCategory;
          });

          return { ...category, children: updatedChildren };
        }

        return category;
      })
    );
  };

  const deleteItem = (id: string) => {
    setMenuCategories((prevCategories) =>
      deleteItemRecursive(prevCategories, id)
    );
  };

  const deleteItemRecursive = (
    items: MenuCategory,
    id: string
  ): MenuCategory => {
    return items
      .filter((item) => item.id !== id)
      .map((item) => {
        if (item.children) {
          return {
            ...item,
            children: deleteItemRecursive(item.children, id),
          };
        }
        return item;
      });
  };

  return (
    <div>
      <div className="menu-builder h-[calc(100vh-320px)] overflow-y-auto">
        <DndContext
          modifiers={[restrictToVerticalAxis]}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="menu-container">
            {/* Kategori Utama */}
            <div className="categories-section">
              <div className="section-header">
                <h3>Kategori Menu</h3>
                <button
                  onClick={() => setModalCategory(true)}
                  className="add-button"
                >
                  <BsPlus size={14} /> Tambah
                </button>
              </div>

              <SortableContext
                items={menuCategories}
                strategy={verticalListSortingStrategy}
              >
                <div className="categories-list">
                  {menuCategories.map((category) => (
                    <SortableCategory
                      key={category.id}
                      item={category}
                      isActive={activeCategory === category.id}
                      onSelect={() =>
                        setActiveCategory(
                          activeCategory === category.id ? null : category.id
                        )
                      }
                      onDelete={deleteItem}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>

            {/* Subkategori */}
            {activeCategory && (
              <div className="subcategories-section">
                <div className="section-header">
                  <h3>Subkategori</h3>
                  {menuCategories.find((c) => c.id === activeCategory)
                    ?.children && (
                    <button
                      onClick={() => setModalSubCategory(true)}
                      className="add-button"
                    >
                      <BsPlus size={14} /> Tambah
                    </button>
                  )}
                </div>

                {menuCategories.find((c) => c.id === activeCategory)
                  ?.children && (
                  <SortableContext
                    items={
                      menuCategories.find((c) => c.id === activeCategory)!
                        .children!
                    }
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="subcategories-list">
                      {menuCategories
                        .find((c) => c.id === activeCategory)!
                        .children!.map((subCategory) => (
                          <SortableSubCategory
                            key={subCategory.id}
                            item={subCategory}
                            isActive={activeSubCategory === subCategory.id}
                            onSelect={() =>
                              setActiveSubCategory(
                                activeSubCategory === subCategory.id
                                  ? null
                                  : subCategory.id
                              )
                            }
                            onDelete={deleteItem}
                          />
                        ))}
                    </div>
                  </SortableContext>
                )}
              </div>
            )}

            {/* Menu Items */}
            {(activeSubCategory ||
              (activeCategory &&
                !menuCategories.find((c) => c.id === activeCategory)
                  ?.children)) && (
              <div className="items-section">
                <div className="section-header">
                  <h3>Daftar Menu</h3>
                  <button
                    onClick={() => setModalProduct(true)}
                    className="add-button"
                  >
                    <BsPlus size={14} /> Tambah
                  </button>
                </div>

                {((activeSubCategory &&
                  menuCategories
                    .find((c) => c.id === activeCategory)!
                    .children!.find((sc) => sc.id === activeSubCategory)
                    ?.children) ||
                  (activeCategory &&
                    !menuCategories.find((c) => c.id === activeCategory)
                      ?.children &&
                    menuCategories.find((c) => c.id === activeCategory)
                      ?.children)) && (
                  <SortableContext
                    items={
                      activeSubCategory
                        ? menuCategories
                            .find((c) => c.id === activeCategory)!
                            .children!.find(
                              (sc) => sc.id === activeSubCategory
                            )!.children!
                        : menuCategories.find((c) => c.id === activeCategory)!
                            .children!
                    }
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="items-list">
                      {(activeSubCategory
                        ? menuCategories
                            .find((c) => c.id === activeCategory)!
                            .children!.find(
                              (sc) => sc.id === activeSubCategory
                            )!.children!
                        : menuCategories.find((c) => c.id === activeCategory)!
                            .children!
                      ).map((item) => (
                        <SortableMenuItem
                          key={item.id}
                          item={item}
                          onDelete={deleteItem}
                        />
                      ))}
                    </div>
                  </SortableContext>
                )}
              </div>
            )}
          </div>
        </DndContext>
      </div>
      <button
        onClick={() => {
          updateMerchant(merchant.id!, {
            ...merchant!,
            menu: menuCategories.map((category) => ({
                ...category,
                children: category.children!.map((subCategory) => ({
                    ...subCategory,
                    children: subCategory.children!.map((menuItem) => ({
                        ...menuItem,
                        product: {
                            id: menuItem.product?.id,
                            name: menuItem.product?.display_name || menuItem.product?.name,
                            category: {
                                id: menuItem.product?.category?.id,
                                name: menuItem.product?.category?.name
                            },
                            prices: menuItem.product?.prices,
                            product_images: menuItem.product?.product_images.map((i) => ({
                                id: i.id,
                                url: i.url,
                            })),
                            status: menuItem.product?.status,
                            sku: menuItem.product?.sku,
                            barcode: menuItem.product?.barcode,
                        },
                    }))
                }))
            })),
          }).then(() => {
            toast.success("Menu saved");
          });
        }}
        className="save-button mt-4"
      >
        Simpan Menu
      </button>
      <Modal show={modalCategory} onClose={() => setModalCategory(false)}>
        <Modal.Header>Tambah Kategori</Modal.Header>
        <Modal.Body>
          <TextInput
            id="name"
            type="text"
            autoFocus
            placeholder="Kategori"
            required={true}
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addNewCategory(categoryName);
                setCategoryName("");
                setTimeout(() => {
                  setModalCategory(false);
                }, 300);
              }
            }}
            className="input-white"
          />
        </Modal.Body>
      </Modal>
      {activeCategory && (
        <Modal
          show={modalSubCategory}
          onClose={() => setModalSubCategory(false)}
        >
          <Modal.Header>Tambah Sub Kategori</Modal.Header>
          <Modal.Body>
            <TextInput
              id="name"
              type="text"
              autoFocus
              placeholder="Kategori"
              required={true}
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addNewSubCategory(activeCategory, subCategoryName);
                  setSubCategoryName("");
                  setTimeout(() => {
                    setModalSubCategory(false);
                  }, 300);
                }
              }}
              className="input-white"
            />
          </Modal.Body>
        </Modal>
      )}
      {activeCategory && activeSubCategory && (
        <Modal size="7xl" show={modalProduct} onClose={() => setModalProduct(false)}>
          <Modal.Header>Tambah Produk</Modal.Header>
          <Modal.Body>
            <div className="grid grid-cols-4 gap-4">
              {merchantProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex-col  py-2 flex  gap-2 items-center cursor-pointer px-2 w-full  justify-between rounded-lg mb-2 last:mb-0 border  h-[200px] hover:bg-[#ffb6b9] "
                  onClick={() => {
                    addNewMenuItem(activeSubCategory, product);
                    setModalProduct(false);
                  }}
                >
                  <div className="w-full h-[100px]">
                    {product.product_images.length == 0 ? (
                      <BsImage className="w-12 h-12 rounded-lg" />
                    ) : (
                      <img
                        className="w-full h-[100px] object-cover rounded-lg"
                        src={product.product_images[0].url}
                        alt={product.name}
                      />
                    )}
                  </div>
                  <div className="flex flex-col w-full">
                    <small className="bg-slate-300 px-3 text-[10px] rounded-xl w-fit">
                      {product.category?.name}
                    </small>
                    <span className="font-bold">{product.name}</span>
                    <span className="text-sm text-gray-500">{product.sku}</span>
                  </div>
                </div>
              ))}
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};
