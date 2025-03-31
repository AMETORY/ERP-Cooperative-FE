import type { FC } from 'react';
import AdminLayout from '../components/layouts/admin';

interface SalesDetailProps {}

const SalesDetail: FC<SalesDetailProps> = ({}) => {
        return (<AdminLayout>
            <div className="p-4">
                <h1 className="text-3xl font-bold text-gray-700">Invoice #12345</h1>
                <div className="flex flex-row items-center justify-between mt-4">
                    <p className="text-base font-medium text-gray-700">Date: 12th January 2022</p>
                    <p className="text-base font-medium text-gray-700">Status: Paid</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-4 mt-4">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left text-gray-700 p-2">Item Name</th>
                                <th className="text-left text-gray-700 p-2">Quantity</th>
                                <th className="text-left text-gray-700 p-2">Price</th>
                                <th className="text-left text-gray-700 p-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-2">Laptop</td>
                                <td className="p-2">2</td>
                                <td className="p-2">$1,000</td>
                                <td className="p-2">$2,000</td>
                            </tr>
                            <tr>
                                <td className="p-2">Mouse</td>
                                <td className="p-2">1</td>
                                <td className="p-2">$50</td>
                                <td className="p-2">$50</td>
                            </tr>
                            <tr>
                                <td className="p-2">Keyboard</td>
                                <td className="p-2">1</td>
                                <td className="p-2">$100</td>
                                <td className="p-2">$100</td>
                            </tr>
                            <tr>
                                <td colSpan={3} className="text-right p-2">Subtotal</td>
                                <td className="p-2">$2,150</td>
                            </tr>
                            <tr>
                                <td colSpan={3} className="text-right p-2">Tax (10%)</td>
                                <td className="p-2">$215</td>
                            </tr>
                            <tr>
                                <td colSpan={3} className="text-right p-2">Total</td>
                                <td className="p-2">$2,365</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>);
}
export default SalesDetail;