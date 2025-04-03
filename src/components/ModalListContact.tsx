import { Modal } from "flowbite-react";
import { useEffect, useState, type FC } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { ContactModel } from "../models/contact";
import { getContacts } from "../services/api/contactApi";

interface ModalListContactProps {
  show: boolean;
  onClose: () => void;
  onSelect: (contact: ContactModel) => void;
}

const ModalListContact: FC<ModalListContactProps> = ({ show, onClose, onSelect }) => {
  const [contacts, setContacts] = useState<ContactModel[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllContact("");
  }, []);
  const getAllContact = (s: string) => {
    getContacts({
      page: 1,
      size: 10,
      search: s,
      is_customer: true,
      is_vendor: true,
      is_supplier: true,
    }).then((res: any) => {
      setContacts(res.data.items);
    });
  };
  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>List Contact</Modal.Header>
      <Modal.Body>
        <div className="relative w-full w-full] mr-6 focus-within:text-purple-500">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <HiMagnifyingGlass />
          </div>
          <input
            type="text"
            className="w-full py-2 pl-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <ul className="mt-4">
          {contacts.map((contact) => (
            <li key={contact.id} className="cursor-pointer px-4 py-2 hover:bg-gray-100" onClick={() => {
                onSelect(contact)
            }}>
              <div>{contact.name}</div>
              <span>{contact.address}</span>
            </li>
          ))}
        </ul>
      </Modal.Body>
    </Modal>
  );
};
export default ModalListContact;
